<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<div
	v-if="!hardMuted && muted === false"
	v-show="!isDeleted"
	ref="rootEl"
	v-hotkey="keymap"
	v-vibrate="defaultStore.state.vibrateSystem ? 5 : []"
	:class="[$style.root, { [$style.showActionsOnlyHover]: defaultStore.state.showNoteActionsOnlyHover, [$style.radius]: defaultStore.state.showGapBetweenNotesInTimeline && mainRouter.currentRoute.value.name === 'my-notifications', [$style.skipRender]: defaultStore.state.skipNoteRender }]"
	:tabindex="isDeleted ? '-1' : '0'"
>
	<div v-if="pinned" :class="$style.tip"><i class="ti ti-pin"></i> {{ i18n.ts.pinnedNote }}</div>
	<!--<div v-if="appearNote._prId_" class="tip"><i class="ti ti-speakerphone"></i> {{ i18n.ts.promotion }}<button class="_textButton hide" @click="readPromo()">{{ i18n.ts.hideThisNote }} <i class="ti ti-x"></i></button></div>-->
	<!--<div v-if="appearNote._featuredId_" class="tip"><i class="ti ti-bolt"></i> {{ i18n.ts.featured }}</div>-->
	<div v-if="isRenote || (appearNote.reply && defaultStore.state.collapseReplies)" :class="$style.renote">
		<div v-if="note.channel" :class="$style.colorBar" :style="{ background: note.channel.color }"></div>
		<MkAvatar v-if="!defaultStore.state.hideAvatarsInNote" :class="$style.renoteAvatar" :user="note.user" link preview/>
		<i :class="isRenote ? 'ti ti-repeat' : appearNote.reply ? 'ti ti-arrow-back-up' : ''" style="margin-right: 4px;"></i>
		<I18n :src="isRenote ? i18n.ts.renotedBy : appearNote.reply ? i18n.ts.repliedBy : ''" tag="span" :class="$style.renoteText">
			<template #user>
				<MkA v-user-preview="note.userId" :class="$style.renoteUserName" :to="userPage(note.user)">
					<MkUserName :user="note.user"/>
				</MkA>
			</template>
		</I18n>
		<div :class="$style.renoteInfo">
			<span v-if="note.visibility !== 'public'" style="margin-right: 0.5em;">
				<i v-if="note.visibility === 'home'" v-tooltip="i18n.ts._visibility[note.visibility]" class="ti ti-home"></i>
				<i v-else-if="note.visibility === 'followers'" v-tooltip="i18n.ts._visibility[note.visibility]" class="ti ti-lock"></i>
				<i v-else-if="note.visibility === 'specified'" ref="specified" v-tooltip="i18n.ts._visibility[note.visibility]" class="ti ti-mail"></i>
			</span>
			<span v-if="note.reactionAcceptance != null" style="margin-right: 0.5em;" :class="{ [$style.danger]: ['nonSensitiveOnly', 'nonSensitiveOnlyForLocalLikeOnlyForRemote', 'likeOnly'].includes(<string>note.reactionAcceptance) }" :title="i18n.ts.reactionAcceptance">
				<i v-if="note.reactionAcceptance === 'likeOnlyForRemote'" v-tooltip="i18n.ts.likeOnlyForRemote" class="ti ti-heart-plus"></i>
				<i v-else-if="note.reactionAcceptance === 'nonSensitiveOnly'" v-tooltip="i18n.ts.nonSensitiveOnly" class="ti ti-icons"></i>
				<i v-else-if="note.reactionAcceptance === 'nonSensitiveOnlyForLocalLikeOnlyForRemote'" v-tooltip="i18n.ts.nonSensitiveOnlyForLocalLikeOnlyForRemote" class="ti ti-heart-plus"></i>
				<i v-else-if="note.reactionAcceptance === 'likeOnly'" v-tooltip="i18n.ts.likeOnly" class="ti ti-heart"></i>
			</span>
			<span v-if="note.localOnly" style="margin-right: 0.5em;"><i v-tooltip="i18n.ts._visibility['disableFederation']" class="ti ti-rocket-off"></i></span>
			<span v-if="note.channel" style="margin-right: 0.5em;"><i v-tooltip="note.channel.name" class="ti ti-device-tv"></i></span>
			<span :class="$style.renoteTime">
				<button ref="renoteTime" class="_button">
					<i class="ti ti-dots" :class="$style.renoteMenu" @mousedown.prevent="showRenoteMenu()"></i>
				</button>
				<MkA :to="notePage(note)">
					<MkTime :time="note.createdAt" :mode="defaultStore.state.enableAbsoluteTime ? 'absolute' : 'relative'"/>
				</MkA>
			</span>
		</div>
	</div>
	<MkNoteSub v-if="appearNote.reply && !renoteCollapsed && !replyCollapsed && notification && defaultStore.state.showReplyInNotification" :note="appearNote.reply" :class="$style.replyTo"/>
	<MkNoteSub v-else-if="appearNote.reply && !renoteCollapsed && !replyCollapsed && !notification" :note="appearNote.reply" :class="[$style.replyTo, { [$style.showReplyTargetNoteInSemiTransparent]: defaultStore.state.showReplyTargetNoteInSemiTransparent }]"/>
	<div v-if="renoteCollapsed || replyCollapsed" :class="$style.collapsedRenoteTarget">
		<MkAvatar v-if="!defaultStore.state.hideAvatarsInNote" :class="$style.collapsedRenoteTargetAvatar" :user="appearNote.user" link preview/>
		<Mfm :text="getNoteSummary(appearNote)" :plain="true" :nowrap="true" :author="appearNote.user" :nyaize="'respect'" :class="[$style.collapsedRenoteTargetText, { [$style.showReplyTargetNoteInSemiTransparent]: defaultStore.state.showReplyTargetNoteInSemiTransparent }]" @click="renoteCollapsed ? renoteCollapsed = false : replyCollapsed ? replyCollapsed = false : ''"/>
	</div>
	<article v-else :class="$style.article" :style="{ cursor: expandOnNoteClick ? 'pointer' : '', paddingTop: defaultStore.state.showSubNoteFooterButton && appearNote.reply && (!renoteCollapsed && !replyCollapsed) ? '14px' : '' }" @click.stop="noteClick" @dblclick.stop="noteDblClick" @contextmenu.stop="onContextmenu">
		<div style="display: flex; padding-bottom: 10px;">
			<div v-if="appearNote.channel" :class="$style.colorBar" :style="{ background: appearNote.channel.color }"></div>
			<MkAvatar v-if="!defaultStore.state.hideAvatarsInNote" :class="[$style.avatar, { [$style.avatarReplyTo]: appearNote.reply, [$style.showEl]: !appearNote.reply && (showEl && ['hideHeaderOnly', 'hideHeaderFloatBtn', 'hide'].includes(<string>defaultStore.state.displayHeaderNavBarWhenScroll)) && mainRouter.currentRoute.value.name === 'index', [$style.showElTab]: !appearNote.reply && (showEl && ['hideHeaderOnly', 'hideHeaderFloatBtn', 'hide'].includes(<string>defaultStore.state.displayHeaderNavBarWhenScroll)) && mainRouter.currentRoute.value.name !== 'index' }]" :user="appearNote.user" :link="!mock" :preview="!mock" noteClick/>
			<div :class="$style.main">
				<MkNoteHeader :note="appearNote" :mini="true"/>
			</div>
		</div>
		<div style="container-type: inline-size;">
			<MkEvent v-if="appearNote.event" :note="appearNote"/>
			<p v-if="appearNote.cw != null" :class="$style.cw">
				<Mfm
					v-if="appearNote.cw != ''"
					:text="appearNote.cw"
					:author="appearNote.user"
					:nyaize="defaultStore.state.disableNyaize || noNyaize ? false : 'respect'"
					:enableEmojiMenu="!!$i"
					:enableEmojiMenuReaction="!!$i"
				/>
				<MkCwButton v-model="showContent" :text="appearNote.text" :renote="appearNote.renote" :files="appearNote.files" :poll="appearNote.poll" style="margin: 4px 0;" @click.stop/>
			</p>
			<div v-show="appearNote.cw == null || showContent" :class="[{ [$style.contentCollapsed]: collapsed }]">
				<div :class="$style.text">
					<span v-if="appearNote.isHidden" style="opacity: 0.5">({{ i18n.ts._ffVisibility.private }})</span>
					<MkA v-if="appearNote.replyId" :class="$style.replyIcon" :to="`/notes/${appearNote.replyId}`"><i class="ti ti-arrow-back-up"></i></MkA>
					<Mfm
						v-if="appearNote.text"
						:parsedNodes="parsed"
						:text="appearNote.text"
						:author="appearNote.user"
						:nyaize="defaultStore.state.disableNyaize || noNyaize ? false : 'respect'"
						:emojiUrls="appearNote.emojis"
						:enableEmojiMenu="!!$i"
						:enableEmojiMenuReaction="!!$i"
					/>
					<div v-if="defaultStore.state.showTranslateButtonInNote && (!defaultStore.state.useAutoTranslate || (!$i.policies.canUseAutoTranslate || (defaultStore.state.useAutoTranslate && (isLong || appearNote.cw != null || !showContent)))) && instance.translatorAvailable && $i && $i.policies.canUseTranslator && appearNote.text && isForeignLanguage" style="padding-top: 5px; color: var(--MI_THEME-accent);">
						<button v-if="!(translating || translation)" ref="translateButton" class="_button" @click.stop="translate()">{{ i18n.ts.translateNote }}</button>
						<button v-else class="_button" @click.stop="translation = null">{{ i18n.ts.close }}</button>
					</div>
					<div v-if="translating || translation" :class="$style.translation">
						<MkLoading v-if="translating" mini/>
						<div v-else-if="translation">
							<b>{{ i18n.tsx.translatedFrom({ x: translation.sourceLang }) }}:</b><hr style="margin: 10px 0;">
							<Mfm
								:text="translation.text"
								:author="appearNote.user"
								:nyaize="defaultStore.state.disableNyaize || noNyaize ? false : 'respect'"
								:emojiUrls="appearNote.emojis"
								:enableEmojiMenu="!!$i"
								:enableEmojiMenuReaction="!!$i"
								@click.stop
							/>
							<MkPoll v-if="appearNote.poll" :noteId="appearNote.id" :poll="appearNote.poll" :author="appearNote.user" :emojiUrls="appearNote.emojis" :class="$style.poll" isTranslation @click.stop/>
							<div v-if="translation.translator == 'ctav3'" style="margin-top: 10px; padding: 0 0 15px;">
								<img v-if="!defaultStore.state.darkMode" src="/client-assets/color-short.svg" alt="" style="float: right;">
								<img v-else src="/client-assets/white-short.svg" alt="" style="float: right;"/>
							</div>
						</div>
					</div>
					<div v-if="viewTextSource">
						<hr style="margin: 10px 0;">
						<pre style="margin: initial;"><small>{{ appearNote.text }}</small></pre>
						<button class="_button" style="padding-top: 5px; color: var(--MI_THEME-accent);" @click.stop="viewTextSource = false"><small>{{ i18n.ts.close }}</small></button>
					</div>
				</div>
				<div v-if="appearNote.files && appearNote.files.length > 0">
					<MkMediaList v-if="appearNote.disableRightClick" ref="galleryEl" :mediaList="appearNote.files" @click.stop @contextmenu.prevent/>
					<MkMediaList v-else ref="galleryEl" :mediaList="appearNote.files" @click.stop/>
				</div>
				<MkPoll v-if="appearNote.poll" :noteId="appearNote.id" :poll="appearNote.poll" :author="appearNote.user" :emojiUrls="appearNote.emojis" :class="$style.poll" @click.stop/>
				<div v-if="isEnabledUrlPreview">
					<MkUrlPreview v-for="url in urls" :key="url" :url="url" :compact="true" :detail="false" :class="$style.urlPreview"/>
				</div>
				<button v-if="((isLong && defaultStore.state.collapseLongNoteContent) || (isMFM && defaultStore.state.collapseDefault) || (appearNote.files && appearNote.files.length > 0 && defaultStore.state.allMediaNoteCollapse)) && collapsed" v-vibrate="defaultStore.state.vibrateSystem ? 5 : []" :class="$style.collapsed" class="_button" @click.stop="collapsed = false">
					<span :class="$style.collapsedLabel">
						{{ i18n.ts.showMore }}
						<span v-if="appearNote.files && appearNote.files.length > 0" :class="$style.label">({{ collapseLabel }})</span>
					</span>
				</button>
				<button v-else-if="((isLong && defaultStore.state.collapseLongNoteContent) || (isMFM && defaultStore.state.collapseDefault) || (appearNote.files && appearNote.files.length > 0 && defaultStore.state.allMediaNoteCollapse)) && !collapsed" v-vibrate="defaultStore.state.vibrateSystem ? 5 : []" :class="$style.showLess" class="_button" @click.stop="collapsed = true">
					<span :class="$style.showLessLabel">{{ i18n.ts.showLess }}</span>
				</button>
			</div>
			<MkA v-if="appearNote.channel && !inChannel" :class="$style.channel" :to="`/channels/${appearNote.channel.id}`"><i class="ti ti-device-tv"></i> {{ appearNote.channel.name }}</MkA>
		</div>
		<div v-if="appearNote.renote" :class="$style.quote"><MkNoteSimple :note="appearNote.renote" :class="$style.quoteNote"/></div>
		<div>
			<MkReactionsViewer v-if="appearNote.reactionAcceptance !== 'likeOnly'" :note="appearNote" :maxNumber="16" @click.stop @contextmenu.prevent.stop @mockUpdateMyReaction="emitUpdReaction">
				<template #more>
					<MkA :to="`/notes/${appearNote.id}/reactions`" :class="[$style.reactionOmitted]">{{ i18n.ts.more }}</MkA>
				</template>
			</MkReactionsViewer>
			<footer :class="$style.footer">
				<template v-if="defaultStore.state.showReplyButtonInNoteFooter">
					<button v-if="!note.isHidden" v-vibrate="defaultStore.state.vibrateSystem ? 5 : []" v-tooltip="i18n.ts.reply" :class="$style.footerButton" class="_button" @click.stop="reply()">
						<i class="ti ti-arrow-back-up"></i>
						<p v-if="appearNote.repliesCount > 0" :class="$style.footerButtonCount">{{ number(appearNote.repliesCount) }}</p>
					</button>
					<button v-else-if="note.isHidden" :class="$style.footerButton" class="_button" disabled>
						<i class="ti ti-ban"></i>
					</button>
				</template>
				<template v-if="defaultStore.state.showRenoteButtonInNoteFooter">
					<button
						v-if="canRenote"
						ref="renoteButton"
						v-vibrate="defaultStore.state.vibrateSystem ? [30, 30, 60] : []"
						v-tooltip="i18n.ts.renote"
						:class="$style.footerButton"
						class="_button"
						@click.stop="defaultStore.state.renoteQuoteButtonSeparation && ((!defaultStore.state.renoteVisibilitySelection && !appearNote.channel) || (appearNote.channel && !appearNote.channel.allowRenoteToExternal) || appearNote.visibility === 'followers') ? renoteOnly() : renote()"
					>
						<i class="ti ti-repeat"></i>
						<p v-if="appearNote.renoteCount > 0" :class="$style.footerButtonCount">{{ number(appearNote.renoteCount) }}</p>
					</button>
					<button v-else-if="!canRenote" :class="$style.footerButton" class="_button" disabled>
						<i class="ti ti-ban"></i>
					</button>
				</template>
				<button v-if="appearNote.reactionAcceptance !== 'likeOnly' && appearNote.myReaction == null && defaultStore.state.showLikeButtonInNoteFooter" ref="heartReactButton" v-vibrate="defaultStore.state.vibrateSystem ? [30, 50, 50] : []" v-tooltip="i18n.ts.like" :class="$style.footerButton" class="_button" @click.stop="heartReact()">
					<i class="ti ti-heart"></i>
				</button>
				<button v-if="defaultStore.state.showDoReactionButtonInNoteFooter" ref="reactButton" v-vibrate="defaultStore.state.vibrateSystem ? [30, 50, 50] : []" v-tooltip="appearNote.reactionAcceptance === 'likeOnly' && appearNote.myReaction != null ? i18n.ts.unlike : appearNote.myReaction != null ? i18n.ts.editReaction : appearNote.reactionAcceptance === 'likeOnly' ? i18n.ts.like : i18n.ts.doReaction" :class="$style.footerButton" class="_button" @click.stop="toggleReact()">
					<i v-if="appearNote.reactionAcceptance === 'likeOnly' && appearNote.myReaction != null" class="ti ti-heart-filled" style="color: var(--MI_THEME-love);"></i>
					<i v-else-if="appearNote.myReaction != null" class="ti ti-mood-edit" style="color: var(--MI_THEME-accent);"></i>
					<i v-else-if="appearNote.reactionAcceptance === 'likeOnly'" class="ti ti-heart"></i>
					<i v-else class="ti ti-mood-plus"></i>
					<p v-if="(appearNote.reactionAcceptance === 'likeOnly' || defaultStore.state.showReactionsCount) && appearNote.reactionCount > 0" :class="$style.footerButtonCount">{{ number(appearNote.reactionCount) }}</p>
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
	</article>
