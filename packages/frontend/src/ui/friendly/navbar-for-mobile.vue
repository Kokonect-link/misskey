<!--
SPDX-FileCopyrightText: syuilo and misskey-project & noridev and cherrypick-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<div :class="$style.root">
	<div v-if="['all', 'bg'].includes(<string>bannerDisplay)" :class="[$style.banner, $style.topBanner]" :style="{ backgroundImage: `url(${ instance.bannerUrl })` }"></div>
	<div :class="$style.top">
		<div v-if="['all', 'topBottom', 'top'].includes(<string>bannerDisplay)" :class="[$style.banner, $style.topBanner]" :style="{ backgroundImage: `url(${ instance.bannerUrl })` }"></div>
		<button v-vibrate="defaultStore.state.vibrateSystem ? 5 : []" class="_button" :class="$style.instance" @click="openInstanceMenu">
			<img :src="instance.iconUrl || instance.faviconUrl || '/favicon.ico'" alt="" :class="$style.instanceIcon"/>
		</button>
	</div>
	<div :class="$style.middle">
		<MkA :class="$style.item" :activeClass="$style.active" to="/" exact>
			<i :class="$style.itemIcon" class="ti ti-home ti-fw"></i><span :class="$style.itemText">{{ i18n.ts.timeline }}</span>
		</MkA>
		<template v-for="item in menu">
			<div v-if="item === '-'" :class="$style.divider"></div>
			<component :is="navbarItemDef[item].to ? 'MkA' : 'button'" v-else-if="navbarItemDef[item] && (navbarItemDef[item].show !== false)" v-vibrate="defaultStore.state.vibrateSystem ? 5 : []" class="_button" :class="[$style.item, { [$style.active]: navbarItemDef[item].active }]" :activeClass="$style.active" :to="navbarItemDef[item].to" v-on="navbarItemDef[item].action ? { click: navbarItemDef[item].action } : {}">
				<i class="ti-fw" :class="[$style.itemIcon, navbarItemDef[item].icon]"></i><span :class="$style.itemText">{{ navbarItemDef[item].title }}</span>
				<span v-if="navbarItemDef[item].indicated" :class="$style.itemIndicator" class="_blink">
					<span v-if="navbarItemDef[item].indicateValue && defaultStore.state.showUnreadNotificationsCount" class="_indicateCounter" :class="$style.itemIndicateValueIcon">{{ navbarItemDef[item].indicateValue }}</span>
					<i v-else class="_indicatorCircle"></i>
				</span>
			</component>
		</template>
		<div :class="$style.divider"></div>
		<MkA v-if="$i.isAdmin || $i.isModerator" :class="$style.item" :activeClass="$style.active" to="/admin">
			<i :class="$style.itemIcon" class="ti ti-dashboard ti-fw"></i><span :class="$style.itemText">{{ i18n.ts.controlPanel }}</span>
			<span v-if="controlPanelIndicated" :class="$style.itemIndicator" class="_blink"><i class="_indicatorCircle"></i></span>
		</MkA>
		<button v-vibrate="defaultStore.state.vibrateSystem ? 5 : []" :class="$style.item" class="_button" @click="more">
			<i :class="$style.itemIcon" class="ti ti-dots ti-fw"></i><span :class="$style.itemText">{{ i18n.ts.more }}</span>
			<span v-if="otherMenuItemIndicated" :class="$style.itemIndicator" class="_blink"><i class="_indicatorCircle"></i></span>
		</button>
		<MkA :class="$style.item" :activeClass="$style.active" to="/settings">
			<i :class="$style.itemIcon" class="ti ti-settings ti-fw"></i><span :class="$style.itemText">{{ i18n.ts.settings }}</span>
		</MkA>
	</div>
	<div :class="$style.bottom">
		<div v-if="['all', 'topBottom', 'bottom'].includes(<string>bannerDisplay)" :class="[$style.banner, $style.bottomBanner]" :style="{ backgroundImage: `url(${ $i.bannerUrl })` }"></div>
		<button v-vibrate="defaultStore.state.vibrateSystem ? 5 : []" class="_button" :class="$style.post" data-cy-open-post-form @click="os.post">
			<i :class="[$style.postIcon, defaultStore.state.renameTheButtonInPostFormToNya ? 'ti-paw-filled' : 'ti-pencil']" class="ti ti-fw"></i><span style="position: relative;">{{ defaultStore.state.renameTheButtonInPostFormToNya ? i18n.ts.nya : i18n.ts.note }}</span>
		</button>
		<div :class="$style.profile">
			<button v-vibrate="defaultStore.state.vibrateSystem ? 5 : []" class="_button" :class="$style.account" @click="openProfile">
				<MkAvatar :user="$i" :class="$style.avatar"/><MkUserName :class="$style.acct" class="_nowrap" :user="$i"/>
			</button>
			<button v-vibrate="defaultStore.state.vibrateSystem ? 5 : []" class="_button" :class="$style.drawer" @click="openAccountMenu"><i class="ti ti-chevron-up"/></button>
		</div>
	</div>
