<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<div class="_gaps_m">
	<FormSection first>
		<template #label>{{ i18n.ts.appearance }}</template>

		<!--
			<MkRadios v-model="fontSize">
				<template #label>{{ i18n.ts.fontSize }}</template>
				<option value="1"><span style="font-size: 12px;">Aa</span></option>
				<option value="2"><span style="font-size: 13px;">Aa</span></option>
				<option :value="null"><span style="font-size: 14px;">Aa</span></option>
				<option value="3"><span style="font-size: 15px;">Aa</span></option>
				<option value="4"><span style="font-size: 16px;">Aa</span></option>
				<option value="5"><span style="font-size: 17px;">Aa</span></option>
				<option value="6"><span style="font-size: 18px;">Aa</span></option>
				<option value="7"><span style="font-size: 19px;">Aa</span></option>
				<option value="8"><span style="font-size: 20px;">Aa</span></option>
			</MkRadios>
			-->

		<div style="padding-bottom: 1.5em;">
			<div :class="$style.label">{{ i18n.ts.fontSize }} <span class="_beta" style="vertical-align: middle;">CherryPick</span></div>
			<div :class="$style.fontSize" class="_panel">
				<div v-if="fontSize === 1" style="font-size: 7px;">{{ i18n.ts._mfc.dummy }}</div>
				<div v-else-if="fontSize === 2" style="font-size: 8px;">{{ i18n.ts._mfc.dummy }}</div>
				<div v-else-if="fontSize === 3" style="font-size: 9px;">{{ i18n.ts._mfc.dummy }}</div>
				<div v-else-if="fontSize === 4" style="font-size: 10px;">{{ i18n.ts._mfc.dummy }}</div>
				<div v-else-if="fontSize === 5" style="font-size: 11px;">{{ i18n.ts._mfc.dummy }}</div>
				<div v-else-if="fontSize === 6" style="font-size: 12px;">{{ i18n.ts._mfc.dummy }}</div>
				<div v-else-if="fontSize === 7" style="font-size: 13px;">{{ i18n.ts._mfc.dummy }}</div>
				<div v-else-if="fontSize === 8" style="font-size: 14px;">{{ i18n.ts._mfc.dummy }}</div>
				<div v-else-if="fontSize === 9" style="font-size: 15px;">{{ i18n.ts._mfc.dummy }}</div>
				<div v-else-if="fontSize === 10" style="font-size: 16px;">{{ i18n.ts._mfc.dummy }}</div>
				<div v-else-if="fontSize === 11" style="font-size: 17px;">{{ i18n.ts._mfc.dummy }}</div>
				<div v-else-if="fontSize === 12" style="font-size: 18px;">{{ i18n.ts._mfc.dummy }}</div>
				<div v-else-if="fontSize === 13" style="font-size: 19px;">{{ i18n.ts._mfc.dummy }}</div>
				<div v-else-if="fontSize === 14" style="font-size: 20px;">{{ i18n.ts._mfc.dummy }}</div>
				<div v-else-if="fontSize === 15" style="font-size: 21px;">{{ i18n.ts._mfc.dummy }}</div>
				<div v-else-if="fontSize === 16" style="font-size: 22px;">{{ i18n.ts._mfc.dummy }}</div>
				<div v-else-if="fontSize === 17" style="font-size: 23px;">{{ i18n.ts._mfc.dummy }}</div>
				<div v-else-if="fontSize === 18" style="font-size: 24px;">{{ i18n.ts._mfc.dummy }}</div>
				<div v-else-if="fontSize === 19" style="font-size: 25px;">{{ i18n.ts._mfc.dummy }}</div>
			</div>
			<div :class="$style.fontSizeSlider">
				<div :class="$style.fontSizeLeft">Aa</div>
				<MkRange
					v-model="fontSize" style="position: initial !important; width: 100%; margin: 0 -10px;" :min="1" :max="19" :step="1" easing :textConverter="(v) =>
						v === 1 ? '7px' :
						v === 2 ? '8px' :
						v === 3 ? '9px' :
						v === 4 ? '10px' :
						v === 5 ? '11px' :
						v === 6 ? '12px' :
						v === 7 ? '13px' :
						v === 8 ? '14px' :
						v === 9 ? '15px' :
						v === 10 ? '16px' :
						v === 11 ? '17px' :
						v === 12 ? '18px' :
						v === 13 ? '19px' :
						v === 14 ? '20px' :
						v === 15 ? '21px' :
						v === 16 ? '22px' :
						v === 17 ? '23px' :
						v === 18 ? '24px' :
						v === 19 ? '25px' : ''"
				>
				</MkRange>
				<div :class="$style.fontSizeRight">Aa</div>
			</div>
			<MkInfo v-if="fontSize != fontSizeBefore" style="margin-top: 10px;">{{ i18n.ts.reloadToApplySetting2 }}</MkInfo>
			<MkSwitch v-model="useBoldFont" style="margin-top: .75em;">{{ i18n.ts.useBoldFont }}</MkSwitch>
		</div>

		<div class="_gaps_m">
			<div class="_gaps_s">
				<MkSwitch v-model="reduceAnimation">{{ i18n.ts.reduceUiAnimation }}</MkSwitch>
				<MkSwitch v-model="useBlurEffect">{{ i18n.ts.useBlurEffect }}<template #caption>{{ i18n.ts.useBlurEffectDescription }}</template></MkSwitch>
				<MkSwitch v-model="useBlurEffectForModal">{{ i18n.ts.useBlurEffectForModal }}</MkSwitch>
				<MkSwitch v-if="useBlurEffect && useBlurEffectForModal" v-model="removeModalBgColorForBlur">{{ i18n.ts.removeModalBgColorForBlur }} <span class="_beta">CherryPick</span></MkSwitch>
				<MkSwitch v-model="disableShowingAnimatedImages">{{ i18n.ts.disableShowingAnimatedImages }}<template #caption><i class="ti ti-alert-triangle" style="color: var(--MI_THEME-warn);"></i> {{ i18n.ts.disableShowingAnimatedImagesDescription }}</template></MkSwitch>
				<MkSelect v-if="!disableShowingAnimatedImages" v-model="showingAnimatedImages" style="margin-left: 44px;">
					<option value="always">{{ i18n.ts._showingAnimatedImages.always }}</option>
					<option value="interaction">{{ i18n.ts._showingAnimatedImages.interaction }}</option>
					<option value="inactive">{{ i18n.ts._showingAnimatedImages.inactive }}</option>
					<template #caption>{{ i18n.ts.showingAnimatedImagesDescription }}</template>
				</MkSelect>
				<MkSwitch v-model="highlightSensitiveMedia">{{ i18n.ts.highlightSensitiveMedia }}</MkSwitch>
				<MkSwitch v-model="squareAvatars">{{ i18n.ts.squareAvatars }}</MkSwitch>
				<MkSwitch v-model="showAvatarDecorations">{{ i18n.ts.showAvatarDecorations }}</MkSwitch>
				<MkSwitch v-model="useSystemFont">{{ i18n.ts.useSystemFont }}</MkSwitch>
				<MkSwitch v-model="forceShowAds">{{ i18n.ts.forceShowAds }}</MkSwitch>
				<MkSwitch v-model="enableSeasonalScreenEffect">{{ i18n.ts.seasonalScreenEffect }}</MkSwitch>
				<MkSwitch v-model="useNativeUIForVideoAudioPlayer">{{ i18n.ts.useNativeUIForVideoAudioPlayer }}</MkSwitch>
				<MkSwitch v-model="showUnreadNotificationsCount">{{ i18n.ts.showUnreadNotificationsCount }}</MkSwitch>
				<MkSwitch v-model="filesGridLayoutInUserPage">
					{{ i18n.ts.filesGridLayoutInUserPage }} <span class="_beta">CherryPick</span>
					<template #caption>{{ i18n.ts.filesGridLayoutInUserPageDescription }}</template>
				</MkSwitch>
			</div>

			<MkSelect v-model="menuStyle">
				<template #label>{{ i18n.ts.menuStyle }}</template>
				<option value="auto">{{ i18n.ts.auto }}</option>
				<option value="popup">{{ i18n.ts.popup }}</option>
				<option value="drawer">{{ i18n.ts.drawer }}</option>
			</MkSelect>

			<div>
				<MkRadios v-model="emojiStyle">
					<template #label>{{ i18n.ts.emojiStyle }}</template>
					<option value="native">{{ i18n.ts.native }}</option>
					<option value="fluentEmoji">Fluent Emoji</option>
					<option value="twemoji">Twemoji</option>
				</MkRadios>
				<div style="margin: 8px 0 0 0; font-size: 1.5em;"><Mfm :key="emojiStyle" text="🍮🍦🍭🍩🍰🍫🍬🥞🍪"/></div>
			</div>
		</div>
	</FormSection>

	<FormSection>
		<template #label>{{ i18n.ts.displayOfNote }}</template>

		<div class="_gaps_m">
			<div class="_gaps_s">
				<MkSwitch v-model="collapseRenotes">
					<template #label>{{ i18n.ts.collapseRenotes }}</template>
					<template #caption>{{ i18n.ts.collapseRenotesDescription }}</template>
				</MkSwitch>
				<MkSwitch v-model="collapseReplies">
					<template #label>{{ i18n.ts.collapseReplies }}</template>
					<template #caption>{{ i18n.ts.collapseRepliesDescription }}</template>
					<span class="_beta">CherryPick</span>
				</MkSwitch>
				<MkSwitch v-model="collapseLongNoteContent">{{ i18n.ts.collapseLongNoteContent }} <span class="_beta">CherryPick</span></MkSwitch>
				<MkSwitch v-model="collapseDefault">{{ i18n.ts.collapseDefault }} <span class="_beta">CherryPick</span></MkSwitch>
				<MkSwitch v-model="showNoteActionsOnlyHover">{{ i18n.ts.showNoteActionsOnlyHover }}</MkSwitch>
				<MkSwitch v-model="showClipButtonInNoteFooter">{{ i18n.ts.showClipButtonInNoteFooter }}</MkSwitch>
				<MkSwitch v-model="showTranslateButtonInNote">{{ i18n.ts.showTranslateButtonInNote }} <span class="_beta">CherryPick</span></MkSwitch>
				<MkSwitch v-model="advancedMfm">{{ i18n.ts.enableAdvancedMfm }}</MkSwitch>
				<MkSwitch v-if="advancedMfm" v-model="animatedMfm">{{ i18n.ts.enableAnimatedMfm }}</MkSwitch>
				<div :class="$style.mfmPreview" class="_panel">
					<div v-if="advancedMfm && animatedMfm" style="margin: 0 0 8px; font-size: 1.5em;">
						<Mfm :key="emojiStyle" text="$[jelly 🍮] $[spin 🍪] $[shake 🍭]"/>
					</div>
					<div v-else style="margin: 0 0 8px; font-size: 1.5em;">
						<Mfm :key="emojiStyle" text="🍮 🍪 🍭"/>
					</div>
				</div>
				<MkSwitch v-if="advancedMfm" v-model="enableQuickAddMfmFunction">{{ i18n.ts.enableQuickAddMfmFunction }}</MkSwitch>
				<MkSwitch v-model="showReactionsCount">{{ i18n.ts.showReactionsCount }}</MkSwitch>
				<MkSwitch v-model="showGapBetweenNotesInTimeline">{{ i18n.ts.showGapBetweenNotesInTimeline }}</MkSwitch>
				<MkSwitch v-model="loadRawImages">{{ i18n.ts.loadRawImages }}</MkSwitch>
				<MkRadios v-model="reactionsDisplaySize">
					<template #label>{{ i18n.ts.reactionsDisplaySize }}</template>
					<option value="small">{{ i18n.ts.small }}</option>
					<option value="medium">{{ i18n.ts.medium }}</option>
					<option value="large">{{ i18n.ts.large }}</option>
				</MkRadios>
				<MkSwitch v-model="limitWidthOfReaction">{{ i18n.ts.limitWidthOfReaction }}</MkSwitch>
				<MkSwitch v-model="hideAvatarsInNote">{{ i18n.ts.hideAvatarsInNote }} <span class="_beta">CherryPick</span></MkSwitch>
				<MkSwitch v-model="enableAbsoluteTime">{{ i18n.ts.enableAbsoluteTime }} <span class="_beta">CherryPick</span></MkSwitch>
				<MkSwitch v-model="enableMarkByDate" :disabled="defaultStore.state.enableAbsoluteTime">{{ i18n.ts.enableMarkByDate }} <span class="_beta">CherryPick</span></MkSwitch>
				<MkSwitch v-model="showSubNoteFooterButton">{{ i18n.ts.showSubNoteFooterButton }}<template #caption>{{ i18n.ts.showSubNoteFooterButtonDescription }}</template> <span class="_beta">CherryPick</span></MkSwitch>
				<MkSwitch v-model="infoButtonForNoteActionsEnabled">{{ i18n.ts.infoButtonForNoteActions }}<template #caption>{{ i18n.ts.infoButtonForNoteActionsDescription }}</template> <span class="_beta">CherryPick</span></MkSwitch>
				<MkSwitch v-model="showReplyInNotification">{{ i18n.ts.showReplyInNotification }} <span class="_beta">CherryPick</span></MkSwitch>
				<MkSwitch v-model="renoteQuoteButtonSeparation">{{ i18n.ts.renoteQuoteButtonSeparation }} <span class="_beta">CherryPick</span></MkSwitch>
				<MkSwitch v-model="renoteVisibilitySelection">{{ i18n.ts.showRenoteVisibilitySelector }} <span class="_beta">CherryPick</span></MkSwitch>
				<MkSelect v-if="!renoteVisibilitySelection" v-model="forceRenoteVisibilitySelection">
					<template #label>{{ i18n.ts.forceRenoteVisibilitySelector }}</template>
					<option value="none">{{ i18n.ts.auto }}</option>
					<option value="public">{{ i18n.ts._visibility.public }}</option>
					<option value="home">{{ i18n.ts._visibility.home }}</option>
					<option value="followers">{{ i18n.ts._visibility.followers }}</option>
				</MkSelect>
				<MkSwitch v-model="showFixedPostFormInReplies">{{ i18n.ts.showFixedPostFormInReplies }}<template #caption>{{ i18n.ts.showFixedPostFormInRepliesDescription }}</template> <span class="_beta">CherryPick</span></MkSwitch>
				<MkSwitch v-model="allMediaNoteCollapse">{{ i18n.ts.allMediaNoteCollapse }} <span class="_beta">CherryPick</span></MkSwitch>
				<MkSwitch v-model="showNoAltTextWarning">{{ i18n.ts.showNoAltWarning }}<template #caption>{{ i18n.ts.showNoAltWarningDescription }}</template> <span class="_beta">CherryPick</span></MkSwitch>
				<MkSwitch v-model="alwaysShowCw">{{ i18n.ts.alwaysShowCw }} <span class="_beta">CherryPick</span></MkSwitch>
				<MkSwitch v-model="showReplyTargetNoteInSemiTransparent">{{ i18n.ts.showReplyTargetNoteInSemiTransparent }} <span class="_beta">CherryPick</span></MkSwitch>
			</div>

			<div class="_gaps_s" style="margin: 0 10px;">
				<div style="font-weight: bold; padding: 0.5em 0 0 0; margin: 0 0 8px 0;">{{ i18n.ts.noteFooterButton }} <span class="_beta" style="vertical-align: middle;">CherryPick</span></div>

				<MkSwitch v-model="showReplyButtonInNoteFooter"><i class="ti ti-arrow-back-up"></i> {{ i18n.ts.reply }}</MkSwitch>
				<MkSwitch v-model="showRenoteButtonInNoteFooter"><i class="ti ti-repeat"></i> {{ i18n.ts.renote }}</MkSwitch>
				<MkSwitch v-model="showLikeButtonInNoteFooter"><i class="ti ti-heart"></i> {{ i18n.ts.like }}</MkSwitch>
				<MkSwitch v-model="showDoReactionButtonInNoteFooter"><i class="ti ti-mood-plus"></i> {{ i18n.ts.doReaction }}</MkSwitch>
				<MkSwitch v-model="showQuoteButtonInNoteFooter"><i class="ti ti-quote"></i> {{ i18n.ts.quote }}</MkSwitch>
				<MkSwitch v-model="showMoreButtonInNoteFooter"><i class="ti ti-dots"></i> {{ i18n.ts.more }}</MkSwitch>

				<MkFolder>
					<template #label><i class="ti ti-heart"></i> {{ i18n.ts.like }} <span class="_beta" style="vertical-align: middle;">CherryPick</span></template>
					<div class="_gaps_m">
						<FromSlot v-model="selectReaction">
							<template #label>{{ i18n.ts.selectReaction }}</template>
							<MkCustomEmoji v-if="selectReaction && selectReaction.startsWith(':')" style="max-height: 3em; font-size: 1.1em;" :useOriginalSize="false" :name="selectReaction" :normal="true" :noStyle="true"/>
							<MkEmoji v-else-if="selectReaction && !selectReaction.startsWith(':')" :emoji="selectReaction" style="max-height: 3em; font-size: 1.1em;" :normal="true" :noStyle="true"/>
							<span v-else-if="!selectReaction">{{ i18n.ts.notSet }}</span>
							<div class="_buttons" style="padding-top: 8px;">
								<MkButton rounded :small="true" inline @click="chooseNewReaction"><i class="ti ti-pencil"></i> {{ i18n.ts.edit }}</MkButton>
								<MkButton rounded :small="true" inline danger @click="resetReaction"><i class="ti ti-reload"></i> {{ i18n.ts.default }}</MkButton>
							</div>
						</FromSlot>
					</div>
				</MkFolder>
			</div>

			<MkSelect v-if="instance.federation !== 'none'" v-model="instanceTicker">
				<template #label>{{ i18n.ts.instanceTicker }}</template>
				<option value="always">{{ i18n.ts._instanceTicker.always }}</option>
				<option value="remote">{{ i18n.ts._instanceTicker.remote }}</option>
				<option value="none">{{ i18n.ts._instanceTicker.none }}</option>
			</MkSelect>

			<MkSelect v-model="nsfw">
				<template #label>{{ i18n.ts.displayOfSensitiveMedia }}</template>
				<option value="respect">{{ i18n.ts._displayOfSensitiveMedia.respect }}</option>
				<option value="ignore">{{ i18n.ts._displayOfSensitiveMedia.ignore }}</option>
				<option value="force">{{ i18n.ts._displayOfSensitiveMedia.force }}</option>
			</MkSelect>

			<MkSelect v-model="nsfwOpenBehavior">
				<template #label>{{ i18n.ts.nsfwOpenBehavior }} <span class="_beta" style="vertical-align: middle;">CherryPick</span></template>
				<option value="click">{{ i18n.ts._nsfwOpenBehavior.click }}</option>
				<option value="doubleClick">{{ i18n.ts._nsfwOpenBehavior.doubleClick }}</option>
			</MkSelect>

			<MkRadios v-model="mediaListWithOneImageAppearance">
				<template #label>{{ i18n.ts.mediaListWithOneImageAppearance }}</template>
				<option value="expand">{{ i18n.ts.default }}</option>
				<option value="16_9">{{ i18n.tsx.limitTo({ x: '16:9' }) }}</option>
				<option value="1_1">{{ i18n.tsx.limitTo({ x: '1:1' }) }}</option>
				<option value="2_3">{{ i18n.tsx.limitTo({ x: '2:3' }) }}</option>
			</MkRadios>
		</div>
	</FormSection>

	<FormSection>
		<template #label>{{ i18n.ts.notificationDisplay }}</template>

		<div class="_gaps_m">
			<MkSwitch v-model="useGroupedNotifications">{{ i18n.ts.useGroupedNotifications }}</MkSwitch>

			<MkRadios v-model="notificationPosition">
				<template #label>{{ i18n.ts.position }}</template>
				<option value="leftTop"><i class="ti ti-align-box-left-top"></i> {{ i18n.ts.leftTop }}</option>
				<option value="rightTop"><i class="ti ti-align-box-right-top"></i> {{ i18n.ts.rightTop }}</option>
				<option value="leftBottom"><i class="ti ti-align-box-left-bottom"></i> {{ i18n.ts.leftBottom }}</option>
				<option value="rightBottom"><i class="ti ti-align-box-right-bottom"></i> {{ i18n.ts.rightBottom }}</option>
			</MkRadios>

			<MkRadios v-model="notificationStackAxis">
				<template #label>{{ i18n.ts.stackAxis }}</template>
				<option value="vertical"><i class="ti ti-carousel-vertical"></i> {{ i18n.ts.vertical }}</option>
				<option value="horizontal"><i class="ti ti-carousel-horizontal"></i> {{ i18n.ts.horizontal }}</option>
			</MkRadios>

			<MkButton @click="testNotification">{{ i18n.ts._notification.checkNotificationBehavior }}</MkButton>
		</div>
	</FormSection>