</div>
<div v-else-if="!hardMuted" :class="$style.muted" @click="muted = false">
	<I18n v-if="muted === 'sensitiveMute'" :src="i18n.ts.userSaysSomethingSensitive" tag="small">
		<template #name>
			<MkA v-user-preview="appearNote.userId" :to="userPage(appearNote.user)">
				<MkUserName :user="appearNote.user"/>
			</MkA>
		</template>
	</I18n>
	<I18n v-else-if="showSoftWordMutedWord !== true" :src="i18n.ts.userSaysSomething" tag="small">
		<template #name>
			<MkA v-user-preview="appearNote.userId" :to="userPage(appearNote.user)">
				<MkUserName :user="appearNote.user"/>
			</MkA>
		</template>
	</I18n>
	<I18n v-else :src="i18n.ts.userSaysSomethingAbout" tag="small">
		<template #name>
			<MkA v-user-preview="appearNote.userId" :to="userPage(appearNote.user)">
				<MkUserName :user="appearNote.user"/>
			</MkA>
		</template>
		<template #word>
			{{ Array.isArray(muted) ? muted.map(words => Array.isArray(words) ? words.join() : words).slice(0, 3).join(' ') : muted }}
		</template>
	</I18n>
</div>
<div v-else>
	<!--
		MkDateSeparatedList uses TransitionGroup which requires single element in the child elements
		so MkNote create empty div instead of no elements
	-->