</div>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, ref, toRef, watch } from 'vue';
import { version } from '@@/js/config.js';
import { compareVersions } from 'compare-versions';
import { openInstanceMenu } from '@/ui/_common_/common.js';
import * as os from '@/os.js';
import { navbarItemDef } from '@/navbar.js';
import { $i, openAccountMenu as openAccountMenu_ } from '@/account.js';
import { defaultStore } from '@/store.js';
import { i18n } from '@/i18n.js';
import { instance } from '@/instance.js';
import { misskeyApi } from '@/scripts/misskey-api.js';
import { mainRouter } from '@/router/main.js';

const menu = toRef(defaultStore.state, 'menu');
const otherMenuItemIndicated = computed(() => {
	for (const def in navbarItemDef) {
		if (menu.value.includes(def)) continue;
		if (navbarItemDef[def].indicated) return true;
	}
	return false;
});
const controlPanelIndicated = ref(false);
const releasesCherryPick = ref(null);
const bannerDisplay = ref(defaultStore.state.bannerDisplay);

if ($i && ($i.isAdmin ?? $i.isModerator)) {
	misskeyApi('admin/abuse-user-reports', {
		state: 'unresolved',
		limit: 1,
	}).then(reports => {
		if (reports.length > 0) controlPanelIndicated.value = true;
	});

	misskeyApi('admin/meta')
		.then(meta => {
			return fetch('https://api.github.com/repos/kokonect-link/cherrypick/releases')
				.then(res => res.json())
				.then(cherryPickData => {
					releasesCherryPick.value = meta.enableReceivePrerelease ? cherryPickData : cherryPickData.filter(x => !x.prerelease);
					if ((compareVersions(version, releasesCherryPick.value[0].tag_name) < 0) && (compareVersions(meta.skipCherryPickVersion, releasesCherryPick.value[0].tag_name) < 0)) {
						controlPanelIndicated.value = true;
					}
				});
		})
		.catch(error => {
			console.error('Failed to fetch CherryPick releases:', error);
		});
}

watch(defaultStore.reactiveState.bannerDisplay, () => {
	toggleBannerDisplay();
});

function toggleBannerDisplay() {
	bannerDisplay.value = defaultStore.state.bannerDisplay;
}

function openAccountMenu(ev: MouseEvent) {
	openAccountMenu_({
		withExtraOperation: true,
	}, ev);
}

function more() {
	const { dispose } = os.popup(defineAsyncComponent(() => import('@/components/MkLaunchPad.vue')), {}, {
		closed: () => dispose(),
	});
}

function openProfile() {
	mainRouter.push(`/@${$i.username}`);
}
</script>

<style lang="scss" module>
.root {
	--nav-bg-transparent: color(from var(--MI_THEME-navBg) srgb r g b / 0.5);

	display: flex;
	flex-direction: column;
	height: 100%;
}

.top {
	position: sticky;
	top: 0;
	z-index: 1;
	padding: calc(env(safe-area-inset-top) + 20px) 0;
	background: var(--nav-bg-transparent);
	-webkit-backdrop-filter: var(--MI-blur, blur(8px));
	backdrop-filter: var(--MI-blur, blur(8px));
}

