<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<div
	v-if="!muted"
	v-show="!isDeleted"
	ref="rootEl"
	v-hotkey="keymap"
	:class="$style.root"
	:tabindex="isDeleted ? '-1' : '0'"
>
	<div v-if="appearNote.reply && appearNote.reply.replyId && !conversationLoaded" style="padding: 16px">
		<MkButton style="margin: 0 auto;" primary rounded @click="loadConversation">{{ i18n.ts.loadConversation }}</MkButton>
	</div>
	<div v-if="isRenote" :class="$style.renote">
		<MkAvatar v-if="!defaultStore.state.hideAvatarsInNote" :class="$style.renoteAvatar" :user="note.user" link preview/>
		<MkA v-user-preview="note.userId" :class="$style.renoteName" :to="userPage(note.user)"/>
		<i class="ti ti-repeat" style="margin-right: 4px;"></i>
		<span :class="$style.renoteText">
			<I18n :src="i18n.ts.renotedBy" tag="span">
				<template #user>
					<MkUserName :class="$style.renoteName" :user="note.user"/>
				</template>
			</I18n>
		</span>
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
			<span :class="$style.renoteTime">
				<button ref="renoteTime" class="_button">
					<i class="ti ti-dots" :class="$style.renoteMenu" @mousedown.prevent="showRenoteMenu()"></i>
				</button>
				<MkTime :time="note.createdAt" :mode="defaultStore.state.enableAbsoluteTime ? 'absolute' : 'relative'"/>
			</span>
		</div>
	</div>
	<template v-if="appearNote.reply && appearNote.reply.replyId"><MkNoteSub v-for="note in conversation" :key="note.id" :class="[$style.replyToMore, { [$style.showReplyTargetNoteInSemiTransparent]: defaultStore.state.showReplyTargetNoteInSemiTransparent }]" :note="note"/></template>
	<MkNoteSub v-if="appearNote.reply" :note="appearNote.reply" :class="[$style.replyTo, { [$style.showReplyTargetNoteInSemiTransparent]: defaultStore.state.showReplyTargetNoteInSemiTransparent }]"/>
	<article :class="$style.note" :style="{ paddingTop: defaultStore.state.showSubNoteFooterButton && appearNote.reply ? '14px' : '' }" @contextmenu.stop="onContextmenu">
		<header :class="$style.noteHeader">
			<MkAvatar v-if="!defaultStore.state.hideAvatarsInNote" :class="$style.noteHeaderAvatar" :user="appearNote.user" indicator link preview/>
			<div style="display: flex; align-items: center; white-space: nowrap; overflow: hidden;">
				<div :class="$style.noteHeaderBody">
					<div :class="$style.noteHeaderName">
						<MkA v-user-preview="appearNote.user.id" :class="$style.noteHeaderName" :to="userPage(appearNote.user)">
							<MkUserName :nowrap="true" :user="appearNote.user"/>
						</MkA>
						<span v-if="appearNote.user.isBot" :class="$style.isBot">bot</span>
						<span v-if="appearNote.user.badgeRoles" :class="$style.badgeRoles">
							<img v-for="role in appearNote.user.badgeRoles" :key="role.id" v-tooltip="role.name" :class="$style.badgeRole" :src="role.iconUrl"/>
						</span>
					</div>
					<div :class="$style.noteHeaderUsername"><MkAcct :user="appearNote.user"/></div>
				</div>
			</div>
			<div style="display: flex; align-items: flex-end; margin-left: auto;">
				<div :class="$style.noteHeaderBody">
					<div :class="$style.noteHeaderInfo">
						<span v-if="appearNote.updatedAt" style="margin-right: 0.5em;"><i v-tooltip="i18n.tsx.noteUpdatedAt({ date: (new Date(appearNote.updatedAt)).toLocaleDateString(), time: (new Date(appearNote.updatedAt)).toLocaleTimeString() })" class="ti ti-pencil"></i></span>
						<span v-if="appearNote.deleteAt" style="margin-right: 0.5em;"><i v-tooltip="`${i18n.ts.scheduledNoteDelete}: ${(new Date(appearNote.deleteAt)).toLocaleString()}`" class="ti ti-bomb"></i></span>
						<span v-if="appearNote.visibility !== 'public'" style="margin-left: 0.5em;">
							<i v-if="appearNote.visibility === 'home'" v-tooltip="i18n.ts._visibility[appearNote.visibility]" class="ti ti-home"></i>
							<i v-else-if="appearNote.visibility === 'followers'" v-tooltip="i18n.ts._visibility[appearNote.visibility]" class="ti ti-lock"></i>
							<i v-else-if="appearNote.visibility === 'specified'" ref="specified" v-tooltip="i18n.ts._visibility[appearNote.visibility]" class="ti ti-mail"></i>
						</span>
						<span v-if="note.reactionAcceptance != null" style="margin-left: 0.5em;" :class="{ [$style.danger]: ['nonSensitiveOnly', 'nonSensitiveOnlyForLocalLikeOnlyForRemote', 'likeOnly'].includes(<string>note.reactionAcceptance) }" :title="i18n.ts.reactionAcceptance">
							<i v-if="note.reactionAcceptance === 'likeOnlyForRemote'" v-tooltip="i18n.ts.likeOnlyForRemote" class="ti ti-heart-plus"></i>
							<i v-else-if="note.reactionAcceptance === 'nonSensitiveOnly'" v-tooltip="i18n.ts.nonSensitiveOnly" class="ti ti-icons"></i>
							<i v-else-if="note.reactionAcceptance === 'nonSensitiveOnlyForLocalLikeOnlyForRemote'" v-tooltip="i18n.ts.nonSensitiveOnlyForLocalLikeOnlyForRemote" class="ti ti-heart-plus"></i>
							<i v-else-if="note.reactionAcceptance === 'likeOnly'" v-tooltip="i18n.ts.likeOnly" class="ti ti-heart"></i>
						</span>
						<span v-if="appearNote.localOnly" style="margin-left: 0.5em;"><i v-tooltip="i18n.ts._visibility['disableFederation']" class="ti ti-rocket-off"></i></span>
					</div>
					<MkInstanceTicker v-if="showTicker" :host="appearNote.user.host" :instance="appearNote.user.instance" @click="showOnRemote"/>
				</div>
				<!--
				<div :class="$style.noteHeaderUsernameAndBadgeRoles">
					<div :class="$style.noteHeaderUsername">
						<MkAcct :user="appearNote.user"/>
					</div>
					<div v-if="appearNote.user.badgeRoles" :class="$style.noteHeaderBadgeRoles">
						<img v-for="(role, i) in appearNote.user.badgeRoles" :key="i" v-tooltip="role.name" :class="$style.noteHeaderBadgeRole" :src="role.iconUrl!"/>
					</div>
				</div>
				-->
			</div>
		</header>
		<div :class="$style.noteContent">
			<MkEvent v-if="appearNote.event" :note="appearNote"/>
			<p v-if="appearNote.cw != null" :class="$style.cw">
				<Mfm
					v-if="appearNote.cw != ''"
					style="margin-right: 8px;"
					:text="appearNote.cw"
					:author="appearNote.user"
					:nyaize="defaultStore.state.disableNyaize || noNyaize ? false : 'respect'"
					:enableEmojiMenu="!!$i"
					:enableEmojiMenuReaction="!!$i"
				/>
				<MkCwButton v-model="showContent" :text="appearNote.text" :renote="appearNote.renote" :files="appearNote.files" :poll="appearNote.poll"/>
			</p>
			<div v-show="appearNote.cw == null || showContent">
				<span v-if="appearNote.isHidden" style="opacity: 0.5">({{ i18n.ts._ffVisibility.private }})</span>
				<MkA v-if="appearNote.replyId" :class="$style.noteReplyTarget" :to="`/notes/${appearNote.replyId}`"><i class="ti ti-arrow-back-up"></i></MkA>
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
				<a v-if="appearNote.renote != null" :class="$style.rn">RN:</a>
				<div v-if="defaultStore.state.showTranslateButtonInNote && (!defaultStore.state.useAutoTranslate || (!$i.policies.canUseAutoTranslate || (defaultStore.state.useAutoTranslate && (appearNote.cw != null || !showContent)))) && instance.translatorAvailable && $i && $i.policies.canUseTranslator && appearNote.text && isForeignLanguage" style="padding-top: 5px; color: var(--MI_THEME-accent);">
					<button v-if="!(translating || translation)" ref="translateButton" class="_button" @click="translate()">{{ i18n.ts.translateNote }}</button>
					<button v-else class="_button" @click="translation = null">{{ i18n.ts.close }}</button>
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
						/>
						<MkPoll v-if="appearNote.poll" ref="pollViewer" :noteId="appearNote.id" :poll="appearNote.poll" :class="$style.poll" :author="appearNote.user" :emojiUrls="appearNote.emojis" isTranslation/>
						<div v-if="translation.translator == 'ctav3'" style="margin-top: 10px; padding: 0 0 15px;">
							<img v-if="!defaultStore.state.darkMode" src="/client-assets/color-short.svg" alt="" style="float: right;">
							<img v-else src="/client-assets/white-short.svg" alt="" style="float: right;"/>
						</div>
					</div>
				</div>
				<div v-if="viewTextSource">
					<hr style="margin: 10px 0;">
					<pre style="margin: initial;"><small>{{ appearNote.text }}</small></pre>
					<button class="_button" style="padding-top: 5px; color: var(--MI_THEME-accent);" @click="viewTextSource = false"><small>{{ i18n.ts.close }}</small></button>
				</div>
				<div v-if="appearNote.files && appearNote.files.length > 0">
					<MkMediaList v-if="appearNote.disableRightClick" ref="galleryEl" :mediaList="appearNote.files" @contextmenu.prevent/>
					<MkMediaList v-else ref="galleryEl" :mediaList="appearNote.files"/>
				</div>
				<MkPoll v-if="appearNote.poll" ref="pollViewer" :noteId="appearNote.id" :poll="appearNote.poll" :class="$style.poll" :author="appearNote.user" :emojiUrls="appearNote.emojis"/>
				<div v-if="isEnabledUrlPreview">
					<MkUrlPreview v-for="url in urls" :key="url" :url="url" :compact="true" :detail="true" style="margin-top: 6px;"/>
				</div>
				<div v-if="appearNote.renote" :class="$style.quote"><MkNoteSimple :note="appearNote.renote" :class="$style.quoteNote"/></div>
			</div>
			<MkA v-if="appearNote.channel && !inChannel" :class="$style.channel" :to="`/channels/${appearNote.channel.id}`"><i class="ti ti-device-tv"></i> {{ appearNote.channel.name }}</MkA>
		</div>
		<footer>
			<div :class="$style.noteFooterInfo">
				<div v-if="appearNote.updatedAt">
					{{ i18n.ts.edited }}: <MkTime :class="$style.time" :time="appearNote.updatedAt" mode="detail" colored/>
				</div>
				<MkA :to="notePage(appearNote)">
					<MkTime :class="$style.time" :time="appearNote.createdAt" mode="detail" colored/>
				</MkA>
				<span style="margin-left: 0.5em;">
					<span style="border: 1px solid var(--MI_THEME-divider); margin-right: 0.5em;"/>
					<i v-if="appearNote.visibility === 'public'" class="ti ti-world"></i>
					<i v-else-if="appearNote.visibility === 'home'" class="ti ti-home"></i>
					<i v-else-if="appearNote.visibility === 'followers'" class="ti ti-lock"></i>
					<i v-else-if="appearNote.visibility === 'specified'" ref="specified" class="ti ti-mail"></i>
					<span style="margin-left: 0.3em;">{{ i18n.ts._visibility[appearNote.visibility] }}</span>
				</span>
			</div>
			<MkReactionsViewer v-if="appearNote.reactionAcceptance !== 'likeOnly'" ref="reactionsViewer" :note="appearNote"/>
			<template v-if="defaultStore.state.showReplyButtonInNoteFooter">
				<button v-if="!note.isHidden" v-vibrate="defaultStore.state.vibrateSystem ? 5 : []" v-tooltip="i18n.ts.reply" class="_button" :class="$style.noteFooterButton" @click="reply()">
					<i class="ti ti-arrow-back-up"></i>
					<p v-if="appearNote.repliesCount > 0" :class="$style.noteFooterButtonCount">{{ number(appearNote.repliesCount) }}</p>
				</button>
				<button v-else-if="note.isHidden" class="_button" :class="$style.noteFooterButton" disabled>
					<i class="ti ti-ban"></i>
				</button>
			</template>
			<template v-if="defaultStore.state.showRenoteButtonInNoteFooter">
				<button
					v-if="canRenote"
					ref="renoteButton"
					v-vibrate="defaultStore.state.vibrateSystem ? [30, 30, 60] : []"
					v-tooltip="i18n.ts.renote"
					class="_button"
					:class="$style.noteFooterButton"
					@click.stop="defaultStore.state.renoteQuoteButtonSeparation && ((!defaultStore.state.renoteVisibilitySelection && !appearNote.channel) || (appearNote.channel && !appearNote.channel.allowRenoteToExternal) || appearNote.visibility === 'followers') ? renoteOnly() : renote()"
				>
					<i class="ti ti-repeat"></i>
					<p v-if="appearNote.renoteCount > 0" :class="$style.noteFooterButtonCount">{{ number(appearNote.renoteCount) }}</p>
				</button>
				<button v-else-if="!canRenote" class="_button" :class="$style.noteFooterButton" disabled>
					<i class="ti ti-ban"></i>
				</button>
			</template>
			<button v-if="appearNote.reactionAcceptance !== 'likeOnly' && appearNote.myReaction == null && defaultStore.state.showLikeButtonInNoteFooter" ref="heartReactButton" v-vibrate="defaultStore.state.vibrateSystem ? [30, 50, 50] : []" v-tooltip="i18n.ts.like" :class="$style.noteFooterButton" class="_button" @click="heartReact()">
				<i class="ti ti-heart"></i>
			</button>
			<button v-if="defaultStore.state.showDoReactionButtonInNoteFooter" ref="reactButton" v-vibrate="defaultStore.state.vibrateSystem ? [30, 50, 50] : []" v-tooltip="appearNote.reactionAcceptance === 'likeOnly' && appearNote.myReaction != null ? i18n.ts.unlike : appearNote.myReaction != null ? i18n.ts.editReaction : appearNote.reactionAcceptance === 'likeOnly' ? i18n.ts.like : i18n.ts.doReaction" :class="$style.noteFooterButton" class="_button" @click.stop="toggleReact()">
				<i v-if="appearNote.reactionAcceptance === 'likeOnly' && appearNote.myReaction != null" class="ti ti-heart-filled" style="color: var(--MI_THEME-love);"></i>
				<i v-else-if="appearNote.myReaction != null" class="ti ti-mood-edit" style="color: var(--MI_THEME-accent);"></i>
				<i v-else-if="appearNote.reactionAcceptance === 'likeOnly'" class="ti ti-heart"></i>
				<i v-else class="ti ti-mood-plus"></i>
				<p v-if="(appearNote.reactionAcceptance === 'likeOnly' || defaultStore.state.showReactionsCount) && appearNote.reactionCount > 0" :class="$style.noteFooterButtonCount">{{ number(appearNote.reactionCount) }}</p>
			</button>
			<button v-if="canRenote && defaultStore.state.renoteQuoteButtonSeparation && defaultStore.state.showQuoteButtonInNoteFooter" ref="quoteButton" v-vibrate="defaultStore.state.vibrateSystem ? 5 : []" v-tooltip="i18n.ts.quote" class="_button" :class="$style.noteFooterButton" @click="quote()">
				<i class="ti ti-quote"></i>
			</button>
			<button v-if="defaultStore.state.showClipButtonInNoteFooter" ref="clipButton" v-vibrate="defaultStore.state.vibrateSystem ? 5 : []" v-tooltip="i18n.ts.clip" class="_button" :class="$style.noteFooterButton" @click="clip()">
				<i class="ti ti-paperclip"></i>
			</button>
			<button v-if="defaultStore.state.showMoreButtonInNoteFooter" ref="menuButton" v-vibrate="defaultStore.state.vibrateSystem ? 5 : []" v-tooltip="i18n.ts.more" class="_button" :class="$style.noteFooterButton" @click="showMenu()">
				<i class="ti ti-dots"></i>
			</button>
		</footer>
	</article>
	<div :class="$style.tabs">
		<button class="_button" :class="[$style.tab, { [$style.tabActive]: tab === 'replies' }]" @click="tab = 'replies'"><i class="ti ti-arrow-back-up"></i> {{ i18n.ts.replies }}</button>
		<button class="_button" :class="[$style.tab, { [$style.tabActive]: tab === 'renotes' }]" @click="tab = 'renotes'"><i class="ti ti-repeat"></i> {{ i18n.ts.renotes }}</button>
		<button class="_button" :class="[$style.tab, { [$style.tabActive]: tab === 'reactions' }]" @click="tab = 'reactions'"><i class="ti ti-icons"></i> {{ i18n.ts.reactions }}</button>
		<button class="_button" :class="[$style.tab, { [$style.tabActive]: tab === 'history' }]" @click="tab = 'history'"><i class="ti ti-pencil"></i> {{ i18n.ts.edited }}</button>
	</div>
	<div>
		<div v-if="tab === 'replies'">
			<MkPostForm v-if="!note.isHidden && !isMobile && defaultStore.state.showFixedPostFormInReplies" class="post-form _panel" fixed :reply="appearNote"></MkPostForm>
			<MkNoteSub v-for="note in replies" :key="note.id" :note="note" :class="$style.reply" :detail="true"/>
			<div v-if="replies.length > 2 && !repliesLoaded" style="padding: 16px">
				<MkButton style="margin: 0 auto;" primary rounded @click="loadReplies">{{ i18n.ts.loadMore }}</MkButton>
			</div>
		</div>
		<div v-else-if="tab === 'renotes'" :class="$style.tab_renotes">
			<MkPagination :pagination="renotesPagination" :disableAutoLoad="true">
				<template #default="{ items }">
					<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); grid-gap: 12px;">
						<MkA v-for="item in items" :key="item.id" :to="userPage(item.user)">
							<MkUserCardMini :user="item.user" :withChart="false"/>
						</MkA>
					</div>
				</template>
			</MkPagination>
		</div>
		<div v-else-if="tab === 'reactions'" :class="$style.tab_reactions">
			<div :class="$style.reactionTabs">
				<button v-for="reaction in Object.keys(appearNote.reactions)" :key="reaction" :class="[$style.reactionTab, { [$style.reactionTabActive]: reactionTabType === reaction }]" class="_button" @click="reactionTabType = reaction">
					<MkReactionIcon :reaction="reaction"/>
					<span style="margin-left: 4px;">{{ appearNote.reactions[reaction] }}</span>
				</button>
			</div>
			<MkPagination v-if="reactionTabType" :key="reactionTabType" :pagination="reactionsPagination" :disableAutoLoad="true">
				<template #default="{ items }">
					<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); grid-gap: 12px;">
						<MkA v-for="item in items" :key="item.id" :to="userPage(item.user)">
							<MkUserCardMini :user="item.user" :withChart="false"/>
						</MkA>
					</div>
				</template>
			</MkPagination>
		</div>
		<div v-else-if="tab === 'history'" :class="$style.tab_history">
			<div style="display: grid;">
				<div v-for="(text, index) in appearNote.noteEditHistory" :key="text" :class="$style.historyRoot">
					<MkAvatar :class="$style.avatar" :user="appearNote.user" link preview/>
					<div :class="$style.historyMain">
						<div :class="$style.historyHeader">
							<MkUserName :user="appearNote.user" :nowrap="true"/>
							<MkTime :class="$style.updatedAt" :time="appearNote.updatedAtHistory![index]" :mode="defaultStore.state.enableAbsoluteTime ? 'absolute' : 'relative'" colored/>
						</div>
						<div>
							<div>
								<span v-if="appearNote.isHidden" style="opacity: 0.5">({{ i18n.ts._ffVisibility.private }})</span>
								<Mfm v-else :text="text.trim()" :author="appearNote.user"/>
							</div>
							<CodeDiff
								v-if="!appearNote.isHidden"
								:oldString="appearNote.noteEditHistory[index - 1] || ''"
								:newString="text"
								:trim="true"
								:hideHeader="true"
								diffStyle="char"
							/>
						</div>
					</div>
				</div>
				<div v-if="appearNote.noteEditHistory == null" class="_fullinfo">
					<img :src="infoImageUrl" class="_ghost"/>
					<div>{{ i18n.ts.nothing }}</div>
				</div>
			</div>
		</div>
	</div>