</div>
</template>

<script lang="ts" setup>
import { computed, inject, onMounted, ref, shallowRef, Ref, watch, provide } from 'vue';
import * as mfm from 'mfc-js';
import * as Misskey from 'cherrypick-js';
import { isLink } from '@@/js/is-link.js';
import { shouldCollapsed, shouldMfmCollapsed } from '@@/js/collapsed.js';
import { host } from '@@/js/config.js';
import { concat } from '@@/js/array.js';
import type { MenuItem } from '@/types/menu.js';
import MkNoteSub from '@/components/MkNoteSub.vue';
import MkNoteHeader from '@/components/MkNoteHeader.vue';
import MkNoteSimple from '@/components/MkNoteSimple.vue';
import MkReactionsViewer from '@/components/MkReactionsViewer.vue';
import MkReactionsViewerDetails from '@/components/MkReactionsViewer.details.vue';
import MkMediaList from '@/components/MkMediaList.vue';
import MkCwButton from '@/components/MkCwButton.vue';
import MkPoll from '@/components/MkPoll.vue';
import MkUsersTooltip from '@/components/MkUsersTooltip.vue';
import MkUrlPreview from '@/components/MkUrlPreview.vue';
import MkEvent from '@/components/MkEvent.vue';
import { pleaseLogin, type OpenOnRemoteOptions } from '@/scripts/please-login.js';
import { checkWordMute } from '@/scripts/check-word-mute.js';
import { notePage } from '@/filters/note.js';
import { userPage } from '@/filters/user.js';
import number from '@/filters/number.js';
import * as os from '@/os.js';
import * as sound from '@/scripts/sound.js';
import { misskeyApi, misskeyApiGet } from '@/scripts/misskey-api.js';
import { defaultStore, noteViewInterruptors } from '@/store.js';
import { reactionPicker } from '@/scripts/reaction-picker.js';
import { extractUrlFromMfm } from '@/scripts/extract-url-from-mfm.js';
import { $i } from '@/account.js';
import { i18n } from '@/i18n.js';
import { getAbuseNoteMenu, getCopyNoteLinkMenu, getNoteClipMenu, getNoteMenu, getRenoteMenu, getRenoteOnly, getQuoteMenu } from '@/scripts/get-note-menu.js';
import { useNoteCapture } from '@/scripts/use-note-capture.js';
import { deepClone } from '@/scripts/clone.js';
import { useTooltip } from '@/scripts/use-tooltip.js';
import { claimAchievement } from '@/scripts/achievements.js';
import { getNoteSummary } from '@/scripts/get-note-summary.js';
import MkRippleEffect from '@/components/MkRippleEffect.vue';
import { showMovedDialog } from '@/scripts/show-moved-dialog.js';
import { isEnabledUrlPreview, instance } from '@/instance.js';
import { type Keymap } from '@/scripts/hotkey.js';
import { focusPrev, focusNext } from '@/scripts/focus.js';
import { getAppearNote } from '@/scripts/get-appear-note.js';
import { globalEvents } from '@/events.js';
import { mainRouter } from '@/router/main.js';
import { useRouter } from '@/router/supplier.js';
import { miLocalStorage } from '@/local-storage.js';
import { vibrate } from '@/scripts/vibrate.js';
import detectLanguage from '@/scripts/detect-language.js';