</div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import * as Misskey from 'cherrypick-js';
import * as os from '@/os.js';
import MkSwitch from '@/components/MkSwitch.vue';
import MkSelect from '@/components/MkSelect.vue';
import MkRadios from '@/components/MkRadios.vue';
import MkRange from '@/components/MkRange.vue';
import MkButton from '@/components/MkButton.vue';
import MkFolder from '@/components/MkFolder.vue';
import FormSection from '@/components/form/section.vue';
import FromSlot from '@/components/form/slot.vue';
import MkInfo from '@/components/MkInfo.vue';
import { instance } from '@/instance.js';
import { defaultStore } from '@/store.js';
import { reloadAsk } from '@/scripts/reload-ask.js';
import { i18n } from '@/i18n.js';
import { definePageMetadata } from '@/scripts/page-metadata.js';
import { miLocalStorage } from '@/local-storage.js';
import { globalEvents } from '@/events.js';
import { claimAchievement } from '@/scripts/achievements.js';

// const fontSize = ref(miLocalStorage.getItem('fontSize'));
const useSystemFont = ref(miLocalStorage.getItem('useSystemFont') != null);

const fontSizeBefore = ref(miLocalStorage.getItem('fontSize'));
const useBoldFont = ref(miLocalStorage.getItem('useBoldFont'));