</div>
<div v-else class="_panel" :class="$style.muted" @click="muted = false">
	<I18n :src="i18n.ts.userSaysSomething" tag="small">
		<template #name>
			<MkA v-user-preview="appearNote.userId" :to="userPage(appearNote.user)">
				<MkUserName :user="appearNote.user"/>
			</MkA>
		</template>
	</I18n>
</div>
</template>

<script lang="ts" setup>
import { computed, inject, onMounted, provide, ref, shallowRef } from 'vue';
import * as mfm from 'mfc-js';
import * as Misskey from 'cherrypick-js';
import { CodeDiff } from 'v-code-diff';
import { isLink } from '@@/js/is-link.js';
import { host } from '@@/js/config.js';
import MkNoteSub from '@/components/MkNoteSub.vue';
import MkNoteSimple from '@/components/MkNoteSimple.vue';
import MkReactionsViewer from '@/components/MkReactionsViewer.vue';
import MkReactionsViewerDetails from '@/components/MkReactionsViewer.details.vue';
import MkMediaList from '@/components/MkMediaList.vue';
import MkCwButton from '@/components/MkCwButton.vue';
import MkPoll from '@/components/MkPoll.vue';
import MkUsersTooltip from '@/components/MkUsersTooltip.vue';
import MkUrlPreview from '@/components/MkUrlPreview.vue';
import MkInstanceTicker from '@/components/MkInstanceTicker.vue';
import MkEvent from '@/components/MkEvent.vue';
import { pleaseLogin, type OpenOnRemoteOptions } from '@/scripts/please-login.js';
import { checkWordMute } from '@/scripts/check-word-mute.js';
import { userPage } from '@/filters/user.js';
import { notePage } from '@/filters/note.js';
import number from '@/filters/number.js';
import * as os from '@/os.js';
import { misskeyApi, misskeyApiGet } from '@/scripts/misskey-api.js';
import * as sound from '@/scripts/sound.js';
import { defaultStore, noteViewInterruptors } from '@/store.js';
import { reactionPicker } from '@/scripts/reaction-picker.js';
import { extractUrlFromMfm } from '@/scripts/extract-url-from-mfm.js';
import { $i } from '@/account.js';
import { i18n } from '@/i18n.js';
import { getAbuseNoteMenu, getNoteClipMenu, getNoteMenu, getRenoteMenu, getRenoteOnly } from '@/scripts/get-note-menu.js';
import { useNoteCapture } from '@/scripts/use-note-capture.js';
import { deepClone } from '@/scripts/clone.js';
import { useTooltip } from '@/scripts/use-tooltip.js';
import { claimAchievement } from '@/scripts/achievements.js';
import MkRippleEffect from '@/components/MkRippleEffect.vue';
import { showMovedDialog } from '@/scripts/show-moved-dialog.js';
import MkUserCardMini from '@/components/MkUserCardMini.vue';
import MkPagination, { type Paging } from '@/components/MkPagination.vue';
import MkReactionIcon from '@/components/MkReactionIcon.vue';
import MkButton from '@/components/MkButton.vue';
import { isEnabledUrlPreview, infoImageUrl, instance } from '@/instance.js';
import { getAppearNote } from '@/scripts/get-appear-note.js';
import { type Keymap } from '@/scripts/hotkey.js';
import { miLocalStorage } from '@/local-storage.js';
import MkPostForm from '@/components/MkPostFormSimple.vue';
import { deviceKind } from '@/scripts/device-kind.js';
import { vibrate } from '@/scripts/vibrate.js';
import detectLanguage from '@/scripts/detect-language.js';