const showEl = ref(false);

const props = withDefaults(defineProps<{
	note: Misskey.entities.Note;
	pinned?: boolean;
	mock?: boolean;
	withHardMute?: boolean;
  notification?: boolean;
}>(), {
	mock: false,
});

provide('mock', props.mock);

const emit = defineEmits<{
  (ev: 'reaction', emoji: string): void;
  (ev: 'removeReaction', emoji: string): void;
}>();

const inTimeline = inject<boolean>('inTimeline', false);
const tl_withSensitive = inject<Ref<boolean>>('tl_withSensitive', ref(true));
const inChannel = inject('inChannel', null);
const currentClip = inject<Ref<Misskey.entities.Clip> | null>('currentClip', null);

const note = ref(deepClone(props.note));

// plugin
if (noteViewInterruptors.length > 0) {
	onMounted(async () => {
		let result: Misskey.entities.Note | null = deepClone(note.value);
		for (const interruptor of noteViewInterruptors) {
			try {
				result = await interruptor.handler(result!) as Misskey.entities.Note | null;
				if (result === null) {
					isDeleted.value = true;
					return;
				}
			} catch (err) {
				console.error(err);
			}
		}
		note.value = result as Misskey.entities.Note;
	});
}

const isRenote = Misskey.note.isPureRenote(note.value);

