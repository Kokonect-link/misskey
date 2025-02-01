import type { PureRenote } from './entities.js';

export function isPureRenote(note: {
	renote?:object|null,
	reply?:object|null,
	text:string|null,
	cw?:string|null,
	fileIds?: string[],
	poll?:object|null,
	event?: Record<string, never> | null,
}): note is PureRenote {
	return (
		note.renote != null &&
		note.reply == null &&
		note.text == null &&
		note.cw == null &&
		(note.fileIds == null || note.fileIds.length === 0) &&
		note.poll == null &&
		note.event == null
	);
}
