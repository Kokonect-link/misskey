<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<div ref="rootEl" :class="[$style.root, { [$style.collapsed]: collapsed }]">
	<div>
		<span v-if="note.isHidden" style="opacity: 0.5">({{ i18n.ts.private }})</span>
		<span v-if="note.deletedAt" style="opacity: 0.5">({{ i18n.ts.deletedNote }})</span>
		<MkA v-if="note.replyId" :class="$style.reply" :to="`/notes/${note.replyId}`"><i class="ti ti-arrow-back-up"></i></MkA>
		<Mfm
			v-if="note.text"
			:parsedNodes="parsed"
			:text="note.text"
			:author="note.user"
			:nyaize="defaultStore.state.disableNyaize || noNyaize ? false : 'respect'"
			:emojiUrls="note.emojis"
			:enableEmojiMenu="!!$i"
			:enableEmojiMenuReaction="!!$i"
		/>
		<MkA v-if="note.renoteId" :class="$style.rp" :to="`/notes/${note.renoteId}`">RN: ...</MkA>
		<div v-if="defaultStore.state.showTranslateButtonInNote && (!defaultStore.state.useAutoTranslate || (!$i.policies.canUseAutoTranslate || (defaultStore.state.useAutoTranslate && (isLong || note.cw != null || !showContent)))) && instance.translatorAvailable && $i && $i.policies.canUseTranslator && note.text && isForeignLanguage && !note.isSchedule" style="padding-top: 5px; color: var(--MI_THEME-accent);">
			<button v-if="!(translating || translation)" ref="translateButton" class="_button" @click.stop="translate()">{{ i18n.ts.translateNote }}</button>
			<button v-else class="_button" @click.stop="translation = null">{{ i18n.ts.close }}</button>
		</div>
		<div v-if="translating || translation" :class="$style.translation">
			<MkLoading v-if="translating" mini/>
			<div v-else-if="translation">
				<b>{{ i18n.tsx.translatedFrom({ x: translation.sourceLang }) }}:</b><hr style="margin: 10px 0;">
				<Mfm
					:text="translation.text"
					:author="note.user"
					:nyaize="defaultStore.state.disableNyaize || noNyaize ? false : 'respect'"
					:emojiUrls="note.emojis"
					:enableEmojiMenu="!!$i"
					:enableEmojiMenuReaction="!!$i"
					@click.stop
				/>
				<div v-if="note.poll">
					<MkPoll :noteId="note.id" :poll="note.poll" :author="note.user" :emojiUrls="note.emojis" isTranslation @click.stop/>
				</div>
				<div v-if="translation.translator == 'ctav3'" style="margin-top: 10px; padding: 0 0 15px;">
					<img v-if="!defaultStore.state.darkMode" src="/client-assets/color-short.svg" alt="" style="float: right;">
					<img v-else src="/client-assets/white-short.svg" alt="" style="float: right;"/>
				</div>
			</div>
		</div>
		<div v-if="viewTextSource">
			<hr style="margin: 10px 0;">
			<pre style="margin: initial;"><small>{{ note.text }}</small></pre>
			<button class="_button" style="padding-top: 5px; color: var(--MI_THEME-accent);" @click.stop="viewTextSource = false"><small>{{ i18n.ts.close }}</small></button>
		</div>
		<div v-show="showContent">
			<div v-if="note.files && note.files.length > 0">
				<MkMediaList v-if="note.disableRightClick" :mediaList="note.files" @click.stop @contextmenu.prevent/>
				<MkMediaList v-else :mediaList="note.files" @click.stop/>
			</div>
			<div v-if="note.poll">
				<MkPoll :noteId="note.id" :poll="note.poll" :author="note.user" :emojiUrls="note.emojis" @click.stop/>
			</div>
		</div>
	</div>
	<button v-if="((isLong && defaultStore.state.collapseLongNoteContent) || (isMFM && defaultStore.state.collapseDefault) || (note.files && note.files.length) > 0 || note.poll) && collapsed" v-vibrate="defaultStore.state.vibrateSystem ? 5 : []" :class="$style.fade" class="_button" @click.stop="collapsed = false;">
		<span :class="$style.fadeLabel">
			{{ i18n.ts.showMore }}
			<span v-if="note.files && note.files.length > 0" :class="$style.label">({{ collapseLabel }})</span>
		</span>
	</button>
	<button v-else-if="((isLong && defaultStore.state.collapseLongNoteContent) || (isMFM && defaultStore.state.collapseDefault) || (note.files && note.files.length > 0) || note.poll) && !collapsed" v-vibrate="defaultStore.state.vibrateSystem ? 5 : []" :class="$style.showLess" class="_button" @click.stop="collapsed = true;">
		<span :class="$style.showLessLabel">{{ i18n.ts.showLess }}</span>
	</button>
	<div v-if="showSubNoteFooterButton">
		<MkReactionsViewer v-show="note.cw == null || showContent" :note="note" :maxNumber="16" @click.stop @contextmenu.prevent.stop @mockUpdateMyReaction="emitUpdReaction">
			<template #more>
				<MkA :to="`/notes/${note.id}/reactions`" :class="[$style.reactionOmitted]">{{ i18n.ts.more }}</MkA>
			</template>
		</MkReactionsViewer>
		<footer :class="$style.footer">
			<template v-if="defaultStore.state.showReplyButtonInNoteFooter">
				<button v-if="!note.isHidden" v-vibrate="defaultStore.state.vibrateSystem ? 5 : []" v-tooltip="i18n.ts.reply" :class="$style.footerButton" class="_button" @click.stop="reply()">
					<i class="ti ti-arrow-back-up"></i>
					<p v-if="note.repliesCount > 0" :class="$style.footerButtonCount">{{ note.repliesCount }}</p>
				</button>
				<button v-else-if="note.isHidden" :class="$style.footerButton" class="_button" disabled>
					<i class="ti ti-ban"></i>
				</button>
			</template>
			<template v-if="defaultStore.state.showRenoteButtonInNoteFooter">
				<button
					v-if="canRenote"
					ref="renoteButton"
					v-vibrate="defaultStore.state.vibrateSystem ? [30, 50, 60] : []"
					v-tooltip="i18n.ts.renote"
					:class="$style.footerButton"
					class="_button"
					@click.stop="defaultStore.state.renoteQuoteButtonSeparation && ((!defaultStore.state.renoteVisibilitySelection && !note.channel) || (note.channel && !note.channel.allowRenoteToExternal) || note.visibility === 'followers') ? renoteOnly() : renote()"
				>
					<i class="ti ti-repeat"></i>
					<p v-if="note.renoteCount > 0" :class="$style.footerButtonCount">{{ number(note.renoteCount) }}</p>
				</button>
				<button v-else-if="!canRenote" :class="$style.footerButton" class="_button" disabled>
					<i class="ti ti-ban"></i>
				</button>
			</template>
			<button v-if="note.reactionAcceptance !== 'likeOnly' && note.myReaction == null && defaultStore.state.showLikeButtonInNoteFooter" ref="heartReactButton" v-vibrate="defaultStore.state.vibrateSystem ? [30, 50, 50] : []" v-tooltip="i18n.ts.like" :class="$style.footerButton" class="_button" @click.stop="heartReact()">
				<i class="ti ti-heart"></i>
			</button>
			<button v-if="defaultStore.state.showDoReactionButtonInNoteFooter" ref="reactButton" v-vibrate="defaultStore.state.vibrateSystem ? [30, 50, 50] : []" v-tooltip="note.reactionAcceptance === 'likeOnly' && note.myReaction != null ? i18n.ts.unlike : note.myReaction != null ? i18n.ts.editReaction : note.reactionAcceptance === 'likeOnly' ? i18n.ts.like : i18n.ts.doReaction" :class="$style.footerButton" class="_button" @click.stop="toggleReact()">
				<i v-if="note.reactionAcceptance === 'likeOnly' && note.myReaction != null" class="ti ti-heart-filled" style="color: var(--MI_THEME-love);"></i>
				<i v-else-if="note.myReaction != null" class="ti ti-mood-edit" style="color: var(--MI_THEME-accent);"></i>
				<i v-else-if="note.reactionAcceptance === 'likeOnly'" class="ti ti-heart"></i>
				<i v-else class="ti ti-mood-plus"></i>
				<p v-if="(note.reactionAcceptance === 'likeOnly' || defaultStore.state.showReactionsCount) && note.reactionCount > 0" :class="$style.footerButtonCount">{{ number(note.reactionCount) }}</p>
			</button>
			<button v-if="canRenote && defaultStore.state.renoteQuoteButtonSeparation && defaultStore.state.showQuoteButtonInNoteFooter" ref="quoteButton" v-vibrate="defaultStore.state.vibrateSystem ? 5 : []" v-tooltip="i18n.ts.quote" class="_button" :class="$style.footerButton" @click.stop="quote()">
				<i class="ti ti-quote"></i>
			</button>
			<button v-if="defaultStore.state.showClipButtonInNoteFooter" ref="clipButton" v-vibrate="defaultStore.state.vibrateSystem ? 5 : []" v-tooltip="i18n.ts.clip" :class="$style.footerButton" class="_button" @click.stop="clip()">
				<i class="ti ti-paperclip"></i>
			</button>
			<MkA v-if="defaultStore.state.infoButtonForNoteActionsEnabled && defaultStore.state.showNoteActionsOnlyHover" v-tooltip="i18n.ts.details" :to="notePage(note)" :class="$style.footerButton" style="text-decoration: none;" class="_button">
				<i class="ti ti-info-circle"></i>
			</MkA>
			<button v-if="defaultStore.state.showMoreButtonInNoteFooter" ref="menuButton" v-vibrate="defaultStore.state.vibrateSystem ? 5 : []" v-tooltip="i18n.ts.more" :class="$style.footerButton" class="_button" @click.stop="showMenu()">
				<i class="ti ti-dots"></i>
			</button>
		</footer>
	</div>