const MOBILE_THRESHOLD = 500;
const isMobile = ref(deviceKind === 'smartphone' || window.innerWidth <= MOBILE_THRESHOLD);

const props = withDefaults(defineProps<{
	note: Misskey.entities.Note;
	initialTab: string;
}>(), {
	initialTab: 'replies',
});

const inChannel = inject('inChannel', null);

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
const isDeleted = ref(false);
const muted = ref($i ? checkWordMute(appearNote.value, $i, $i.mutedWords) : false);
const translation = ref<Misskey.entities.NotesTranslateResponse | null>(null);
const translating = ref(false);
const viewTextSource = ref(false);
const noNyaize = ref(false);
const parsed = appearNote.value.text ? mfm.parse(appearNote.value.text) : null;
const urls = parsed ? extractUrlFromMfm(parsed).filter((url) => appearNote.value.renote?.url !== url && appearNote.value.renote?.uri !== url) : null;
const showTicker = (defaultStore.state.instanceTicker === 'always') || (defaultStore.state.instanceTicker === 'remote' && appearNote.value.user.instance);
const conversation = ref<Misskey.entities.Note[]>([]);
const replies = ref<Misskey.entities.Note[]>([]);
const canRenote = computed(() => ['public', 'home'].includes(appearNote.value.visibility) || (appearNote.value.visibility === 'followers' && appearNote.value.userId === $i?.id));

