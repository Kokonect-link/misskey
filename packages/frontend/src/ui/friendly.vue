<!--
SPDX-FileCopyrightText: syuilo and misskey-project & noridev and cherrypick-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<div :class="$style.root">
	<XSidebar v-if="!isMobile" :class="$style.sidebar"/>

	<MkStickyContainer ref="contents" :class="$style.contents" style="container-type: inline-size;" @contextmenu.stop="onContextmenu">
		<template #header>
			<div v-if="!showEl2">
				<XAnnouncements v-if="$i"/>
				<XStatusBars :class="$style.statusbars"/>
			</div>
		</template>
		<RouterView/>
		<div v-if="!(['messaging-room', 'messaging-room-group'].includes(<string>mainRouter.currentRoute.value.name))" :class="$style.spacer"></div>
	</MkStickyContainer>

	<div v-if="isDesktop && defaultStore.state.friendlyUiEnableNotificationsArea && mainRouter.currentRoute.value.name !== 'my-notifications'" :class="$style.notificationWidgets">
		<XNotifications disableRefreshButton/>
	</div>

	<div v-if="isDesktop && !pageMetadata?.needWideArea && defaultStore.state.enableWidgetsArea" :class="$style.widgets">
		<XWidgets/>
	</div>

	<button v-if="isMobile && enableNavButton.includes(<string>mainRouter.currentRoute.value.name)" v-vibrate="defaultStore.state.vibrateSystem ? 5 : []" :class="[$style.floatNavButton, { [$style.reduceBlurEffect]: !defaultStore.state.useBlurEffect, [$style.reduceAnimation]: !defaultStore.state.animation, [$style.showEl]: (showEl && ['hideHeaderFloatBtn', 'hideFloatBtnOnly', 'hideFloatBtnNavBar', 'hide'].includes(<string>defaultStore.state.displayHeaderNavBarWhenScroll)) }]" class="_button" @click="drawerMenuShowing = true"><CPAvatar :class="$style.floatNavButtonAvatar" :user="$i"/></button>

	<button v-if="isMobile && enablePostButton.includes(<string>mainRouter.currentRoute.value.name)" v-vibrate="defaultStore.state.vibrateSystem ? 5 : []" :class="[$style.floatPostButton, { [$style.reduceBlurEffect]: !defaultStore.state.useBlurEffect, [$style.reduceAnimation]: !defaultStore.state.animation, [$style.showEl]: (showEl && ['hideHeaderFloatBtn', 'hideFloatBtnOnly', 'hideFloatBtnNavBar', 'hide'].includes(<string>defaultStore.state.displayHeaderNavBarWhenScroll)) }]" :style="{ background: PostBg }" class="_button" @click="openMessage"><span :class="[$style.floatPostButtonBg, { [$style.reduceBlurEffect]: !defaultStore.state.useBlurEffect }]"></span><i v-if="mainRouter.currentRoute.value.name === 'messaging' && !(['messaging-room', 'messaging-room-group'].includes(<string>mainRouter.currentRoute.value.name))" class="ti ti-plus"></i><i v-else-if="enablePostButton.includes(<string>mainRouter.currentRoute.value.name)" class="ti ti-pencil"></i></button>

	<button v-if="(!isDesktop && !pageMetadata?.needWideArea) && !isMobile" v-vibrate="defaultStore.state.vibrateSystem ? 5 : []" :class="[$style.widgetButton, { [$style.reduceAnimation]: !defaultStore.state.animation, [$style.showEl]: (showEl && ['hideHeaderFloatBtn', 'hideFloatBtnOnly', 'hideFloatBtnNavBar', 'hide'].includes(<string>defaultStore.state.displayHeaderNavBarWhenScroll)) }]" class="_button" @click="widgetsShowing = true"><i class="ti ti-apps"></i></button>

	<div v-if="isMobile" ref="navFooter" :class="[$style.nav, { [$style.reduceBlurEffect]: !defaultStore.state.useBlurEffect, [$style.reduceAnimation]: !defaultStore.state.animation, [$style.showEl]: (showEl && ['hideFloatBtnNavBar', 'hide'].includes(<string>defaultStore.state.displayHeaderNavBarWhenScroll)) }]" :style="{ background: bg }">
		<!-- <button v-vibrate="defaultStore.state.vibrateSystem ? 5 : []" <button :class="$style.navButton" class="_button" @click="drawerMenuShowing = true"><i :class="$style.navButtonIcon" class="ti ti-menu-2"></i><span v-if="menuIndicated" :class="$style.navButtonIndicator" class="_blink"><i class="_indicatorCircle"></i></span></button> -->
		<button v-if="defaultStore.state.showHomeButtonInNavbar" v-vibrate="defaultStore.state.vibrateSystem ? 5 : []" :class="[$style.navButton, { [$style.active]: isRoot }]" class="_button" @click="isRoot ? top() : mainRouter.push('/')" @touchstart="openAccountMenu" @touchend="closeAccountMenu"><i :class="$style.navButtonIcon" class="ti ti-home"></i><span v-if="queue > 0" :class="$style.navButtonIndicatorHome" class="_blink"><i class="_indicatorCircle"></i></span></button>
		<button v-if="defaultStore.state.showExploreButtonInNavbar" v-vibrate="defaultStore.state.vibrateSystem ? 5 : []" :class="[$style.navButton, { [$style.active]: mainRouter.currentRoute.value.name === 'explore' }]" class="_button" @click="mainRouter.currentRoute.value.name === 'explore' ? top() : mainRouter.push('/explore')"><i :class="$style.navButtonIcon" class="ti ti-hash"></i></button>
		<button v-if="defaultStore.state.showSearchButtonInNavbar" v-vibrate="defaultStore.state.vibrateSystem ? 5 : []" :class="[$style.navButton, { [$style.active]: mainRouter.currentRoute.value.name === 'search' }]" class="_button" @click="mainRouter.currentRoute.value.name === 'search' ? top() : mainRouter.push('/search')"><i :class="$style.navButtonIcon" class="ti ti-search"></i></button>
		<button v-if="defaultStore.state.showNotificationButtonInNavbar" v-vibrate="defaultStore.state.vibrateSystem ? 5 : []" :class="[$style.navButton, { [$style.active]: mainRouter.currentRoute.value.name === 'my-notifications' }]" class="_button" @click="mainRouter.currentRoute.value.name === 'my-notifications' ? top() : mainRouter.push('/my/notifications')">
			<i :class="$style.navButtonIcon" class="ti ti-bell"></i>
			<span v-if="$i?.hasUnreadNotification" :class="$style.navButtonIndicator" class="_blink">
				<span v-if="defaultStore.state.showUnreadNotificationsCount" class="_indicateCounter" :class="$style.itemIndicateValueIcon">{{ $i.unreadNotificationsCount > 99 ? '99+' : $i.unreadNotificationsCount }}</span>
				<i v-else class="_indicatorCircle"></i>
			</span>
		</button>
		<button v-if="defaultStore.state.showMessageButtonInNavbar" v-vibrate="defaultStore.state.vibrateSystem ? 5 : []" :class="[$style.navButton, { [$style.active]: ['messaging', 'messaging-room', 'messaging-room-group'].includes(<string>mainRouter.currentRoute.value.name) }]" class="_button" @click="mainRouter.currentRoute.value.name === 'messaging' ? top() : mainRouter.push('/my/messaging')"><i :class="$style.navButtonIcon" class="ti ti-messages"></i><span v-if="$i?.hasUnreadMessagingMessage" :class="$style.navButtonIndicator" class="_blink"><i class="_indicatorCircle"></i></span></button>
		<button v-if="defaultStore.state.showWidgetButtonInNavbar" v-vibrate="defaultStore.state.vibrateSystem ? 5 : []" :class="$style.navButton" class="_button" @click="widgetsShowing = true"><i :class="$style.navButtonIcon" class="ti ti-apps"></i></button>
		<!-- <button v-vibrate="defaultStore.state.vibrateSystem ? 5 : []" :class="$style.postButton" class="_button" @click="os.post()"><i :class="$style.navButtonIcon" class="ti ti-pencil"></i></button> -->
	</div>

	<Transition
		:enterActiveClass="defaultStore.state.animation ? $style.transition_menuDrawerBg_enterActive : ''"
		:leaveActiveClass="defaultStore.state.animation ? $style.transition_menuDrawerBg_leaveActive : ''"
		:enterFromClass="defaultStore.state.animation ? $style.transition_menuDrawerBg_enterFrom : ''"
		:leaveToClass="defaultStore.state.animation ? $style.transition_menuDrawerBg_leaveTo : ''"
	>
		<div
			v-if="drawerMenuShowing"
			:class="$style.menuDrawerBg"
			class="_modalBg"
			@click="drawerMenuShowing = false"
			@touchstart.passive="drawerMenuShowing = false"
		></div>
	</Transition>

	<Transition
		:enterActiveClass="defaultStore.state.animation ? $style.transition_menuDrawer_enterActive : ''"
		:leaveActiveClass="defaultStore.state.animation ? $style.transition_menuDrawer_leaveActive : ''"
		:enterFromClass="defaultStore.state.animation ? $style.transition_menuDrawer_enterFrom : ''"
		:leaveToClass="defaultStore.state.animation ? $style.transition_menuDrawer_leaveTo : ''"
	>
		<div v-if="drawerMenuShowing" :class="$style.menuDrawer">
			<XDrawerMenu/>
		</div>
	</Transition>

	<Transition
		:enterActiveClass="defaultStore.state.animation ? $style.transition_widgetsDrawerBg_enterActive : ''"
		:leaveActiveClass="defaultStore.state.animation ? $style.transition_widgetsDrawerBg_leaveActive : ''"
		:enterFromClass="defaultStore.state.animation ? $style.transition_widgetsDrawerBg_enterFrom : ''"
		:leaveToClass="defaultStore.state.animation ? $style.transition_widgetsDrawerBg_leaveTo : ''"
	>
		<div
			v-if="widgetsShowing"
			:class="$style.widgetsDrawerBg"
			class="_modalBg"
			@click="widgetsShowing = false"
			@touchstart.passive="widgetsShowing = false"
		></div>
	</Transition>

	<Transition
		:enterActiveClass="defaultStore.state.animation ? $style.transition_widgetsDrawer_enterActive : ''"
		:leaveActiveClass="defaultStore.state.animation ? $style.transition_widgetsDrawer_leaveActive : ''"
		:enterFromClass="defaultStore.state.animation ? $style.transition_widgetsDrawer_enterFrom : ''"
		:leaveToClass="defaultStore.state.animation ? $style.transition_widgetsDrawer_leaveTo : ''"
	>
		<div v-if="widgetsShowing" :class="$style.widgetsDrawer">
			<button class="_button" :class="$style.widgetsCloseButton" @click="widgetsShowing = false"><i class="ti ti-x"></i></button>
			<XWidgets/>
		</div>
	</Transition>

	<XCommon/>