</div>
</template>

<script lang="ts" setup>
import { computed, inject, provide, Ref, ref, shallowRef, watch } from 'vue';
import * as mfm from 'mfc-js';
import * as Misskey from 'cherrypick-js';
import { shouldCollapsed, shouldMfmCollapsed } from '@@/js/collapsed.js';
import { concat } from '@@/js/array.js';
import { host } from '@@/js/config.js';
import * as os from '@/os.js';
import * as sound from '@/scripts/sound.js';
import MkMediaList from '@/components/MkMediaList.vue';
import MkPoll from '@/components/MkPoll.vue';
import MkUsersTooltip from '@/components/MkUsersTooltip.vue';
import MkRippleEffect from '@/components/MkRippleEffect.vue';
import MkReactionsViewer from '@/components/MkReactionsViewer.vue';
import { i18n } from '@/i18n.js';
import { $i } from '@/account.js';
import { defaultStore } from '@/store.js';
import { miLocalStorage } from '@/local-storage.js';
import { instance } from '@/instance.js';
import { notePage } from '@/filters/note.js';
import { useTooltip } from '@/scripts/use-tooltip.js';
import { type OpenOnRemoteOptions, pleaseLogin } from '@/scripts/please-login.js';
import { showMovedDialog } from '@/scripts/show-moved-dialog.js';
import { getNoteClipMenu, getNoteMenu, getRenoteMenu, getRenoteOnly, getQuoteMenu } from '@/scripts/get-note-menu.js';
import { deepClone } from '@/scripts/clone.js';
import { reactionPicker } from '@/scripts/reaction-picker.js';
import { claimAchievement } from '@/scripts/achievements.js';
import { useNoteCapture } from '@/scripts/use-note-capture.js';
import { vibrate } from '@/scripts/vibrate.js';
import { misskeyApi } from '@/scripts/misskey-api.js';
import detectLanguage from '@/scripts/detect-language.js';
import number from '@/filters/number.js';