const rootEl = shallowRef<HTMLElement>();
const menuButton = shallowRef<HTMLElement>();
const renoteButton = shallowRef<HTMLElement>();
const renoteTime = shallowRef<HTMLElement>();
const reactButton = shallowRef<HTMLElement>();
const heartReactButton = shallowRef<HTMLElement>();
const quoteButton = shallowRef<HTMLElement>();
const clipButton = shallowRef<HTMLElement>();
const appearNote = computed(() => getAppearNote(note.value));
const galleryEl = shallowRef<InstanceType<typeof MkMediaList>>();
const isMyRenote = $i && ($i.id === note.value.userId);
const showContent = ref(false);
const parsed = computed(() => appearNote.value.text ? mfm.parse(appearNote.value.text) : null);
const urls = computed(() => parsed.value ? extractUrlFromMfm(parsed.value).filter((url) => appearNote.value.renote?.url !== url && appearNote.value.renote?.uri !== url) : null);
const isLong = shouldCollapsed(appearNote.value, urls.value ?? []);
const isMFM = shouldMfmCollapsed(appearNote.value);
const collapsed = ref(appearNote.value.cw == null && ((isLong && defaultStore.state.collapseLongNoteContent) || (isMFM && defaultStore.state.collapseDefault) || (appearNote.value.files.length > 0 && defaultStore.state.allMediaNoteCollapse)));
const isDeleted = ref(false);
const muted = ref(checkMute(appearNote.value, $i?.mutedWords));
const hardMuted = ref(props.withHardMute && checkMute(appearNote.value, $i?.hardMutedWords, true));
const showSoftWordMutedWord = computed(() => defaultStore.state.showSoftWordMutedWord);
const translation = ref<Misskey.entities.NotesTranslateResponse | null>(null);
const translating = ref(false);
const viewTextSource = ref(false);
const noNyaize = ref(false);
const canRenote = computed(() => ['public', 'home'].includes(appearNote.value.visibility) || (appearNote.value.visibility === 'followers' && appearNote.value.userId === $i?.id));
const expandOnNoteClick = defaultStore.state.expandOnNoteClick;
const router = useRouter();
const renoteCollapsed = ref(
	defaultStore.state.collapseRenotes && isRenote && (
		($i && ($i.id === note.value.userId || $i.id === appearNote.value.userId)) || // `||` must be `||`! See https://github.com/misskey-dev/misskey/issues/13131
		(appearNote.value.myReaction != null)
	),
);
const replyCollapsed = ref(
	defaultStore.state.collapseReplies && appearNote.value.reply && appearNote.value.myReaction == null,
);

const pleaseLoginContext = computed<OpenOnRemoteOptions>(() => ({
	type: 'lookup',
	url: `https://${host}/notes/${appearNote.value.id}`,
}));

const collapseLabel = computed(() => {
	return concat([
		appearNote.value.files && appearNote.value.files.length !== 0 ? [i18n.tsx._cw.files({ count: appearNote.value.files.length })] : [],
	] as string[][]).join(' / ');
});

/* Overload FunctionにLintが対応していないのでコメントアウト
function checkMute(noteToCheck: Misskey.entities.Note, mutedWords: Array<string | string[]> | undefined | null, checkOnly: true): boolean;
function checkMute(noteToCheck: Misskey.entities.Note, mutedWords: Array<string | string[]> | undefined | null, checkOnly: false): Array<string | string[]> | false | 'sensitiveMute';
*/
function checkMute(noteToCheck: Misskey.entities.Note, mutedWords: Array<string | string[]> | undefined | null, checkOnly = false): Array<string | string[]> | false | 'sensitiveMute' {
	if (mutedWords == null) return false;

	const result = checkWordMute(noteToCheck, $i, mutedWords);
	if (Array.isArray(result)) return result;

	const replyResult = noteToCheck.reply && checkWordMute(noteToCheck.reply, $i, mutedWords);
	if (Array.isArray(replyResult)) return replyResult;

	const renoteResult = noteToCheck.renote && checkWordMute(noteToCheck.renote, $i, mutedWords);
	if (Array.isArray(renoteResult)) return renoteResult;

	if (checkOnly) return false;

	if (inTimeline && tl_withSensitive.value === false && noteToCheck.files?.some((v) => v.isSensitive)) {
		return 'sensitiveMute';
	}

	return false;
}