</div>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, provide, onMounted, onBeforeUnmount, ref, watch, shallowRef, Ref, onUnmounted, computed } from 'vue';
import tinycolor from 'tinycolor2';
import { instanceName } from '@@/js/config.js';
import { CURRENT_STICKY_BOTTOM } from '@@/js/const.js';
import { isLink } from '@@/js/is-link.js';
import type MkStickyContainer from '@/components/global/MkStickyContainer.vue';
import XCommon from '@/ui/_common_/common.vue';
import XDrawerMenu from '@/ui/friendly/navbar-for-mobile.vue';
import * as os from '@/os.js';
import { defaultStore } from '@/store.js';
import { i18n } from '@/i18n.js';
import { $i, openAccountMenu as openAccountMenu_ } from '@/account.js';
import { PageMetadata, provideMetadataReceiver, provideReactiveMetadata } from '@/scripts/page-metadata.js';
import { deviceKind } from '@/scripts/device-kind.js';
import { miLocalStorage } from '@/local-storage.js';
import { useScrollPositionManager } from '@/nirax.js';
import { mainRouter } from '@/router/main.js';
import { globalEvents } from '@/events.js';
import CPAvatar from '@/components/global/CPAvatar-Friendly.vue';

const XWidgets = defineAsyncComponent(() => import('./universal.widgets.vue'));
const XNotifications = defineAsyncComponent(() => import('@/pages/notifications-friendly.vue'));
const XSidebar = defineAsyncComponent(() => import('@/ui/friendly/navbar.vue'));
const XStatusBars = defineAsyncComponent(() => import('@/ui/_common_/statusbars.vue'));
const XAnnouncements = defineAsyncComponent(() => import('@/ui/_common_/announcements.vue'));