const props = withDefaults(defineProps<{
  note: Misskey.entities.Note & {
		isSchedule? : boolean,
		scheduledNoteId?: string
	};
  mock?: boolean;
  showSubNoteFooterButton?: boolean;
}>(), {
	mock: false,
});

provide('mock', props.mock);

const emit = defineEmits<{
  (ev: 'reaction', emoji: string): void;
  (ev: 'removeReaction', emoji: string): void;
}>();

const note = ref(deepClone(props.note));

const rootEl = shallowRef<HTMLElement>();
const menuButton = shallowRef<HTMLElement>();
const renoteButton = shallowRef<HTMLElement>();
const reactButton = shallowRef<HTMLElement>();
const heartReactButton = shallowRef<HTMLElement>();
const quoteButton = shallowRef<HTMLElement>();
const clipButton = shallowRef<HTMLElement>();
const canRenote = computed(() => ['public', 'home'].includes(props.note.visibility) || (props.note.visibility === 'followers' && props.note.userId === $i.id));
const isDeleted = ref(false);
const currentClip = inject<Ref<Misskey.entities.Clip> | null>('currentClip', null);

const showContent = ref(true);
const translation = ref<Misskey.entities.NotesTranslateResponse | null>(null);
const translating = ref(false);

const viewTextSource = ref(false);
const noNyaize = ref(false);