function reloadTimeline() {
	globalEvents.emit('reloadTimeline');
}

function reloadNotification() {
	globalEvents.emit('reloadNotification');
}

const showNoteActionsOnlyHover = computed(defaultStore.makeGetterSetter('showNoteActionsOnlyHover'));
const showClipButtonInNoteFooter = computed(defaultStore.makeGetterSetter('showClipButtonInNoteFooter'));
const reactionsDisplaySize = computed(defaultStore.makeGetterSetter('reactionsDisplaySize'));
const limitWidthOfReaction = computed(defaultStore.makeGetterSetter('limitWidthOfReaction'));
const collapseRenotes = computed(defaultStore.makeGetterSetter('collapseRenotes'));
const collapseReplies = computed(defaultStore.makeGetterSetter('collapseReplies'));
const reduceAnimation = computed(defaultStore.makeGetterSetter('animation', v => !v, v => !v));
const useBlurEffectForModal = computed(defaultStore.makeGetterSetter('useBlurEffectForModal'));
const useBlurEffect = computed(defaultStore.makeGetterSetter('useBlurEffect'));
const removeModalBgColorForBlur = computed(defaultStore.makeGetterSetter('removeModalBgColorForBlur'));
const showGapBetweenNotesInTimeline = computed(defaultStore.makeGetterSetter('showGapBetweenNotesInTimeline'));
const animatedMfm = computed(defaultStore.makeGetterSetter('animatedMfm'));
const advancedMfm = computed(defaultStore.makeGetterSetter('advancedMfm'));
const showReactionsCount = computed(defaultStore.makeGetterSetter('showReactionsCount'));
const enableQuickAddMfmFunction = computed(defaultStore.makeGetterSetter('enableQuickAddMfmFunction'));
const emojiStyle = computed(defaultStore.makeGetterSetter('emojiStyle'));
const menuStyle = computed(defaultStore.makeGetterSetter('menuStyle'));
const disableShowingAnimatedImages = computed(defaultStore.makeGetterSetter('disableShowingAnimatedImages'));
const forceShowAds = computed(defaultStore.makeGetterSetter('forceShowAds'));
const loadRawImages = computed(defaultStore.makeGetterSetter('loadRawImages'));
const highlightSensitiveMedia = computed(defaultStore.makeGetterSetter('highlightSensitiveMedia'));
const nsfw = computed(defaultStore.makeGetterSetter('nsfw'));
const instanceTicker = computed(defaultStore.makeGetterSetter('instanceTicker'));
const squareAvatars = computed(defaultStore.makeGetterSetter('squareAvatars'));
const showAvatarDecorations = computed(defaultStore.makeGetterSetter('showAvatarDecorations'));
const mediaListWithOneImageAppearance = computed(defaultStore.makeGetterSetter('mediaListWithOneImageAppearance'));
const notificationPosition = computed(defaultStore.makeGetterSetter('notificationPosition'));
const notificationStackAxis = computed(defaultStore.makeGetterSetter('notificationStackAxis'));
const useGroupedNotifications = computed(defaultStore.makeGetterSetter('useGroupedNotifications'));
const enableSeasonalScreenEffect = computed(defaultStore.makeGetterSetter('enableSeasonalScreenEffect'));
const useNativeUIForVideoAudioPlayer = computed(defaultStore.makeGetterSetter('useNativeUIForVideoAudioPlayer'));
const showUnreadNotificationsCount = computed(defaultStore.makeGetterSetter('showUnreadNotificationsCount'));
const filesGridLayoutInUserPage = computed(defaultStore.makeGetterSetter('filesGridLayoutInUserPage'));
const fontSize = computed(defaultStore.makeGetterSetter('fontSize'));
const collapseLongNoteContent = computed(defaultStore.makeGetterSetter('collapseLongNoteContent'));
const collapseDefault = computed(defaultStore.makeGetterSetter('collapseDefault'));
const hideAvatarsInNote = computed(defaultStore.makeGetterSetter('hideAvatarsInNote'));
const showTranslateButtonInNote = computed(defaultStore.makeGetterSetter('showTranslateButtonInNote'));
const enableAbsoluteTime = computed(defaultStore.makeGetterSetter('enableAbsoluteTime'));
const enableMarkByDate = computed(defaultStore.makeGetterSetter('enableMarkByDate'));
const showSubNoteFooterButton = computed(defaultStore.makeGetterSetter('showSubNoteFooterButton'));
const infoButtonForNoteActionsEnabled = computed(defaultStore.makeGetterSetter('infoButtonForNoteActionsEnabled'));
const showReplyInNotification = computed(defaultStore.makeGetterSetter('showReplyInNotification'));
const renoteQuoteButtonSeparation = computed(defaultStore.makeGetterSetter('renoteQuoteButtonSeparation'));
const showFixedPostFormInReplies = computed(defaultStore.makeGetterSetter('showFixedPostFormInReplies'));
const showingAnimatedImages = computed(defaultStore.makeGetterSetter('showingAnimatedImages'));
const allMediaNoteCollapse = computed(defaultStore.makeGetterSetter('allMediaNoteCollapse'));
const showNoAltTextWarning = computed(defaultStore.makeGetterSetter('showNoAltTextWarning'));
const alwaysShowCw = computed(defaultStore.makeGetterSetter('alwaysShowCw'));
const showReplyTargetNoteInSemiTransparent = computed(defaultStore.makeGetterSetter('showReplyTargetNoteInSemiTransparent'));
const nsfwOpenBehavior = computed(defaultStore.makeGetterSetter('nsfwOpenBehavior'));
const renoteVisibilitySelection = computed(defaultStore.makeGetterSetter('renoteVisibilitySelection'));
const forceRenoteVisibilitySelection = computed(defaultStore.makeGetterSetter('forceRenoteVisibilitySelection'));
const showReplyButtonInNoteFooter = computed(defaultStore.makeGetterSetter('showReplyButtonInNoteFooter'));
const showRenoteButtonInNoteFooter = computed(defaultStore.makeGetterSetter('showRenoteButtonInNoteFooter'));
const showLikeButtonInNoteFooter = computed(defaultStore.makeGetterSetter('showLikeButtonInNoteFooter'));
const showDoReactionButtonInNoteFooter = computed(defaultStore.makeGetterSetter('showDoReactionButtonInNoteFooter'));
const showQuoteButtonInNoteFooter = computed(defaultStore.makeGetterSetter('showQuoteButtonInNoteFooter'));
const showMoreButtonInNoteFooter = computed(defaultStore.makeGetterSetter('showMoreButtonInNoteFooter'));
const selectReaction = computed(defaultStore.makeGetterSetter('selectReaction'));