miLocalStorage.setItem('ui', 'friendly');

const isRoot = computed(() => mainRouter.currentRoute.value.name === 'index');

const DESKTOP_THRESHOLD = 1100;
const MOBILE_THRESHOLD = 500;

// デスクトップでウィンドウを狭くしたときモバイルUIが表示されて欲しいことはあるので deviceKind === 'desktop' の判定は行わない
const isDesktop = ref(window.innerWidth >= DESKTOP_THRESHOLD);
const isMobile = ref(deviceKind === 'smartphone' || window.innerWidth <= MOBILE_THRESHOLD);
window.addEventListener('resize', () => {
	isMobile.value = deviceKind === 'smartphone' || window.innerWidth <= MOBILE_THRESHOLD;
});

const enableNavButton = [
	'index',
	'explore',
	'my-notifications',
	'messaging',
];

const enablePostButton = [
	'index',
	'explore',
	'my-notifications',
	'messaging',
	'user',
];

const showEl = ref(false);
const showEl2 = ref(false);
const lastScrollPosition = ref(0);
const queue = ref(0);
const longTouchNavHome = ref(false);
const bg = ref<string | undefined>(undefined);
const PostBg = ref<string | undefined>(undefined);

const pageMetadata = ref<null | PageMetadata>(null);
const widgetsShowing = ref(false);
const navFooter = shallowRef<HTMLElement>();
const contents = shallowRef<InstanceType<typeof MkStickyContainer>>();