.banner {
	position: absolute;
	left: 0;
	width: 100%;
	background-size: cover;
	background-position: center center;

	&.topBanner {
		top: 0;
		height: 100%;
		-webkit-mask-image: linear-gradient(0deg, rgba(0,0,0,0) 15%, rgba(0,0,0,0.75) 100%);
		mask-image: linear-gradient(0deg, rgba(0,0,0,0) 15%, rgba(0,0,0,0.75) 100%);
	}

	&.bottomBanner {
		bottom: 0;
		height: 100%;
		background-position-y: 20px;
		-webkit-mask-image: linear-gradient(0deg,rgba(0,0,0,.75) 15%,rgba(0,0,0,0) 80%);
		mask-image: linear-gradient(0deg,rgba(0,0,0,.75) 15%,rgba(0,0,0,0) 80%);
	}
}

.instance {
	position: relative;
	display: block;
	text-align: center;
	width: 100%;
}

.instanceIcon {
	display: inline-block;
	width: 50px;
	aspect-ratio: 1;
	margin-right: 150px;
	border-radius: 18px;
}

.bottom {
	position: sticky;
	bottom: 0;
	padding: 20px 0 calc(env(safe-area-inset-bottom) + 10px);
	background: var(--nav-bg-transparent);
	-webkit-backdrop-filter: var(--MI-blur, blur(8px));
	backdrop-filter: var(--MI-blur, blur(8px));
}

.post {
	position: relative;
	display: block;
	z-index: 2;
	width: 100%;
	height: 40px;
	color: var(--MI_THEME-fgOnAccent);
	font-weight: bold;
	text-align: left;

	&::before {
		content: "";
		display: block;
		width: calc(100% - 38px);
		height: 100%;
		margin: auto;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		border-radius: 999px;
		background: linear-gradient(90deg, var(--MI_THEME-buttonGradateA), var(--MI_THEME-buttonGradateB));
	}

	&:hover, &.active {
		&::before {
			background: var(--MI_THEME-accentLighten);
		}
	}
}

.postIcon {
	position: relative;
	margin-left: 30px;
	margin-right: 8px;
	width: 32px;
}

.profile {
	display: flex;
	margin-top: 16px;
}

.account {
	position: relative;
	display: flex;
	z-index: 2;
	align-items: center;
	padding-left: 30px;
	width: 100%;
	text-align: left;
	box-sizing: border-box;
}

.avatar {
	display: block;
	flex-shrink: 0;
	position: relative;
	width: 32px;
	aspect-ratio: 1;
	margin-right: 8px;
}

.acct {
	display: block;
	flex-shrink: 1;
	padding-right: 8px;
	margin-left: 5px;
	font-weight: bold;
	max-width: 90px;
	text-overflow: clip !important;
}

.drawer {
	display: flex;
	z-index: 2;
	align-items: center;
	padding: 16px;
	margin-right: 16px;
}

.middle {
	flex: 1;
}

.divider {
	margin: 16px 16px;
	border-top: solid 0.5px var(--MI_THEME-divider);
}

.item {
	position: relative;
	display: block;
	padding-left: 24px;
	line-height: 2.85rem;
	text-overflow: ellipsis;
	overflow: hidden;
	white-space: nowrap;
	width: 100%;
	text-align: left;
	box-sizing: border-box;
	color: var(--MI_THEME-navFg);
  margin-bottom: 0.35rem;

	&:hover {
		text-decoration: none;
		color: var(--MI_THEME-navHoverFg);
	}

	&.active {
		color: var(--MI_THEME-navActive);
	}

	&:hover, &.active {
		&::before {
			content: "";
			display: block;
			width: calc(100% - 24px);
			height: 100%;
			margin: auto;
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			border-radius: 15px;
			background: var(--MI_THEME-accentedBg);
		}
	}
}

.itemIcon {
	position: relative;
	width: 32px;
	margin-right: 8px;
  font-size: 1.1em;
}

.itemIndicator {
	position: absolute;
	top: 0;
	left: 20px;
	color: var(--MI_THEME-navIndicator);
	font-size: 6px;
	// animation: global-blink 1s infinite;

  &:has(.itemIndicateValueIcon) {
    animation: none;
    left: auto;
    right: 20px;
    font-size: 8px;
  }
}

.itemText {
	position: relative;
	font-size: 0.9em;
}
</style>