watch(fontSize, () => {
	if (fontSize.value == null) {
		miLocalStorage.removeItem('fontSize');
	} else {
		miLocalStorage.setItem('fontSize', fontSize.value as number);
	}
});

watch(useBoldFont, () => {
	if (useBoldFont.value) {
		miLocalStorage.setItem('useBoldFont', useBoldFont.value);
	} else {
		miLocalStorage.removeItem('useBoldFont');
	}
});

watch(useSystemFont, () => {
	if (useSystemFont.value) {
		miLocalStorage.setItem('useSystemFont', 't');
	} else {
		miLocalStorage.removeItem('useSystemFont');
	}
});

watch([
	useBlurEffect,
	useBlurEffectForModal,
	removeModalBgColorForBlur,
	// fontSize,
	useBoldFont,
	useSystemFont,
	squareAvatars,
	showGapBetweenNotesInTimeline,
	showUnreadNotificationsCount,
	filesGridLayoutInUserPage,
	showFixedPostFormInReplies,
	showingAnimatedImages,
	enableSeasonalScreenEffect,
], async () => {
	await reloadAsk({ reason: i18n.ts.reloadToApplySetting, unison: true });
});

watch([
	collapseLongNoteContent,
	collapseDefault,
	hideAvatarsInNote,
	showNoteActionsOnlyHover,
	showClipButtonInNoteFooter,
	instanceTicker,
	mediaListWithOneImageAppearance,
	reactionsDisplaySize,
	limitWidthOfReaction,
	highlightSensitiveMedia,
	showReplyInNotification,
	showTranslateButtonInNote,
	enableAbsoluteTime,
	enableMarkByDate,
	showSubNoteFooterButton,
	infoButtonForNoteActionsEnabled,
	renoteQuoteButtonSeparation,
	allMediaNoteCollapse,
	alwaysShowCw,
	showReplyTargetNoteInSemiTransparent,
	showReplyButtonInNoteFooter,
	showRenoteButtonInNoteFooter,
	showLikeButtonInNoteFooter,
	showDoReactionButtonInNoteFooter,
	showQuoteButtonInNoteFooter,
	showMoreButtonInNoteFooter,
], () => {
	reloadTimeline();
	reloadNotification();
});