provide('router', mainRouter);
provideMetadataReceiver((metadataGetter) => {
	const info = metadataGetter();
	pageMetadata.value = info;
	if (pageMetadata.value) {
		if (isRoot.value && pageMetadata.value.title === instanceName) {
			document.title = pageMetadata.value.title;
		} else {
			document.title = `${pageMetadata.value.title} | ${instanceName}`;
		}
	}
});
provideReactiveMetadata(pageMetadata);

/*
const menuIndicated = computed(() => {
	for (const def in navbarItemDef) {
		if (def === 'notifications') continue; // 通知は下にボタンとして表示されてるから
		if (navbarItemDef[def].indicated) return true;
	}
	return false;
});
 */

const drawerMenuShowing = ref(false);

mainRouter.on('change', () => {
	drawerMenuShowing.value = false;
});

if (window.innerWidth > 1024) {
	const tempUI = miLocalStorage.getItem('ui_temp');
	if (tempUI) {
		miLocalStorage.setItem('ui', tempUI);
		miLocalStorage.removeItem('ui_temp');
		location.reload();
	}
}

defaultStore.loaded.then(() => {
	if (defaultStore.state.widgets.length === 0) {
		defaultStore.set('widgets', [{
			name: 'calendar',
			id: 'a', place: 'right', data: {},
		}, {
			name: 'trends',
			id: 'b', place: 'right', data: {},
		}]);
	}
});