const pleaseLoginContext = computed<OpenOnRemoteOptions>(() => ({
	type: 'lookup',
	url: `https://${host}/notes/${appearNote.value.id}`,
}));

const keymap = {
	'r': () => reply(),
	'e|a|plus': () => react(),
	'q': () => renote(),
	'm': () => showMenu(),
	'c': () => {
		if (!defaultStore.state.showClipButtonInNoteFooter) return;
		clip();
	},
	'o': () => galleryEl.value?.openGallery(),
	'v|enter': () => {
		if (appearNote.value.cw != null) {
			showContent.value = !showContent.value;
		}
	},
	'esc': {
		allowRepeat: true,
		callback: () => blur(),
	},
} as const satisfies Keymap;

provide('react', (reaction: string) => {
	misskeyApi('notes/reactions/create', {
		noteId: appearNote.value.id,
		reaction: reaction,
	});
});

const tab = ref(props.initialTab);
const reactionTabType = ref<string | null>(null);

const renotesPagination = computed<Paging>(() => ({
	endpoint: 'notes/renotes',
	limit: 10,
	params: {
		noteId: appearNote.value.id,
	},
}));

const reactionsPagination = computed<Paging>(() => ({
	endpoint: 'notes/reactions',
	limit: 10,
	params: {
		noteId: appearNote.value.id,
		type: reactionTabType.value,
	},
}));