watch([
	collapseRenotes,
	collapseReplies,
], () => {
	reloadTimeline();
});

watch([
	showReplyInNotification,
], () => {
	reloadNotification();
});

let smashCount = 0;
let smashTimer: number | null = null;

function testNotification(): void {
	const notification: Misskey.entities.Notification = {
		id: Math.random().toString(),
		createdAt: new Date().toUTCString(),
		isRead: false,
		type: 'test',
	};

	globalEvents.emit('clientNotification', notification);

	// セルフ通知破壊 実績関連
	smashCount++;
	if (smashCount >= 10) {
		claimAchievement('smashTestNotificationButton');
		smashCount = 0;
	}
	if (smashTimer) {
		clearTimeout(smashTimer);
	}
	smashTimer = window.setTimeout(() => {
		smashCount = 0;
	}, 300);
}

function chooseNewReaction(ev: MouseEvent) {
	os.pickEmoji(getHTMLElement(ev), {
		showPinned: false,
	}).then(async (emoji) => {
		selectReaction.value = emoji as string; // 選択された絵文字を格納
	});
}

function resetReaction() {
	selectReaction.value = ''; // `selectReaction` をリセット
}

function getHTMLElement(ev: MouseEvent): HTMLElement {
	const target = ev.currentTarget ?? ev.target;
	return target as HTMLElement; // イベント発生元の HTML 要素を取得
}