const parsed = props.note.text ? mfm.parse(props.note.text) : null;

const isLong = shouldCollapsed(props.note, []);
const isMFM = shouldMfmCollapsed(props.note);

const collapsed = ref((isLong && defaultStore.state.collapseLongNoteContent) || (isMFM && defaultStore.state.collapseDefault) || (props.note.files && props.note.files.length > 0) || props.note.poll);

const pleaseLoginContext = computed<OpenOnRemoteOptions>(() => ({
	type: 'lookup',
	url: `https://${host}/notes/${props.note.id}`,
}));

const collapseLabel = computed(() => {
	return concat([
		props.note.files && props.note.files.length !== 0 ? [i18n.tsx._cw.files({ count: props.note.files.length })] : [],
	] as string[][]).join(' / ');
});

if (props.mock) {
	watch(() => props.note, (to) => {
		note.value = deepClone(to);
	}, { deep: true });
} else {
	useNoteCapture({
		rootEl: rootEl,
		note: note,
		pureNote: note,
		isDeletedRef: isDeleted,
	});
}

if (!props.mock) {
	useTooltip(renoteButton, async (showing) => {
		const renotes = await misskeyApi('notes/renotes', {
			noteId: props.note.id,
			limit: 11,
		});

		const users = renotes.map(x => x.user);

		if (users.length < 1) return;

		const { dispose } = os.popup(MkUsersTooltip, {
			showing,
			users,
			count: props.note.renoteCount,
			targetElement: renoteButton.value,
		}, {
			closed: () => dispose(),
		});
	});
}

if (defaultStore.state.alwaysShowCw) showContent.value = true;

watch(() => viewTextSource.value, () => {
	collapsed.value = false;
});

function renote() {
	pleaseLogin({ openOnRemote: pleaseLoginContext.value });
	showMovedDialog();

	const { menu } = getRenoteMenu({ note: note.value, renoteButton, mock: props.mock });
	os.popupMenu(menu, renoteButton.value);
}

async function renoteOnly() {
	pleaseLogin({ openOnRemote: pleaseLoginContext.value });
	showMovedDialog();

	await getRenoteOnly({ note: note.value, renoteButton, mock: props.mock });
}

function quote(): void {
	pleaseLogin({ openOnRemote: pleaseLoginContext.value });
	if (props.mock) {
		return;
	}
	if (props.note.channel) {
		if (props.note.channel.allowRenoteToExternal) {
			const { menu } = getQuoteMenu({ note: note.value, mock: props.mock });
			os.popupMenu(menu, quoteButton.value);
		} else {
			os.post({
				renote: props.note,
				channel: props.note.channel,
			}, () => {
				focus();
			});
		}
	} else {
		os.post({
			renote: props.note,
		}, () => {
			focus();
		});
	}
}

function reply(): void {
	pleaseLogin({ openOnRemote: pleaseLoginContext.value });
	if (props.mock) {
		return;
	}
	os.post({
		reply: props.note,
		channel: props.note.channel,
	}).then(() => {
		focus();
	});
}

