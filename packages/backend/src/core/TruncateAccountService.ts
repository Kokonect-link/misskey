/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Inject, Injectable } from '@nestjs/common';
import type { UsersRepository } from '@/models/_.js';
import { QueueService } from '@/core/QueueService.js';
import { DI } from '@/di-symbols.js';
import { bindThis } from '@/decorators.js';

@Injectable()
export class TruncateAccountService {
	constructor(
		@Inject(DI.usersRepository)
		private usersRepository: UsersRepository,

		private queueService: QueueService,
	) {
	}

	@bindThis
	public async truncateAccount(user: {
		id: string;
		host: string | null;
	}): Promise<void> {
		const _user = await this.usersRepository.findOneByOrFail({ id: user.id });

		this.queueService.createTruncateAccountJob(user);
	}
}