useNoteCapture({
	rootEl: rootEl,
	note: appearNote,
	pureNote: note,
	isDeletedRef: isDeleted,
});

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

if (defaultStore.state.alwaysShowCw) showContent.value = true;

function renote() {
	pleaseLogin({ openOnRemote: pleaseLoginContext.value });
	showMovedDialog();

	const { menu } = getRenoteMenu({ note: note.value, renoteButton });
	os.popupMenu(menu, renoteButton.value);
}

async function renoteOnly() {
	pleaseLogin({ openOnRemote: pleaseLoginContext.value });
	showMovedDialog();

	await getRenoteOnly({ note: note.value, renoteButton });
}

function quote(): void {
	pleaseLogin({ openOnRemote: pleaseLoginContext.value });
	if (appearNote.value.channel) {
		os.post({
			renote: appearNote.value,
			channel: appearNote.value.channel,
		}, () => {
			focus();
		});
	}
	os.post({
		renote: appearNote.value,
	}, () => {
		focus();
	});
}

function reply(): void {
	pleaseLogin({ openOnRemote: pleaseLoginContext.value });
	showMovedDialog();
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
	if (ev.target && isLink(ev.target as HTMLElement)) return;
	if (window.getSelection()?.toString() !== '') return;

	if (defaultStore.state.useReactionPickerForContextMenu) {
		ev.preventDefault();
		react();
	} else {
		const { menu, cleanup } = getNoteMenu({ note: note.value, translating, translation, viewTextSource, noNyaize, isDeleted });
		os.contextMenu(menu, ev).then(focus).finally(cleanup);
	}
}