function react(): void {
	pleaseLogin({ openOnRemote: pleaseLoginContext.value });
	showMovedDialog();
	if (props.note.reactionAcceptance === 'likeOnly') {
		sound.playMisskeySfx('reaction');

		if (props.mock) {
			return;
		}
		misskeyApi('notes/reactions/create', {
			noteId: props.note.id,
			reaction: '❤️',
		});
		const el = reactButton.value;
		if (el) {
			const rect = el.getBoundingClientRect();
			const x = rect.left + (el.offsetWidth / 2);
			const y = rect.top + (el.offsetHeight / 2);
			const { dispose } = os.popup(MkRippleEffect, { x, y }, {
				end: () => dispose(),
			});
		}
	} else {
		blur();
		reactionPicker.show(reactButton.value ?? null, note.value, reaction => {
			if (props.mock) {
				emit('reaction', reaction);
				return;
			}
			toggleReaction(reaction);
		}, () => {
			focus();
		});
	}
}

async function toggleReaction(reaction) {
	const oldReaction = note.value.myReaction;
	if (oldReaction) {
		const confirm = await os.confirm({
			type: 'warning',
			text: oldReaction !== reaction ? i18n.ts.changeReactionConfirm : i18n.ts.cancelReactionConfirm,
		});
		if (confirm.canceled) return;

		sound.playMisskeySfx('reaction');

		misskeyApi('notes/reactions/delete', {
			noteId: note.value.id,
		}).then(() => {
			if (oldReaction !== reaction) {
				misskeyApi('notes/reactions/create', {
					noteId: note.value.id,
					reaction: reaction,
				});
			}
		});
	} else {
		sound.playMisskeySfx('reaction');

		misskeyApi('notes/reactions/create', {
			noteId: note.value.id,
			reaction: reaction,
		});
	}
	if (note.value.text && note.value.text.length > 100 && (Date.now() - new Date(note.value.createdAt).getTime() < 1000 * 3)) {
		claimAchievement('reactWithoutRead');
	}
}

function heartReact(): void {
	pleaseLogin({ openOnRemote: pleaseLoginContext.value });
	showMovedDialog();

	sound.playMisskeySfx('reaction');

	if (props.mock) {
		return;
	}

	misskeyApi('notes/reactions/create', {
		noteId: props.note.id,
		reaction: defaultStore.state.selectReaction,
	});
	if (props.note.text && props.note.text.length > 100 && (Date.now() - new Date(props.note.createdAt).getTime() < 1000 * 3)) {
		claimAchievement('reactWithoutRead');
	}
	const el = heartReactButton.value;
	if (el) {
		const rect = el.getBoundingClientRect();
		const x = rect.left + (el.offsetWidth / 2);
		const y = rect.top + (el.offsetHeight / 2);
		os.popup(MkRippleEffect, { x, y }, {}, 'end');
	}
}

function undoReact(targetNote: Misskey.entities.Note): void {
	const oldReaction = targetNote.myReaction;
	if (!oldReaction) return;

	if (props.mock) {
		emit('removeReaction', oldReaction);
		return;
	}

	misskeyApi('notes/reactions/delete', {
		noteId: targetNote.id,
	});
}

function toggleReact() {
	if (note.value.myReaction != null && note.value.reactionAcceptance === 'likeOnly') {
		undoReact(note.value);
	} else {
		react();
	}
}

function showMenu(): void {
	if (props.mock) {
		return;
	}

	const { menu, cleanup } = getNoteMenu({ note: note.value, collapsed, translating, translation, viewTextSource, noNyaize, isDeleted, currentClip: currentClip?.value });
	os.popupMenu(menu, menuButton.value).then(focus).finally(cleanup);
}

async function clip(): Promise<void> {
	if (props.mock) {
		return;
	}

	os.popupMenu(await getNoteClipMenu({ note: note.value, isDeleted, currentClip: currentClip?.value }), clipButton.value).then(focus);
}

