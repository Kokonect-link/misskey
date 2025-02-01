/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Injectable } from '@nestjs/common';
import type { Packed } from '@/misc/json-schema.js';
import { MetaService } from '@/core/MetaService.js';
import { NoteEntityService } from '@/core/entities/NoteEntityService.js';
import { bindThis } from '@/decorators.js';
import { RoleService } from '@/core/RoleService.js';
import type { MiMeta } from '@/models/Meta.js';
import { isRenotePacked, isQuotePacked } from '@/misc/is-renote.js';
import type { JsonObject } from '@/misc/json-value.js';
import Channel, { MiChannelService } from '../channel.js';

class BubbleTimelineChannel extends Channel {
	public readonly chName = 'bubbleTimeline';
	public static shouldShare = false;
	public static requireCredential = false as const;
	private withRenotes: boolean;
	private withFiles: boolean;
	private withCats: boolean;
	private withBots: boolean;
	private instance: MiMeta;

	constructor(
		private metaService: MetaService,
		private roleService: RoleService,
		private noteEntityService: NoteEntityService,

		id: string,
		connection: Channel['connection'],
	) {
		super(id, connection);
		//this.onNote = this.onNote.bind(this);
	}

	@bindThis
	public async init(params: JsonObject) {
		const policies = await this.roleService.getUserPolicies(this.user ? this.user.id : null);
		if (!policies.btlAvailable) return;

		this.withRenotes = !!(params.withRenotes ?? true);
		this.withFiles = !!(params.withFiles ?? false);
		this.withCats = !!(params.withCats ?? false);
		this.withBots = !!(params.withBots ?? true);
		this.instance = await this.metaService.fetch();

		// Subscribe events
		this.subscriber.on('notesStream', this.onNote);
	}

	@bindThis
	private async onNote(note: Packed<'Note'>) {
		if (this.withFiles && (note.fileIds == null || note.fileIds.length === 0)) return;
		if (this.withCats && (note.user.isCat == null || note.user.isCat === false)) return;
		if (!this.withBots && note.user.isBot) return;
		if (this.instance.bubbleInstances == null) return;

		if (!(note.user.host != null && this.instance.bubbleInstances.includes(note.user.host) && note.visibility === 'public' )) return;

		if (note.channelId != null) return;

		if (isRenotePacked(note) && !isQuotePacked(note) && !this.withRenotes) return;

		if (!this.following[note.userId] && note.userId !== this.user!.id) return;

		if (this.isNoteMutedOrBlocked(note)) return;

		if (this.user && isRenotePacked(note) && !isQuotePacked(note)) {
			if (note.renote && Object.keys(note.renote.reactions).length > 0) {
				const myRenoteReaction = await this.noteEntityService.populateMyReaction(note.renote, this.user.id);
				note.renote.myReaction = myRenoteReaction;
			}
		}

		this.connection.cacheNote(note);

		this.send('note', note);
	}

	@bindThis
	public dispose() {
		// Unsubscribe events
		this.subscriber.off('notesStream', this.onNote);
	}
}

@Injectable()
export class BubbleTimelineChannelService implements MiChannelService<false> {
	public readonly shouldShare = BubbleTimelineChannel.shouldShare;
	public readonly requireCredential = BubbleTimelineChannel.requireCredential;
	public readonly kind = BubbleTimelineChannel.kind;

	constructor(
		private metaService: MetaService,
		private roleService: RoleService,
		private noteEntityService: NoteEntityService,
	) {
	}

	@bindThis
	public create(id: string, connection: Channel['connection']): BubbleTimelineChannel {
		return new BubbleTimelineChannel(
			this.metaService,
			this.roleService,
			this.noteEntityService,
			id,
			connection,
		);
	}
}