onMounted(() => {
	if (fontSizeBefore.value == null) {
		fontSizeBefore.value = fontSize.value as string;
	}
});

const headerActions = computed(() => []);

const headerTabs = computed(() => []);

definePageMetadata(() => ({
	title: i18n.ts.general,
	icon: 'ti ti-adjustments',
}));
</script>

<style lang="scss" module>
.label {
	font-size: 0.85em;
	padding: 0 0 8px 0;
	user-select: none;
}

.mfmPreview, .fontSize {
	padding: 20px 20px 28px;
	border-radius: 6px;
	text-align: center;
}

.mfmPreview {
	padding: 5px;
	max-width: 110px;
}

.fontSizeSlider {
	display: flex;
	margin-top: -8px;
	border-top: solid .5px var(--MI_THEME-divider);

	> .fontSizeLeft, .fontSizeRight {
		position: relative;
		background: var(--MI_THEME-panel);
		font-weight: normal;
		line-height: 20px;
	}

	> .fontSizeLeft {
		padding: 7px 6px 7px 18px;
		border-bottom-left-radius: 6px;
		font-size: 12px;
	}

	> .fontSizeRight {
		padding: 7px 18px 7px 6px;
		border-bottom-right-radius: 6px;
		font-size: 18px;
	}
}
</style>