const keymap = {
	'r': () => {
		if (renoteCollapsed.value) return;
		if (replyCollapsed.value) return;
		reply();
	},
	'e|a|plus': () => {
		if (renoteCollapsed.value) return;
		if (replyCollapsed.value) return;
		react();
	},
	'q': () => {
		if (renoteCollapsed.value) return;
		if (replyCollapsed.value) return;
		renote();
	},
	'm': () => {
		if (renoteCollapsed.value) return;
		if (replyCollapsed.value) return;
		showMenu();
	},
	'c': () => {
		if (renoteCollapsed.value) return;
		if (replyCollapsed.value) return;
		if (!defaultStore.state.showClipButtonInNoteFooter) return;
		clip();
	},
	'o': () => {
		if (renoteCollapsed.value) return;
		if (replyCollapsed.value) return;
		galleryEl.value?.openGallery();
	},
	'v|enter': () => {
		if (renoteCollapsed.value) {
			renoteCollapsed.value = false;
		} else if (replyCollapsed.value) {
			replyCollapsed.value = false;
		} else if (appearNote.value.cw != null) {
			showContent.value = !showContent.value;
		} else if (isLong || isMFM) {
			collapsed.value = !collapsed.value;
		}
	},
	'esc': {
		allowRepeat: true,
		callback: () => blur(),
	},
	'up|k|shift+tab': {
		allowRepeat: true,
		callback: () => focusBefore(),
	},
	'down|j|tab': {
		allowRepeat: true,
		callback: () => focusAfter(),
	},
} as const satisfies Keymap;

provide('react', (reaction: string) => {
	misskeyApi('notes/reactions/create', {
		noteId: appearNote.value.id,
		reaction: reaction,
	});
});

onMounted(() => {
	globalEvents.on('showEl', (showEl_receive) => {
		showEl.value = showEl_receive;
	});
});

if (props.mock) {
	watch(() => props.note, (to) => {
		note.value = deepClone(to);
	}, { deep: true });
} else {
	useNoteCapture({
		rootEl: rootEl,
		note: appearNote,
		pureNote: note,
		isDeletedRef: isDeleted,
	});
}

if (!props.mock) {
	useTooltip(renoteButton, async (showing) => {
		const renotes = await misskeyApi('notes/renotes', {
			noteId: appearNote.value.id,
			limit: 11,
		});

		const users = renotes.map(x => x.user);

		if (users.length < 1) return;

		const { dispose } = os.popup(MkUsersTooltip, {
			showing,
			users,
			count: appearNote.value.renoteCount,
			targetElement: renoteButton.value,
		}, {
			closed: () => dispose(),
		});
	});

	if (appearNote.value.reactionAcceptance === 'likeOnly') {
		useTooltip(reactButton, async (showing) => {
			const reactions = await misskeyApiGet('notes/reactions', {
				noteId: appearNote.value.id,
				limit: 10,
				_cacheKey_: appearNote.value.reactionCount,
			});

			const users = reactions.map(x => x.user);

			if (users.length < 1) return;

			const { dispose } = os.popup(MkReactionsViewerDetails, {
				showing,
				reaction: '❤️',
				users,
				count: appearNote.value.reactionCount,
				targetElement: reactButton.value!,
			}, {
				closed: () => dispose(),
			});
		});
	}
}

if (defaultStore.state.alwaysShowCw) showContent.value = true;

watch(() => viewTextSource.value, () => {
	collapsed.value = false;
});

function noteClick(ev: MouseEvent) {
	if (!expandOnNoteClick || window.getSelection()?.toString() !== '' || defaultStore.state.expandOnNoteClickBehavior === 'doubleClick') ev.stopPropagation();
	else router.push(notePage(appearNote.value));
}

function noteDblClick(ev: MouseEvent) {
	if (!expandOnNoteClick || window.getSelection()?.toString() !== '' || defaultStore.state.expandOnNoteClickBehavior === 'click') ev.stopPropagation();
	else router.push(notePage(appearNote.value));
}

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
	if (appearNote.value.channel) {
		if (appearNote.value.channel.allowRenoteToExternal) {
			const { menu } = getQuoteMenu({ note: note.value, mock: props.mock });
			os.popupMenu(menu, quoteButton.value);
		} else {
			os.post({
				renote: appearNote.value,
				channel: appearNote.value.channel,
			}, () => {
				focus();
			});
		}
	} else {
		os.post({
			renote: appearNote.value,
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
		reply: appearNote.value,
		channel: appearNote.value.channel,
	}).then(() => {
		focus();
	});
}

function react(): void {
	pleaseLogin({ openOnRemote: pleaseLoginContext.value });
	showMovedDialog();
	if (appearNote.value.reactionAcceptance === 'likeOnly') {
		sound.playMisskeySfx('reaction');

		if (props.mock) {
			return;
		}

		misskeyApi('notes/reactions/create', {
			noteId: appearNote.value.id,
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
			noteId: appearNote.value.id,
			reaction: reaction,
		});
	}

	if (appearNote.value.text && appearNote.value.text.length > 100 && (Date.now() - new Date(appearNote.value.createdAt).getTime() < 1000 * 3)) {
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
		noteId: appearNote.value.id,
		reaction: defaultStore.state.selectReaction,
	});

	if (appearNote.value.text && appearNote.value.text.length > 100 && (Date.now() - new Date(appearNote.value.createdAt).getTime() < 1000 * 3)) {
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
	if (appearNote.value.myReaction != null && appearNote.value.reactionAcceptance === 'likeOnly') {
		undoReact(appearNote.value);
	} else {
		react();
	}
}