const calcBg = () => {
	const rawBg = 'var(--MI_THEME-panel)';
	const rawPostBg = 'var(--MI_THEME-accent)';
	const tinyBg = tinycolor(rawBg.startsWith('var(') ? getComputedStyle(document.documentElement).getPropertyValue(rawBg.slice(4, -1)) : rawBg);
	const tinyPostBg = tinycolor(rawPostBg.startsWith('var(') ? getComputedStyle(document.documentElement).getPropertyValue(rawPostBg.slice(4, -1)) : rawPostBg);
	if (defaultStore.state.useBlurEffect) {
		tinyBg.setAlpha(0.7);
		tinyPostBg.setAlpha(0.7);
	} else {
		tinyBg.setAlpha(1);
		tinyPostBg.setAlpha(1);
	}
	bg.value = tinyBg.toRgbString();
	PostBg.value = tinyPostBg.toRgbString();
};

onMounted(() => {
	if (!isDesktop.value) {
		window.addEventListener('resize', () => {
			if (window.innerWidth >= DESKTOP_THRESHOLD) isDesktop.value = true;
		}, { passive: true });
	}

	contents.value.rootEl.addEventListener('scroll', onScroll);

	globalEvents.on('queueUpdated', (q) => queueUpdated(q));

	calcBg();
	globalEvents.on('themeChanged', calcBg);
});

onBeforeUnmount(() => {
	contents.value.rootEl.removeEventListener('scroll', onScroll);
});

onUnmounted(() => {
	globalEvents.off('themeChanged', calcBg);
});

function onScroll() {
	const currentScrollPosition = contents.value.rootEl.scrollTop;
	if (currentScrollPosition < 0) {
		return;
	}

	// Stop executing this function if the difference between
	// current scroll position and last scroll position is less than some offset
	if (Math.abs(currentScrollPosition - lastScrollPosition.value) < 60) {
		return;
	}

	showEl.value = currentScrollPosition < lastScrollPosition.value;
	lastScrollPosition.value = currentScrollPosition;
	showEl.value = !showEl.value;
	globalEvents.emit('showEl', showEl.value);

	if (isMobile.value) {
		if (showEl2.value === true) showEl2.value = showEl.value;
		else setTimeout(() => showEl2.value = showEl.value, 50);
	}
}

const onContextmenu = (ev) => {
	if (isLink(ev.target)) return;
	if (['INPUT', 'TEXTAREA', 'IMG', 'VIDEO', 'CANVAS'].includes(ev.target.tagName) || ev.target.attributes['contenteditable']) return;
	if (window.getSelection()?.toString() !== '') return;
	const path = mainRouter.getCurrentPath();
	os.contextMenu([{
		type: 'label',
		text: path,
	}, {
		icon: 'ti ti-window-maximize',
		text: i18n.ts.openInWindow,
		action: () => {
			os.pageWindow(path);
		},
	}], ev);
};

function top() {
	contents.value.rootEl.scrollTo({
		top: 0,
		behavior: 'smooth',
	});
}

function queueUpdated(q: number): void {
	queue.value = q;
}

function openAccountMenu(ev: TouchEvent) {
	if (defaultStore.state.enableLongPressOpenAccountMenu) {
		longTouchNavHome.value = true;
		setTimeout(() => {
			if (longTouchNavHome.value === true) {
				openAccountMenu_({
					withExtraOperationFriendly: true,
				}, ev);
			}
		}, 500);
	}
}

function closeAccountMenu() {
	longTouchNavHome.value = false;
}

function openMessage(ev: MouseEvent) {
	if (mainRouter.currentRoute.value.name === 'messaging' && !(['messaging-room', 'messaging-room-group'].includes(<string>mainRouter.currentRoute.value.name))) globalEvents.emit('openMessage', ev);
	else if (enablePostButton.includes(<string>mainRouter.currentRoute.value.name)) os.post();
}

const navFooterHeight = ref(0);
provide<Ref<number>>(CURRENT_STICKY_BOTTOM, navFooterHeight);

watch(navFooter, () => {
	if (navFooter.value) {
		navFooterHeight.value = navFooter.value.offsetHeight;
		document.body.style.setProperty('--MI-stickyBottom', `${navFooterHeight.value}px`);
		document.body.style.setProperty('--MI-minBottomSpacing', 'var(--MI-minBottomSpacingMobile)');
	} else {
		navFooterHeight.value = 0;
		document.body.style.setProperty('--MI-stickyBottom', '0px');
		document.body.style.setProperty('--MI-minBottomSpacing', '0px');
	}
}, {
	immediate: true,
});