const isForeignLanguage: boolean = note.value.text != null && (() => {
	const targetLang = (miLocalStorage.getItem('lang') ?? navigator.language).slice(0, 2);
	const postLang = detectLanguage(note.value.text);
	const choicesLang = note.value.poll?.choices.map((choice) => choice.text).join(' ') ?? '';
	const pollLang = detectLanguage(choicesLang);
	return postLang !== '' && (postLang !== targetLang || pollLang !== targetLang);
})();

if (defaultStore.state.useAutoTranslate && instance.translatorAvailable && $i.policies.canUseTranslator && $i.policies.canUseAutoTranslate && !isLong && (note.value.cw == null || showContent.value) && note.value.text && isForeignLanguage) translate();

async function translate(): Promise<void> {
	if (translation.value != null) return;
	collapsed.value = false;
	translating.value = true;

	vibrate(defaultStore.state.vibrateSystem ? 5 : []);

	if (props.mock) {
		return;
	}

	const res = await misskeyApi('notes/translate', {
		noteId: props.note.id,
		targetLang: miLocalStorage.getItem('lang') ?? navigator.language,
	});
	translating.value = false;
	translation.value = res;

	vibrate(defaultStore.state.vibrateSystem ? [5, 5, 10] : []);
}

function focus() {
	rootEl.value?.focus();
}

function blur() {
	rootEl.value?.blur();
}

function emitUpdReaction(emoji: string, delta: number) {
	if (delta < 0) {
		emit('removeReaction', emoji);
	} else if (delta > 0) {
		emit('reaction', emoji);
	}
}
</script>

<style lang="scss" module>
.root {
	overflow-wrap: break-word;

	&.collapsed {
		position: relative;
		min-height: 4.5em;
		max-height: 9em;
		overflow: clip;

		> .fade {
			display: block;
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 74px;
			background: linear-gradient(0deg, var(--MI_THEME-panel), color(from var(--MI_THEME-panel) srgb r g b / 0));
			z-index: 2;

			> .fadeLabel {
				display: inline-block;
				background: var(--MI_THEME-panel);
				padding: 6px 10px;
				font-size: 0.8em;
				border-radius: 999px;
				box-shadow: 0 2px 6px rgb(0 0 0 / 20%);
			}

			&:hover {
				> .fadeLabel {
					background: var(--MI_THEME-panelHighlight);
				}
			}
		}
	}

	.footer {
		position: relative;
		z-index: 1;
	}

	&:hover > .article > .main > .footer > .footerButton {
		opacity: 1;
	}
}

.reply {
	margin-right: 6px;
	color: var(--MI_THEME-accent);
}

.rp {
	margin-left: 4px;
	font-style: oblique;
	color: var(--MI_THEME-renote);
}

.translation {
	border: solid 0.5px var(--MI_THEME-divider);
	border-radius: var(--MI-radius);
	padding: 12px;
	margin-top: 8px;
}

.footer {
	margin: 7px 0 -14px;
}

.footerButton {
	margin: 0;
	padding: 8px;
	opacity: 0.7;

	&:not(:last-child) {
		margin-right: 10px;
	}

	&:hover {
		color: var(--MI_THEME-fgHighlighted);
	}
}

.footerButtonCount {
	display: inline;
	margin: 0 0 0 8px;
	opacity: 0.7;
}

@container (max-width: 500px) {
	.footer {
		margin-bottom: -8px;
	}
}

.reactionDetailsButton {
	display: inline-block;
	height: 32px;
	margin: 2px;
	padding: 0 6px;
	border: dashed 1px var(--MI_THEME-divider);
	border-radius: 4px;
	background: transparent;
	opacity: .8;

	&:hover {
		background: var(--MI_THEME-X5);
	}
}

.showLess {
	width: 100%;
	margin-top: 14px;
	position: sticky;
	bottom: calc(var(--MI-stickyBottom, 0px) + 14px);
}

.showLessLabel {
	display: inline-block;
	background: var(--MI_THEME-popup);
	padding: 6px 10px;
	font-size: 0.8em;
	border-radius: 999px;
	box-shadow: 0 2px 6px rgb(0 0 0 / 20%);
}

.reactionOmitted {
	display: inline-block;
	margin-left: 8px;
	opacity: .8;
	font-size: 95%;
}
</style>
