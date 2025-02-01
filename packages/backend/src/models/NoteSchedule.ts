/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Entity, Index, Column, PrimaryColumn } from 'typeorm';
import { MiNote } from '@/models/Note.js';
import { id } from './util/id.js';
import { MiUser } from './User.js';
import { MiChannel } from './Channel.js';
import { EventSchema } from './Event.js';
import type { MiDriveFile } from './DriveFile.js';

type MinimumUser = {
	id: MiUser['id'];
	host: MiUser['host'];
	username: MiUser['username'];
	uri: MiUser['uri'];
};

export type MiScheduleNoteType={
	/** Date.toISOString() */
	createdAt: string;
	visibility: 'public' | 'home' | 'followers' | 'specified';
	visibleUsers: MinimumUser[];
	channel?: MiChannel['id'];
	poll: {
		multiple: boolean;
		choices: string[];
		/** Date.toISOString() */
		expiresAt: string | null
	} | undefined;
	renote?: MiNote['id'];
	localOnly: boolean;
	cw?: string | null;
	reactionAcceptance: 'likeOnly' | 'likeOnlyForRemote' | 'nonSensitiveOnly' | 'nonSensitiveOnlyForLocalLikeOnlyForRemote' | null;
	files: MiDriveFile['id'][];
	text?: string | null;
	reply?: MiNote['id'];
	event?: {
		/** Date.toISOString() */
		start: string;
		/** Date.toISOString() */
		end: string | null;
		title: string;
		metadata: EventSchema;
	} | null;
	disableRightClick: boolean,
	apMentions?: MinimumUser[] | null;
	apHashtags?: string[] | null;
	apEmojis?: string[] | null;
	deleteAt?: Date | null;
}

@Entity('note_schedule')
export class MiNoteSchedule {
	@PrimaryColumn(id())
	public id: string;

	@Column('jsonb')
	public note: MiScheduleNoteType;

	@Index()
	@Column('varchar', {
		length: 260,
	})
	public userId: MiUser['id'];

	@Column('timestamp with time zone')
	public scheduledAt: Date;
}