useScrollPositionManager(() => contents.value.rootEl, mainRouter);
</script>

<style>
html,
body {
	width: 100%;
	height: 100%;
	overflow: clip;
	position: fixed;
	top: 0;
	left: 0;
	overscroll-behavior: none;
}

#cherrypick_app {
	width: 100%;
	height: 100%;
	overflow: clip;
	position: absolute;
	top: 0;
	left: 0;
}
</style>

<style lang="scss" module>
$ui-font-size: 1em; // TODO: どこかに集約したい
$widgets-hide-threshold: 1090px;
$float-button-size: 65px;

.transition_menuDrawerBg_enterActive,
.transition_menuDrawerBg_leaveActive {
	opacity: 1;
	transition: opacity 300ms cubic-bezier(0.23, 1, 0.32, 1);
}
.transition_menuDrawerBg_enterFrom,
.transition_menuDrawerBg_leaveTo {
	opacity: 0;
}

.transition_menuDrawer_enterActive,
.transition_menuDrawer_leaveActive {
	opacity: 1;
	transform: translateX(0);
	transition: transform 300ms cubic-bezier(0.23, 1, 0.32, 1), opacity 300ms cubic-bezier(0.23, 1, 0.32, 1);
}
.transition_menuDrawer_enterFrom,
.transition_menuDrawer_leaveTo {
	opacity: 0;
	transform: translateX(-240px);
}

.transition_widgetsDrawerBg_enterActive,
.transition_widgetsDrawerBg_leaveActive {
	opacity: 1;
	transition: opacity 300ms cubic-bezier(0.23, 1, 0.32, 1);
}
.transition_widgetsDrawerBg_enterFrom,
.transition_widgetsDrawerBg_leaveTo {
	opacity: 0;
}

.transition_widgetsDrawer_enterActive,
.transition_widgetsDrawer_leaveActive {
	opacity: 1;
	transform: translateX(0);
	transition: transform 300ms cubic-bezier(0.23, 1, 0.32, 1), opacity 300ms cubic-bezier(0.23, 1, 0.32, 1);
}
.transition_widgetsDrawer_enterFrom,
.transition_widgetsDrawer_leaveTo {
	opacity: 0;
	transform: translateX(240px);
}

.root {
	height: 100dvh;
	overflow: clip;
	contain: strict;
	box-sizing: border-box;
	display: flex;
}

.sidebar {
	border-right: solid 0.5px var(--MI_THEME-divider);
}

.contents {
	flex: 1;
	height: 100%;
	min-width: 0;
	overflow: auto;
	overflow-y: scroll;
	overscroll-behavior: contain;
	background: var(--MI_THEME-bg);
}

.widgets {
	width: 350px;
	height: 100%;
	box-sizing: border-box;
	overflow: auto;
	padding: var(--MI-margin) var(--MI-margin) calc(var(--MI-margin) + env(safe-area-inset-bottom, 0px));
	border-left: solid 0.5px var(--MI_THEME-divider);
	background: var(--MI_THEME-bg);

	@media (max-width: $widgets-hide-threshold) {
		display: none;
	}
}

.notificationWidgets {
	composes: widgets;
	padding: initial;
}

.floatButton {
  display: block;
  position: fixed;
  z-index: 1000;
  bottom: calc(65px + env(safe-area-inset-bottom));
  width: $float-button-size;
  height: $float-button-size;
  box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12);
  border-radius: 28px;
  -webkit-backdrop-filter: var(--MI-blur, blur(15px));
  backdrop-filter: var(--MI-blur, blur(15px));
  transition: opacity 0.5s, transform 0.5s;

  &.reduceBlurEffect {
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
  }

  &.reduceAnimation {
    transition: opacity 0s, transform 0s;
  }
}

.floatNavButton {
  composes: floatButton;
  left: 15px;

	&.showEl {
		transform: translateX(-250px);
	}
}