function showMenu(): void {
	const { menu, cleanup } = getNoteMenu({ note: note.value, translating, translation, viewTextSource, noNyaize, isDeleted });
	os.popupMenu(menu, menuButton.value).then(focus).finally(cleanup);
}

const isForeignLanguage: boolean = appearNote.value.text != null && (() => {
	const targetLang = (miLocalStorage.getItem('lang') ?? navigator.language).slice(0, 2);
	const postLang = detectLanguage(appearNote.value.text);
	const choicesLang = appearNote.value.poll?.choices.map((choice) => choice.text).join(' ') ?? '';
	const pollLang = detectLanguage(choicesLang);
	return postLang !== '' && (postLang !== targetLang || pollLang !== targetLang);
})();

if (defaultStore.state.useAutoTranslate && instance.translatorAvailable && $i.policies.canUseTranslator && $i.policies.canUseAutoTranslate && (appearNote.value.cw == null || showContent.value) && appearNote.value.text && isForeignLanguage) translate();

async function translate(): Promise<void> {
	if (translation.value != null) return;
	translating.value = true;

	vibrate(defaultStore.state.vibrateSystem ? 5 : []);

	const res = await misskeyApi('notes/translate', {
		noteId: appearNote.value.id,
		targetLang: miLocalStorage.getItem('lang') ?? navigator.language,
	});
	translating.value = false;
	translation.value = res;

	vibrate(defaultStore.state.vibrateSystem ? [5, 5, 10] : []);
}

