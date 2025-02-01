/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import process from 'node:process';
import { Global, Inject, Module } from '@nestjs/common';
import * as Redis from 'ioredis';
import { DataSource } from 'typeorm';
import { MeiliSearch } from 'meilisearch';
import { Logging } from '@google-cloud/logging';
import { MiMeta } from '@/models/Meta.js';
import { DI } from './di-symbols.js';
import { Config, loadConfig } from './config.js';
import { createPostgresDataSource } from './postgres.js';
import { RepositoryModule } from './models/RepositoryModule.js';
import { allSettled } from './misc/promise-tracker.js';
import { GlobalEvents } from './core/GlobalEventService.js';
import type { Provider, OnApplicationShutdown } from '@nestjs/common';

const $config: Provider = {
	provide: DI.config,
	useValue: loadConfig(),
};

const $db: Provider = {
	provide: DI.db,
	useFactory: async (config) => {
		const db = createPostgresDataSource(config);
		return await db.initialize();
	},
	inject: [DI.config],
};

const $meilisearch: Provider = {
	provide: DI.meilisearch,
	useFactory: (config: Config) => {
		if (config.fulltextSearch?.provider === 'meilisearch') {
			if (!config.meilisearch) {
				throw new Error('MeiliSearch is enabled but no configuration is provided');
			}

			return new MeiliSearch({
				host: `${config.meilisearch.ssl ? 'https' : 'http'}://${config.meilisearch.host}:${config.meilisearch.port}`,
				apiKey: config.meilisearch.apiKey,
			});
		} else {
			return null;
		}
	},
	inject: [DI.config],
};

const $cloudLogging: Provider = {
	provide: DI.cloudLogging,
	useFactory: (config: Config) => {
		if (config.cloudLogging) {
			return new Logging({
				projectId: config.cloudLogging.projectId, keyFilename: config.cloudLogging.saKeyPath,
			});
		} else {
			return null;
		}
	},
	inject: [DI.config],
};

const $redis: Provider = {
	provide: DI.redis,
	useFactory: (config: Config) => {
		return new Redis.Redis(config.redis);
	},
	inject: [DI.config],
};

const $redisForPub: Provider = {
	provide: DI.redisForPub,
	useFactory: (config: Config) => {
		const redis = new Redis.Redis(config.redisForPubsub);
		return redis;
	},
	inject: [DI.config],
};

const $redisForSub: Provider = {
	provide: DI.redisForSub,
	useFactory: (config: Config) => {
		const redis = new Redis.Redis(config.redisForPubsub);
		redis.subscribe(config.host);
		return redis;
	},
	inject: [DI.config],
};

const $redisForTimelines: Provider = {
	provide: DI.redisForTimelines,
	useFactory: (config: Config) => {
		return new Redis.Redis(config.redisForTimelines);
	},
	inject: [DI.config],
};

const $redisForReactions: Provider = {
	provide: DI.redisForReactions,
	useFactory: (config: Config) => {
		return new Redis.Redis(config.redisForReactions);
	},
	inject: [DI.config],
};

const $meta: Provider = {
	provide: DI.meta,
	useFactory: async (db: DataSource, redisForSub: Redis.Redis) => {
		const meta = await db.transaction(async transactionalEntityManager => {
			// 過去のバグでレコードが複数出来てしまっている可能性があるので新しいIDを優先する
			const metas = await transactionalEntityManager.find(MiMeta, {
				order: {
					id: 'DESC',
				},
			});

			const meta = metas[0];

			if (meta) {
				return meta;
			} else {
				// metaが空のときfetchMetaが同時に呼ばれるとここが同時に呼ばれてしまうことがあるのでフェイルセーフなupsertを使う
				const saved = await transactionalEntityManager
					.upsert(
						MiMeta,
						{
							id: 'x',
						},
						['id'],
					)
					.then((x) => transactionalEntityManager.findOneByOrFail(MiMeta, x.identifiers[0]));

				return saved;
			}
		});

		async function onMessage(_: string, data: string): Promise<void> {
			const obj = JSON.parse(data);

			if (obj.channel === 'internal') {
				const { type, body } = obj.message as GlobalEvents['internal']['payload'];
				switch (type) {
					case 'metaUpdated': {
						for (const key in body.after) {
							(meta as any)[key] = (body.after as any)[key];
						}
						meta.proxyAccount = null; // joinなカラムは通常取ってこないので
						break;
					}
					default:
						break;
				}
			}
		}

		redisForSub.on('message', onMessage);

		return meta;
	},
	inject: [DI.db, DI.redisForSub],
};

const $redisForJobQueue: Provider = {
	provide: DI.redisForJobQueue,
	useFactory: (config: Config) => {
		return new Redis.Redis({
			...config.redisForJobQueue,
			maxRetriesPerRequest: null,
			keyPrefix: undefined,
		});
	},
	inject: [DI.config],
};

@Global()
@Module({
	imports: [RepositoryModule],
	providers: [$config, $db, $meta, $meilisearch, $cloudLogging, $redis, $redisForPub, $redisForSub, $redisForTimelines, $redisForReactions, $redisForJobQueue],
	exports: [$config, $db, $meta, $meilisearch, $cloudLogging, $redis, $redisForPub, $redisForSub, $redisForTimelines, $redisForReactions, $redisForJobQueue, RepositoryModule],
})
export class GlobalModule implements OnApplicationShutdown {
	constructor(
		@Inject(DI.db) private db: DataSource,
		@Inject(DI.redis) private redisClient: Redis.Redis,
		@Inject(DI.redisForPub) private redisForPub: Redis.Redis,
		@Inject(DI.redisForSub) private redisForSub: Redis.Redis,
		@Inject(DI.redisForTimelines) private redisForTimelines: Redis.Redis,
		@Inject(DI.redisForReactions) private redisForReactions: Redis.Redis,
		@Inject(DI.redisForJobQueue) private redisForJobQueue: Redis.Redis,
	) { }

	public async dispose(): Promise<void> {
		// Wait for all potential DB queries
		await allSettled();
		// And then disconnect from DB
		await Promise.all([
			this.db.destroy(),
			this.redisClient.disconnect(),
			this.redisForPub.disconnect(),
			this.redisForSub.disconnect(),
			this.redisForTimelines.disconnect(),
			this.redisForReactions.disconnect(),
			this.redisForJobQueue.disconnect(),
		]);
	}

	async onApplicationShutdown(signal: string): Promise<void> {
		await this.dispose();
		process.emitWarning('CherryPick is shutting down', {
			code: 'CHERRYPICK_SHUTDOWN',
			detail: `Application received ${signal} signal`,
		});
	}
}
