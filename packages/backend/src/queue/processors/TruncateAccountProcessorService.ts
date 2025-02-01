/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Inject, Injectable } from '@nestjs/common';
import { And, In, MoreThan, Not } from 'typeorm';
import { DI } from '@/di-symbols.js';
import type { DriveFilesRepository, NotesRepository, UserNotePiningsRepository, UserProfilesRepository, UsersRepository } from '@/models/_.js';
import type Logger from '@/logger.js';
import { DriveService } from '@/core/DriveService.js';
import type { MiDriveFile } from '@/models/DriveFile.js';
import type { MiNote } from '@/models/Note.js';
import { EmailService } from '@/core/EmailService.js';
import { bindThis } from '@/decorators.js';
import { NoteDeleteService } from '@/core/NoteDeleteService.js';
import { QueueLoggerService } from '../QueueLoggerService.js';
import type * as Bull from 'bullmq';
import type { DbUserTruncateJobData } from '../types.js';

@Injectable()
export class TruncateAccountProcessorService {
	private logger: Logger;

	constructor(
		@Inject(DI.usersRepository)
		private usersRepository: UsersRepository,

		@Inject(DI.userProfilesRepository)
		private userProfilesRepository: UserProfilesRepository,

		@Inject(DI.notesRepository)
		private notesRepository: NotesRepository,

		@Inject(DI.userNotePiningsRepository)
		private userNotePiningsRepository: UserNotePiningsRepository,

		@Inject(DI.driveFilesRepository)
		private driveFilesRepository: DriveFilesRepository,

		private driveService: DriveService,
		private emailService: EmailService,
		private queueLoggerService: QueueLoggerService,
		private noteDeleteService: NoteDeleteService,
	) {
		this.logger = this.queueLoggerService.logger.createSubLogger('truncate-account');
	}

	@bindThis
	public async process(job: Bull.Job<DbUserTruncateJobData>): Promise<string | void> {
		this.logger.info(`Truncate notes and drives account of ${job.data.user.id} ...`);

		const user = await this.usersRepository.findOneBy({ id: job.data.user.id });
		if (user == null) {
			return;
		}

		const pinings = await this.userNotePiningsRepository.findBy({ userId: user.id });
		const piningNoteIds = pinings.map(pining => pining.noteId); // pining.note always undefined (bug?)

		const specifiedNotes = await this.notesRepository.findBy({
			userId: user.id,
			visibility: Not(In(['public', 'home', 'followers'])),
		});
		const specifiedNoteIds = specifiedNotes.map(note => note.id);

		const keepFileIds = (await Promise.all([...piningNoteIds, ...specifiedNoteIds].map(async (noteId) => {
			const note = await this.notesRepository.findOneBy({ id: noteId });

			return note?.fileIds;
		}))).flat().filter((fileId) => fileId !== undefined);

		{ // Delete notes
			let cursor: MiNote['id'] | null = null;

			while (true) {
				const notes = await this.notesRepository.find({
					where: {
						userId: user.id,
						...(cursor ? {
							id: And(Not(In([...piningNoteIds, ...specifiedNoteIds])), MoreThan(cursor)),
						} : {
							id: Not(In([...piningNoteIds, ...specifiedNoteIds])),
						}),
					},
					take: 100,
					order: {
						id: 1,
					},
				}) as MiNote[];

				if (notes.length === 0) {
					break;
				}

				cursor = notes.at(-1)?.id ?? null;

				await Promise.all(notes.map((note) => {
					return this.noteDeleteService.delete(user, note, false, user);
				}));
			}

			this.logger.succ(`All of notes deleted: ${job.data.user.id}`);
		}

		{ // Delete files
			let cursor: MiDriveFile['id'] | null = null;

			while (true) {
				const files = await this.driveFilesRepository.find({
					where: {
						userId: user.id,
						...(cursor ? {
							id: And(Not(In(keepFileIds)), MoreThan(cursor)),
						} : {
							id: Not(In(keepFileIds)),
						}),
					},
					take: 10,
					order: {
						id: 1,
					},
				}) as MiDriveFile[];

				if (files.length === 0) {
					break;
				}

				cursor = files.at(-1)?.id ?? null;

				for (const file of files) {
					await this.driveService.deleteFileSync(file);
				}
			}

			this.logger.succ(`All of files deleted: ${job.data.user.id}`);
		}

		{ // Send email notification
			const profile = await this.userProfilesRepository.findOneByOrFail({ userId: user.id });
			if (profile.email && profile.emailVerified) {
				this.emailService.sendEmail(profile.email, 'Account truncated',
					'Your account has been truncated.',
					'Your account has been truncated.');
			}
		}

		return `[${job.data.user.id}] Account notes and drives are truncated`;
	}
}