async function clip(): Promise<void> {
	os.popupMenu(await getNoteClipMenu({ note: note.value, isDeleted }), clipButton.value).then(focus);
}

function showRenoteMenu(): void {
	if (isMyRenote) {
		pleaseLogin({ openOnRemote: pleaseLoginContext.value });
		os.popupMenu([{
			text: i18n.ts.unrenote,
			icon: 'ti ti-trash',
			danger: true,
			action: () => {
				misskeyApi('notes/delete', {
					noteId: note.value.id,
				});
				isDeleted.value = true;
			},
		}], renoteTime.value);
	} else {
		os.popupMenu([getAbuseNoteMenu(note.value, i18n.ts.reportAbuseRenote)], renoteTime.value);
	}
}

function focus() {
	rootEl.value?.focus();
}

function blur() {
	rootEl.value?.blur();
}

const repliesLoaded = ref(false);

function loadReplies() {
	repliesLoaded.value = true;
	misskeyApi('notes/children', {
		noteId: appearNote.value.id,
		limit: 30,
	}).then(res => {
		replies.value = res;
	});
}

function loadRepliesSimple() {
	misskeyApi('notes/children', {
		noteId: appearNote.value.id,
		limit: 3,
	}).then(res => {
		replies.value = res;
	});
}

if (tab.value === 'replies' && !repliesLoaded.value) {
	if (appearNote.value.repliesCount <= 3 || !defaultStore.state.autoLoadMoreReplies) loadRepliesSimple();
	else if (appearNote.value.repliesCount > 3 && defaultStore.state.autoLoadMoreReplies) loadReplies();
}

const conversationLoaded = ref(false);

function loadConversation() {
	conversationLoaded.value = true;
	if (appearNote.value.replyId == null) return;
	misskeyApi('notes/conversation', {
		noteId: appearNote.value.replyId,
	}).then(res => {
		conversation.value = res.reverse();
	});
}

if (appearNote.value.reply && appearNote.value.reply.replyId && defaultStore.state.autoLoadMoreConversation) loadConversation();

function showOnRemote() {
	if (props.note.user.instance !== undefined) window.open(props.note.url ?? props.note.uri, '_blank', 'noopener');
}
</script>

<style lang="scss" module>
.root {
	position: relative;
	transition: box-shadow 0.1s ease;
	overflow: clip;
	contain: content;

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
}

.replyTo {
	padding-bottom: 0;

	&.showReplyTargetNoteInSemiTransparent {
		opacity: 0.7;
	}
}

.replyToMore {
	&.showReplyTargetNoteInSemiTransparent {
		opacity: 0.7;
	}
}

.renote {
	display: flex;
	align-items: center;
	padding: 16px 32px 8px 32px;
	line-height: 28px;
	white-space: pre;
	color: var(--MI_THEME-renote);
}

.renoteAvatar {
	flex-shrink: 0;
	display: inline-block;
	width: 28px;
	height: 28px;
	margin: 0 8px 0 0;
	border-radius: 6px;
	background: var(--MI_THEME-panel);
}