function onContextmenu(ev: MouseEvent): void {
	if (props.mock) {
		return;
	}

	if (ev.target && isLink(ev.target as HTMLElement)) return;
	if (window.getSelection()?.toString() !== '') return;

	if (defaultStore.state.useReactionPickerForContextMenu) {
		ev.preventDefault();
		react();
	} else {
		const { menu, cleanup } = getNoteMenu({ note: note.value, collapsed, translating, translation, viewTextSource, noNyaize, isDeleted, currentClip: currentClip?.value });
		os.contextMenu(menu, ev).then(focus).finally(cleanup);
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

const isForeignLanguage: boolean = appearNote.value.text != null && (() => {
	const targetLang = (miLocalStorage.getItem('lang') ?? navigator.language).slice(0, 2);
	const postLang = detectLanguage(appearNote.value.text);
	const choicesLang = appearNote.value.poll?.choices.map((choice) => choice.text).join(' ') ?? '';
	const pollLang = detectLanguage(choicesLang);
	return postLang !== '' && (postLang !== targetLang || pollLang !== targetLang);
})();

if (defaultStore.state.useAutoTranslate && instance.translatorAvailable && $i.policies.canUseTranslator && $i.policies.canUseAutoTranslate && !isLong && (appearNote.value.cw == null || showContent.value) && appearNote.value.text && isForeignLanguage) translate();

async function translate(): Promise<void> {
	if (translation.value != null) return;
	collapsed.value = false;
	translating.value = true;

	vibrate(defaultStore.state.vibrateSystem ? 5 : []);

	if (props.mock) {
		return;
	}

	const res = await misskeyApi('notes/translate', {
		noteId: appearNote.value.id,
		targetLang: miLocalStorage.getItem('lang') ?? navigator.language,
	});
	translating.value = false;
	translation.value = res;

	vibrate(defaultStore.state.vibrateSystem ? [5, 5, 10] : []);
}

function showRenoteMenu(): void {
	if (props.mock) {
		return;
	}

	function getUnrenote(): MenuItem {
		return {
			text: i18n.ts.unrenote,
			icon: 'ti ti-trash',
			danger: true,
			action: () => {
				misskeyApi('notes/delete', {
					noteId: note.value.id,
				});
				isDeleted.value = true;
			},
		};
	}

	const renoteDetailsMenu: MenuItem = {
		type: 'link',
		text: i18n.ts.renoteDetails,
		icon: 'ti ti-info-circle',
		to: notePage(note.value),
	};

	if (isMyRenote) {
		pleaseLogin({ openOnRemote: pleaseLoginContext.value });
		os.popupMenu([
			renoteDetailsMenu,
			getCopyNoteLinkMenu(note.value, i18n.ts.copyLinkRenote),
			{ type: 'divider' },
			getUnrenote(),
		], renoteTime.value);
	} else {
		os.popupMenu([
			renoteDetailsMenu,
			getCopyNoteLinkMenu(note.value, i18n.ts.copyLinkRenote),
			{ type: 'divider' },
			getAbuseNoteMenu(note.value, i18n.ts.reportAbuseRenote),
			($i?.isModerator || $i?.isAdmin) ? getUnrenote() : undefined,
		], renoteTime.value);
	}
}

function focus() {
	rootEl.value?.focus();
}

function blur() {
	rootEl.value?.blur();
}

function focusBefore() {
	focusPrev(rootEl.value);
}

function focusAfter() {
	focusNext(rootEl.value);
}

function readPromo() {
	misskeyApi('promo/read', {
		noteId: appearNote.value.id,
	});
	isDeleted.value = true;
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
	position: relative;
	transition: box-shadow 0.1s ease;
	font-size: 1.05em;
	overflow: clip;
	contain: content;
	background: var(--MI_THEME-panel);

	&:focus-visible {
		outline: none;

		&::after {
			content: "";
			pointer-events: none;
			display: block;
			position: absolute;
			z-index: 10;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			margin: auto;
			width: calc(100% - 8px);
			height: calc(100% - 8px);
			border: dashed 2px var(--MI_THEME-focus);
			border-radius: var(--MI-radius);
			box-sizing: border-box;
		}
	}

	.footer {
		position: relative;
		z-index: 1;
	}

	&:hover > .article > .main > .footer > .footerButton {
		opacity: 1;
	}

	&.showActionsOnlyHover {
		.footer {
			visibility: hidden;
			position: absolute;
			top: 12px;
			right: 12px;
			padding: 0 4px;
			margin-bottom: 0 !important;
			background: var(--MI_THEME-popup);
			border-radius: 8px;
			box-shadow: 0 4px 32px var(--MI_THEME-shadow);
		}

		.footerButton {
			font-size: 90%;

			&:not(:last-child) {
				margin-right: 0;
			}
		}
	}

	&.showActionsOnlyHover:hover {
		.footer {
			visibility: visible;
		}
	}

	&.radius {
		border-radius: var(--MI-radius);
	}
}

.skipRender {
	content-visibility: auto;
	contain-intrinsic-size: 0 150px;
}

.tip {
	display: flex;
	align-items: center;
	padding: 24px 38px 16px;
	line-height: 24px;
	font-size: 90%;
	white-space: pre;
	color: #d28a3f;
}

.tip + .article {
	padding-top: 8px;
}

.replyTo {
	padding-bottom: 0;

	&.showReplyTargetNoteInSemiTransparent {
		opacity: 0.7;
	}
}

.renote {
	position: relative;
	display: flex;
	align-items: center;
	padding: 24px 38px 16px;
	line-height: 28px;
	white-space: pre;
	color: var(--MI_THEME-renote);

	& + .article {
		padding-top: 8px;
	}

	> .colorBar {
		height: calc(100% - 6px);
	}
}

.renoteAvatar {
	flex-shrink: 0;
	display: inline-block;
	width: 28px;
	height: 28px;
	margin: 0 8px 0 0;
	background: var(--MI_THEME-panel);
}

.renoteText {
	overflow: hidden;
	flex-shrink: 1;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.renoteUserName {
	font-weight: bold;
	text-decoration: none;

	&:hover {
		color: var(--MI_THEME-renoteHover);
		text-decoration: none;
	}
}

.renoteInfo {
	margin-left: auto;
	font-size: 0.9em;
}

.renoteTime {
	flex-shrink: 0;
	color: inherit;
}

.renoteMenu {
	margin-right: 4px;
}

.collapsedRenoteTarget {
	display: flex;
	align-items: center;
	line-height: 28px;
	white-space: pre;
	padding: 8px 38px 24px;
}

.collapsedRenoteTargetAvatar {
	flex-shrink: 0;
	display: inline-block;
	width: 28px;
	height: 28px;
	margin: 0 8px 0 0;
	background: var(--MI_THEME-panel);
}

.collapsedRenoteTargetText {
	overflow: hidden;
	flex-shrink: 1;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: 90%;
	cursor: pointer;

	&:hover {
		text-decoration: underline;
	}

	&.showReplyTargetNoteInSemiTransparent {
		opacity: 0.7;
	}
}

.article {
	position: relative;
	padding: 28px 32px;
	-webkit-tap-highlight-color: transparent;
}

.colorBar {
	position: absolute;
	top: 8px;
	left: 8px;
	width: 5px;
	height: calc(100% - 16px);
	border-radius: 999px;
	pointer-events: none;
}

.avatar {
	flex-shrink: 0;
	display: block !important;
	position: sticky !important;
	margin: 0 14px 0 0;
	width: 58px;
	height: 58px;
	top: calc(22px + var(--MI-stickyTop, 0px));
	left: 0;
	background: var(--MI_THEME-panel);
	transition: top 0.5s;

	&.avatarReplyTo {
		position: relative !important;
		top: 0 !important;
	}
}

.main {
	flex: 1;
	min-width: 0;
}

.cw {
	cursor: default;
	display: grid;
	margin: 0;
	padding: 0;
	overflow-wrap: break-word;
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

.contentCollapsed {
	position: relative;
	min-height: 4.5em;
	max-height: 9em;
	overflow: clip;
}

.collapsed {
	display: block;
	position: absolute;
	bottom: 0;
	left: 0;
	z-index: 2;
	width: 100%;
	height: 64px;
	background: linear-gradient(0deg, var(--MI_THEME-panel), color(from var(--MI_THEME-panel) srgb r g b / 0));

	&:hover > .collapsedLabel {
		background: var(--MI_THEME-panelHighlight);
	}
}

.collapsedLabel {
	display: inline-block;
	background: var(--MI_THEME-panel);
	padding: 6px 10px;
	font-size: 0.8em;
	border-radius: 999px;
	box-shadow: 0 2px 6px rgb(0 0 0 / 20%);
}

.text {
	overflow-wrap: break-word;
}

.replyIcon {
	color: var(--MI_THEME-accent);
	margin-right: 0.5em;
}

.translation {
	border: solid 0.5px var(--MI_THEME-divider);
	border-radius: var(--MI-radius);
	padding: 12px;
	margin-top: 8px;
}

.urlPreview {
	margin-top: 8px;
}

.poll {
	font-size: 80%;
}

.quote {
	padding: 8px 0;
}

.quoteNote {
	padding: 24px;
	border: dashed 1px var(--MI_THEME-renote);
	border-radius: 8px;
	overflow: clip;
}

.channel {
	opacity: 0.7;
	font-size: 80%;
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

.danger {
	color: var(--MI_THEME-accent);
}

@container (max-width: 580px) {
	.root {
		font-size: 0.95em;
	}

	.renote {
		padding: 24px 28px 16px;
	}

	.collapsedRenoteTarget {
		padding: 8px 28px 24px;
	}

	.article {
		padding: 24px 26px;
	}

	.avatar {
		width: 50px;
		height: 50px;
	}
}

@container (max-width: 500px) {
	.root {
		font-size: 0.9em;
	}

	.article {
		padding: 23px 25px;
	}

	.avatar {
		&.showEl {
			top: 14px;
		}

		&.showElTab {
			top: 54px;
		}
	}

	.footer {
		margin-bottom: -8px;
	}
}

@container (max-width: 480px) {
	.renote {
		padding: 20px 24px 8px;
	}

	.tip {
		padding: 20px 24px 8px;
	}

	.collapsedRenoteTarget {
		padding: 8px 24px 20px;
		margin-top: 4px;
	}

	.article {
		padding: 22px 24px;
	}
}

@container (max-width: 450px) {
	.avatar {
		margin: 0 10px 0 0;
		width: 46px;
		height: 46px;
		top: calc(14px + var(--MI-stickyTop, 0px));
	}
}

@container (max-width: 400px) {
	.root:not(.showActionsOnlyHover) {
		.footerButton {
			&:not(:last-child) {
				margin-right: 18px;
			}
		}
	}
}

@container (max-width: 350px) {
	.root:not(.showActionsOnlyHover) {
		.footerButton {
			&:not(:last-child) {
				margin-right: 12px;
			}
		}
	}

	.colorBar {
		top: 6px;
		left: 6px;
		width: 4px;
		height: calc(100% - 12px);
	}
}

@container (max-width: 300px) {
	.avatar {
		width: 44px;
		height: 44px;
	}

	.root:not(.showActionsOnlyHover) {
		.footerButton {
			&:not(:last-child) {
				margin-right: 8px;
			}
		}
	}
}

@container (max-width: 250px) {
	.quoteNote {
		padding: 12px;
	}
}

.muted {
	padding: 8px;
	text-align: center;
	opacity: 0.7;
}

.reactionOmitted {
	display: inline-block;
	margin-left: 8px;
	opacity: .8;
	font-size: 95%;
}
</style>