.floatNavButtonAvatar {
	width: 100%;
	height: 100%;
	vertical-align: middle;
}

.floatPostButton {
  composes: floatButton;
	right: 15px;
	font-size: 18px;

	&.showEl {
		transform: translateX(250px);
	}

	i {
		position: relative;
		color: white;
	}
}

.floatPostButtonBg {
	position: absolute;
	width: 100%;
	height: 100%;
	right: 0;
	bottom: 0;
	border-radius: 28px;
}

.widgetButton {
	display: block;
	position: fixed;
	z-index: 1000;
	bottom: 32px;
	right: 32px;
	width: 64px;
	height: 64px;
	border-radius: 100%;
	box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12);
	font-size: 22px;
	background: var(--MI_THEME-panel);
  transition: opacity 0.5s, transform 0.5s;

  &.reduceAnimation {
    transition: opacity 0s, transform 0s;
  }

  &.showEl {
    transform: translateX(100px);
  }
}

.widgetsDrawerBg {
	z-index: 1001;
}

.widgetsDrawer {
	position: fixed;
	top: 0;
	right: 0;
	z-index: 1001;
	width: 330px;
	height: 100dvh;
	padding: var(--MI-margin) var(--MI-margin) calc(var(--MI-margin) + env(safe-area-inset-bottom, 0px)) !important;
	box-sizing: border-box;
	overflow: auto;
	overscroll-behavior: contain;
	background: var(--MI_THEME-bg);
}

.widgetsCloseButton {
	padding: 8px;
	display: block;
	margin: 0 auto;
}

@media (min-width: 370px) {
	.widgetsCloseButton {
		display: none;
	}
}

.nav {
	position: fixed;
	z-index: 1000;
	bottom: 0;
	display: flex;
	width: 100%;
	box-sizing: border-box;
	-webkit-backdrop-filter: var(--MI-blur, blur(15px));
	backdrop-filter: var(--MI-blur, blur(15px));
	border-top: solid 0.5px var(--MI_THEME-divider);
	padding: 0 10px;
  transition: opacity 0.5s, transform 0.5s;

	&.reduceBlurEffect {
		-webkit-backdrop-filter: none;
		backdrop-filter: none;
	}

  &.reduceAnimation {
    transition: opacity 0s, transform 0s;
  }

  &.showEl {
    transform: translateY(50.55px);
  }
}

.navButton {
	position: relative;
	flex: 1;
	margin: auto;
	height: 50px;
	color: var(--MI_THEME-fg);
	padding: 15px 0 calc(env(safe-area-inset-bottom) + 30px);

	@media (max-width: 300px) {
		height: 60px;

		&:not(:last-child) {
			margin-right: 8px;
		}
	}

	&:active {
		color: var(--MI_THEME-accent);
	}

	&.active {
		color: var(--MI_THEME-accent);
	}

	&:first-child {
		margin-left: 0;
	}

	&:last-child {
		margin-right: 0;
	}

	> * {
		font-size: 18px;
	}

	&:disabled {
		cursor: default;

		> * {
			opacity: 0.5;
		}
	}
}

.navButtonIcon {
	font-size: 18px;
	vertical-align: middle;
}

.navButtonIndicator {
	position: absolute;
	top: 7px;
	right: 20px;
	color: var(--MI_THEME-indicator);
	font-size: 8px;
	animation: global-blink 1s infinite;

  &:has(.itemIndicateValueIcon) {
    animation: none;
    font-size: 6px;
  }
}

.navButtonIndicatorHome {
	composes: navButtonIndicator;
	animation: none;
}

.menuDrawerBg {
	z-index: 1001;
}

.menuDrawer {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 1001;
	height: 100dvh;
	width: 240px;
	box-sizing: border-box;
	contain: strict;
	overflow: auto;
	overscroll-behavior: contain;
	background: var(--MI_THEME-navBg);
}

.statusbars {
	position: sticky;
	top: 0;
	left: 0;
}

.spacer {
	height: calc(var(--MI-minBottomSpacing));
}
</style>