.renoteText {
	overflow: hidden;
	flex-shrink: 1;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.renoteName {
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

.renote + .note {
	padding-top: 8px;
}

.note {
	padding: 32px;
	font-size: 1.2em;

	&:hover > .main > .footer > .button {
		opacity: 1;
	}
}

.noteHeader {
	display: flex;
	position: relative;
	margin-bottom: 16px;
	align-items: center;
}

.noteHeaderAvatar {
	display: block;
	flex-shrink: 0;
	width: 58px;
	height: 58px;
	background: var(--MI_THEME-panel);
}

.noteHeaderBody {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding-left: 16px;
	font-size: 0.95em;
  max-width: 300px;
}

.noteHeaderName {
	display: flex;
	font-weight: bold;
	line-height: 1.3;
	margin: 0 .5em 0 0;
  overflow: hidden;
  overflow-wrap: anywhere;
  text-overflow: ellipsis;
  white-space: nowrap;

  &::-webkit-scrollbar {
    display: none;
  }

	&:hover {
		color: var(--MI_THEME-nameHover);
		text-decoration: none;
	}
}

.isBot {
	display: inline-block;
	margin: 0 0.5em;
	padding: 4px 6px;
	font-size: 80%;
	line-height: 1;
	border: solid 0.5px var(--MI_THEME-divider);
	border-radius: 4px;
}

.noteHeaderInfo {
	float: right;
	text-align: right;
}

.noteHeaderUsernameAndBadgeRoles {
	display: flex;
}

.noteHeaderUsername {
	margin-bottom: 2px;
	margin-right: 0.5em;
	line-height: 1.3;
	word-wrap: anywhere;
  overflow: hidden;
  overflow-wrap: anywhere;
  text-overflow: ellipsis;
  white-space: nowrap;

  &::-webkit-scrollbar {
    display: none;
  }
}

.noteHeaderBadgeRoles {
	margin: 0 .5em 0 0;
}

.noteHeaderBadgeRole {
	height: 1.3em;
	vertical-align: -20%;
	border-radius: 0.4em;

	& + .noteHeaderBadgeRole {
		margin-left: 0.2em;
	}
}

.noteContent {
	container-type: inline-size;
	overflow-wrap: break-word;
}

.cw {
	cursor: default;
	display: block;
	margin: 0;
	padding: 0;
	overflow-wrap: break-word;
}

.noteReplyTarget {
	color: var(--MI_THEME-accent);
	margin-right: 0.5em;
}

.rn {
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

.poll {
	font-size: 80%;
}

.quote {
	padding: 16px 0;
}

.quoteNote {
	padding: 24px;
	border: solid 1px var(--MI_THEME-renote);
	border-radius: 8px;
	overflow: clip;
}

.channel {
	opacity: 0.7;
	font-size: 80%;
}

.noteFooterInfo {
	margin: 16px 0;
	opacity: 0.7;
	font-size: 0.9em;
}

.noteFooterButton {
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

.noteFooterButtonCount {
	display: inline;
	margin: 0 0 0 8px;
	opacity: 0.7;

	&.reacted {
		color: var(--MI_THEME-accent);
	}
}

.reply:not(:first-child) {
	border-top: solid 0.5px var(--MI_THEME-divider);
}

.tabs {
	border-top: solid 0.5px var(--MI_THEME-divider);
	border-bottom: solid 0.5px var(--MI_THEME-divider);
	display: flex;
}

.tab {
	flex: 1;
	padding: 12px 8px;
	border-top: solid 2px transparent;
	border-bottom: solid 2px transparent;
}

.tabActive {
	border-bottom: solid 2px var(--MI_THEME-accent);
}

.tab_renotes {
	padding: 16px;
}

.tab_reactions {
	padding: 16px;
}

.tab_history {
	padding: 16px;
}
.reactionTabs {
	display: flex;
	gap: 8px;
	flex-wrap: wrap;
	margin-bottom: 8px;
}

.reactionTab {
	padding: 0 12px;
	border: solid 1px var(--MI_THEME-divider);
	border-radius: 999px;
	height: 30px;
}

.reactionTabActive {
	background: var(--MI_THEME-accentedBg);
	color: var(--MI_THEME-accent);
	box-shadow: 0 0 0 1px var(--MI_THEME-accent) inset;
}

.time {
	text-decoration: none;

	&:hover {
		text-decoration: none;
	}
}

.danger {
	color: var(--MI_THEME-accent);
}

@container (max-width: 500px) {
	.root {
		font-size: 0.9em;
	}

  .noteHeaderBody {
    max-width: 180px;
  }
}

@container (max-width: 480px) {
	.renote {
		padding: 8px 16px 0 16px;
	}

	.note {
		padding: 22px 24px;
	}

	.noteHeaderAvatar {
		width: 50px;
		height: 50px;
	}
}

@container (max-width: 300px) {
	.root {
		font-size: 0.825em;
	}

	.noteHeaderAvatar {
		width: 50px;
		height: 50px;
	}
}

.historyRoot {
	display: flex;
	margin: 0;
	padding: 10px;
	overflow: clip;
	font-size: 0.95em;
}

.historyMain {
	flex: 1;
	min-width: 0;
}

.historyHeader {
	display: flex;
	margin-bottom: 2px;
	font-weight: bold;
	width: 100%;
	overflow: clip;
	text-overflow: ellipsis;
}
.avatar {
	flex-shrink: 0 !important;
	display: block !important;
	margin: 0 10px 0 0 !important;
	width: 40px !important;
	height: 40px !important;
	border-radius: 8px !important;
	pointer-events: none !important;
}

.updatedAt {
	flex-shrink: 0;
	margin-left: auto;
	font-size: 0.9em;
}

.muted {
	padding: 8px;
	text-align: center;
	opacity: 0.7;
}

.badgeRoles {
	margin: 0 .5em 0 0;
}

.badgeRole {
	height: 1.3em;
	vertical-align: -20%;
	border-radius: 0.4em;

	& + .badgeRole {
		margin-left: 0.2em;
	}
}
</style>
