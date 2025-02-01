/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Inject, Injectable } from '@nestjs/common';
import type Logger from '@/logger.js';
import { bindThis } from '@/decorators.js';
import { NoteCreateService } from '@/core/NoteCreateService.js';
import type { ChannelsRepository, DriveFilesRepository, MiDriveFile, NoteScheduleRepository, NotesRepository, UsersRepository } from '@/models/_.js';
import { DI } from '@/di-symbols.js';
import { NotificationService } from '@/core/NotificationService.js';
import { QueueLoggerService } from '../QueueLoggerService.js';
import type * as Bull from 'bullmq';
import type { ScheduleNotePostJobData } from '../types.js';

@Injectable()
export class ScheduleNotePostProcessorService {
	private logger: Logger;

	constructor(
		@Inject(DI.noteScheduleRepository)
		private noteScheduleRepository: NoteScheduleRepository,

		@Inject(DI.usersRepository)
		private usersRepository: UsersRepository,
		@Inject(DI.driveFilesRepository)
		private driveFilesRepository: DriveFilesRepository,
		@Inject(DI.notesRepository)
		private notesRepository: NotesRepository,
		@Inject(DI.channelsRepository)
		private channelsRepository: ChannelsRepository,

			private noteCreateService: NoteCreateService,
			private queueLoggerService: QueueLoggerService,
			private notificationService: NotificationService,
	) {
		this.logger = this.queueLoggerService.logger.createSubLogger('schedule-note-post');
	}

    @bindThis
	public async process(job: Bull.Job<ScheduleNotePostJobData>): Promise<void> {
		this.noteScheduleRepository.findOneBy({ id: job.data.scheduleNoteId }).then(async (data) => {
			if (!data) {
				this.logger.warn(`Schedule note ${job.data.scheduleNoteId} not found`);
			} else {
				const me = await this.usersRepository.findOneBy({ id: data.userId });
				const note = data.note;

				//idの形式でキューに積んであったのをDBから取り寄せる
				const reply = note.reply ? await this.notesRepository.findOneBy({ id: note.reply }) : undefined;
				const renote = note.reply ? await this.notesRepository.findOneBy({ id: note.renote }) : undefined;
				const channel = note.channel ? await this.channelsRepository.findOneBy({ id: note.channel, isArchived: false }) : undefined;
				let files: MiDriveFile[] = [];
				const fileIds = note.files ?? null;
				if (fileIds != null && fileIds.length > 0 && me) {
					files = await this.driveFilesRepository.createQueryBuilder('file')
						.where('file.userId = :userId AND file.id IN (:...fileIds)', {
							userId: me.id,
							fileIds,
						})
						.orderBy('array_position(ARRAY[:...fileIds], "id"::text)')
						.setParameters({ fileIds })
						.getMany();
				}
				if (
					!data.userId ||
					!me ||
					(note.reply && !reply) ||
					(note.renote && !renote) ||
					(note.channel && !channel) ||
					(note.files.length !== files.length)
				) {
					//キューに積んだときは有った物が消滅してたら予約投稿をキャンセルする
					this.logger.warn('cancel schedule note');
					await this.noteScheduleRepository.remove(data);

					if (data.userId && me) {	//ユーザーが特定できる場合に失敗を通知
						let errorType = 'unknown';
						if (note.renote && !renote) {
							errorType = 'renoteTargetNotFound';
						}
						if (note.reply && !reply) {
							errorType = 'replyTargetNotFound';
						}
						if (note.channel && !channel) {
							errorType = 'channelTargetNotFound';
						}
						if (note.files.length !== files.length) {
							errorType = 'invalidFilesCount';
						}
						this.notificationService.createNotification(data.userId, 'scheduleNote', {
							errorType,
						});
					}
					return;
				}
				await this.noteCreateService.create(me, {
					...note,
					createdAt: new Date(note.createdAt), //typeORMのjsonbで何故かstringにされるから戻す
					files,
					poll: note.poll ? {
						choices: note.poll.choices,
						multiple: note.poll.multiple,
						expiresAt: note.poll.expiresAt ? new Date(note.poll.expiresAt) : null,
					} : undefined,
					event: note.event ? {
						start: new Date(note.event.start),
						end: note.event.end ? new Date(note.event.end) : null,
						title: note.event.title,
						metadata: note.event.metadata,
					} : undefined,
					reply,
					renote,
					channel,
				});
				await this.noteScheduleRepository.remove(data);
			}
		});
	}
}
