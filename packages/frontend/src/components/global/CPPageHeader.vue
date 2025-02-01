<!--
SPDX-FileCopyrightText: syuilo and misskey-project & noridev and cherrypick-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<div v-if="show" ref="el" :class="[$style.root, {[$style.slim]: narrow, [$style.thin]: thin_, [$style.reduceBlurEffect]: !defaultStore.state.useBlurEffect }]" :style="{ background: bg }">
	<div v-if="!thin_ && !canBack" :class="$style.buttonsLeft">
		<button v-vibrate="defaultStore.state.vibrateSystem ? 5 : []" class="_button" :class="[$style.button, $style.goBack]" @click.stop="goBack" @touchstart="preventDrag"><i class="ti ti-arrow-left"></i></button>
	</div>
	<div v-if="!thin_ && narrow && props.displayMyAvatar && $i && !isFriendly" class="_button" :class="$style.buttonsLeft" @click="openAccountMenu">
		<MkAvatar v-vibrate="defaultStore.state.vibrateSystem ? 5 : []" :class="$style.avatar" :user="$i"/>
	</div>
	<div v-else-if="!thin_ && narrow && !hideTitle && canBack" :class="$style.buttonsLeft"/>
	<div v-else-if="!thin_ && canBack && (actions && actions.length > 0)" :class="$style.buttonsLeft"/>
	<div v-if="!thin_ && canBack && (actions && actions.length > 1 && ['index', 'my-notifications', 'messaging'].includes(<string>mainRouter.currentRoute.value.name))" :class="$style.buttonsLeft"/>
	<div v-if="pageMetadata && pageMetadata.avatar && !thin_ && mainRouter.currentRoute.value.name === 'user' && ($i != null && $i.id != pageMetadata.avatar.id)">
		<div style="width: 50px;"/>
	</div>

	<template v-if="pageMetadata">
		<div v-if="!hideTitle" :class="[$style.titleContainer, { [$style.titleContainer_canBack]: !canBack }]">
			<div v-if="pageMetadata.avatar" :class="$style.titleAvatarContainer" @click="top">
				<MkAvatar :class="$style.titleAvatar" :user="pageMetadata.avatar" indicator/>
			</div>
			<i v-else-if="pageMetadata.icon" :class="[$style.titleIcon, pageMetadata.icon]" @click="top"></i>

			<div :class="$style.title">
				<MkUserName v-if="pageMetadata.userName" :user="pageMetadata.userName" :nowrap="true" @click="top"/>
				<div v-else-if="pageMetadata.title" @click="top">{{ pageMetadata.title }}</div>
				<div v-if="!narrow && pageMetadata.subtitle" :class="$style.subtitle" @click="top">
					{{ pageMetadata.subtitle }}
				</div>
				<div v-if="narrow && hasTabs" :class="[$style.subtitle, $style.activeTab]" @click="showTabsPopup">
					{{ tabs.find(tab => tab.key === props.tab)?.title }}
					<i class="ti ti-chevron-down" :class="$style.chevron"></i>
				</div>
			</div>
		</div>
		<div v-if="!narrow || hideTitle" :class="$style.tabs">
			<button v-for="tab in tabs" :ref="(el) => tabRefs[tab.key] = (el as HTMLElement)" v-tooltip.noDelay="tab.title" class="_button" :class="[$style.tab, { [$style.active]: tab.key != null && tab.key === props.tab }]" @mousedown="(ev) => onTabMousedown(tab, ev)" @click="(ev) => onTabClick(tab, ev)">
				<i v-if="tab.icon" :class="[$style.tabIcon, tab.icon]"></i>
				<span v-if="!tab.iconOnly" :class="$style.tabTitle">{{ tab.title }}</span>
			</button>
			<div ref="tabHighlightEl" :class="$style.tabHighlight"></div>
		</div>
	</template>
	<div v-if="!thin_ && !narrow && (actions && actions.length > 0) && hideTitle && ['index'].includes(<string>mainRouter.currentRoute.value.name)" :class="$style.buttonsRight"/>
	<div v-if="(!thin_ && narrow && !hideTitle) || (actions && actions.length > 0)" :class="$style.buttonsRight">
		<template v-for="action in actions">
			<button v-vibrate="defaultStore.state.vibrateSystem ? 5 : []" v-tooltip.noDelay="action.text" class="_button" :class="[$style.button, { [$style.highlighted]: action.highlighted }]" @click.stop="action.handler" @touchstart="preventDrag"><i :class="action.icon"></i></button>
		</template>
	</div>
	<div v-else-if="!thin_ && !canBack && !(actions && actions.length > 0)" :class="$style.buttonsRight"/>
	<div v-if="pageMetadata && pageMetadata.avatar && ($i && $i.id !== pageMetadata.userName?.id) && !disableFollowButton" :class="$style.followButton">
		<MkFollowButton v-if="mainRouter.currentRoute.value.name === 'user'" :user="pageMetadata.avatar" :transparent="false" :full="!narrow"/>
	</div>
</div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, inject, watch, nextTick, shallowRef, computed } from 'vue';
import tinycolor from 'tinycolor2';
import { getScrollPosition, scrollToTop } from '@@/js/scroll.js';
import type { PageMetadata } from '@/scripts/page-metadata.js';
import { globalEvents } from '@/events.js';
import { injectReactiveMetadata } from '@/scripts/page-metadata.js';
import { $i, openAccountMenu as openAccountMenu_ } from '@/account.js';
import { miLocalStorage } from '@/local-storage.js';
import { mainRouter } from '@/router/main.js';
import * as os from '@/os.js';
import { i18n } from '@/i18n.js';
import { defaultStore } from '@/store.js';
import { PageHeaderItem } from '@/types/page-header.js';
import MkFollowButton from '@/components/MkFollowButton.vue';

const isFriendly = ref(miLocalStorage.getItem('ui') === 'friendly');
const canBack = ref(['index', 'explore', 'my-notifications', 'messaging'].includes(<string>mainRouter.currentRoute.value.name));

type Tab = {
	key: string;
	title: string;
	icon?: string;
	iconOnly?: boolean;
	onClick?: (ev: MouseEvent) => void;
};

const props = withDefaults(defineProps<{
	overridePageMetadata?: PageMetadata;
	tabs?: Tab[];
	tab?: string;
	actions?: PageHeaderItem[] | null;
	thin?: boolean;
	hideTitle?: boolean;
	displayMyAvatar?: boolean;
	disableFollowButton?: boolean;
}>(), {
	tabs: () => ([] as Tab[]),
});

const emit = defineEmits<{
	(ev: 'update:tab', key: string);
}>();

const injectedPageMetadata = injectReactiveMetadata();
const pageMetadata = computed(() => props.overridePageMetadata ?? injectedPageMetadata.value);

const hideTitle = computed(() => false);
const thin_ = props.thin || inject('shouldHeaderThin', false);

const el = shallowRef<HTMLElement | undefined>(undefined);
const tabRefs: Record<string, HTMLElement | null> = {};
const tabHighlightEl = shallowRef<HTMLElement | null>(null);
const bg = ref<string | undefined>(undefined);
const narrow = ref(false);
const hasTabs = computed(() => props.tabs.length > 0);
const hasActions = computed(() => props.actions && props.actions.length > 0);
const show = computed(() => {
	return !hideTitle.value || hasTabs.value || hasActions.value;
});

const showTabsPopup = (ev: MouseEvent) => {
	if (!hasTabs.value) return;
	if (!narrow.value) return;
	ev.preventDefault();
	ev.stopPropagation();
	const menu = props.tabs.map(tab => ({
		text: tab.title,
		icon: tab.icon,
		active: tab.key != null && tab.key === props.tab,
		action: (ev) => {
			onTabClick(tab, ev);
		},
	}));
	os.popupMenu(menu, (ev.currentTarget ?? ev.target) as HTMLElement);
};

const preventDrag = (ev: TouchEvent) => {
	ev.stopPropagation();
};

const top = (ev: MouseEvent) => {
	const pos = getScrollPosition(el.value as HTMLElement);
	if (el.value && pos !== 0) {
		scrollToTop(el.value as HTMLElement, { behavior: 'smooth' });
	} else if (pos === 0) {
		os.popupMenu([{
			text: i18n.ts.reload,
			icon: 'ti ti-refresh',
			action: () => {
				location.reload();
			},
		}], ev.currentTarget ?? ev.target);
	}
};

function openAccountMenu(ev: MouseEvent) {
	openAccountMenu_({
		withExtraOperation: true,
	}, ev);
}

function onTabMousedown(tab: Tab, ev: MouseEvent): void {
	// ユーザビリティの観点からmousedown時にはonClickは呼ばない
	if (tab.key) {
		emit('update:tab', tab.key);
	}
}

function onTabClick(tab: Tab, ev: MouseEvent): void {
	if (tab.onClick) {
		ev.preventDefault();
		ev.stopPropagation();
		tab.onClick(ev);
	}
	if (tab.key) {
		emit('update:tab', tab.key);
	}
}

function goBack() {
	history.back();
}

const calcBg = () => {
	const rawBg = 'var(--MI_THEME-bg)';
	const tinyBg = tinycolor(rawBg.startsWith('var(') ? getComputedStyle(document.documentElement).getPropertyValue(rawBg.slice(4, -1)) : rawBg);
	if (narrow.value) tinyBg.setAlpha(1);
	else tinyBg.setAlpha(0.85);
	bg.value = tinyBg.toRgbString();
};

let ro: ResizeObserver | null;

onMounted(() => {
	watch(() => [props.tab, props.tabs], () => {
		nextTick(() => {
			const tabEl = props.tab ? tabRefs[props.tab] : undefined;
			if (tabEl && tabHighlightEl.value && tabEl.parentElement) {
				// offsetWidth や offsetLeft は少数を丸めてしまうため getBoundingClientRect を使う必要がある
				// https://developer.mozilla.org/ja/docs/Web/API/HTMLElement/offsetWidth#%E5%80%A4
				const parentRect = tabEl.parentElement.getBoundingClientRect();
				const rect = tabEl.getBoundingClientRect();
				tabHighlightEl.value.style.width = `${rect.width}px`;
				tabHighlightEl.value.style.left = `${rect.left - parentRect.left}px`;
			}
		});
	}, {
		immediate: true,
	});

	if (el.value?.parentElement) {
		narrow.value = el.value.parentElement.offsetWidth < 500;
		ro = new ResizeObserver((entries, observer) => {
			if (el.value?.parentElement && document.body.contains(el.value as HTMLElement)) {
				narrow.value = el.value.parentElement.offsetWidth < 500;
			}
		});
		ro.observe(el.value.parentElement as HTMLElement);
	}

	calcBg();
	globalEvents.on('themeChanged', calcBg);
});

onUnmounted(() => {
	globalEvents.off('themeChanged', calcBg);
	if (ro) ro.disconnect();
});
</script>

<style lang="scss" module>
.root {
	--height: 50px;
	display: flex;
	width: 100%;
	-webkit-backdrop-filter: var(--MI-blur, blur(15px));
	backdrop-filter: var(--MI-blur, blur(15px));
	border-bottom: solid 0.5px var(--MI_THEME-divider);
	contain: strict;
	height: var(--height);

	&.thin {
		--height: 42px;

		> .buttons {
			> .button {
				font-size: 0.9em;
			}
		}
	}

	&.slim {
		text-align: center;

		> .titleContainer {
			flex: 1;
			margin: 0 auto;

			> *:first-child {
				margin-left: auto;
			}

			> *:last-child {
				margin-right: auto;
			}
		}
	}

	&.reduceBlurEffect {
		-webkit-backdrop-filter: none;
		backdrop-filter: none;
	}
}

.buttons {
	--MI-margin: 8px;
	display: flex;
	align-items: center;
	min-width: var(--height);
	height: var(--height);

	&:empty {
		width: var(--height);
	}
}

.buttonsLeft {
	composes: buttons;
	margin: 0 var(--MI-margin) 0 0;
}

.buttonsRight {
	composes: buttons;
	margin: 0 0 0 var(--MI-margin);
}

.followButton {
	composes: buttons;
	margin: 0 var(--MI-margin) 0 0;
}

.goBack {
	margin-left: 8px;

	> i {
		margin: auto;
		font-size: medium;
	}
}

.avatar {
	$size: 32px;
	display: inline-block;
	width: $size;
	height: $size;
	vertical-align: bottom;
	margin: 0 8px;
}

.button {
	display: flex;
	align-items: center;
	justify-content: center;
	height: var(--height);
	width: calc(var(--height) - (var(--MI-margin)));
	box-sizing: border-box;
	position: relative;
	border-radius: 5px;

	&:hover {
		background: rgba(0, 0, 0, 0.05);
	}

	&.highlighted {
		color: var(--MI_THEME-accent);
	}
}

.fullButton {
	& + .fullButton {
		margin-left: 12px;
	}
}

.titleContainer {
	display: flex;
	align-items: center;
	max-width: min(30vw, 400px);
	overflow: clip;
	white-space: nowrap;
	text-align: left;
	font-weight: bold;
	flex-shrink: 1;
	margin-left: 24px;
	-webkit-tap-highlight-color: transparent;
}

.titleContainer_canBack {
	margin-left: -32px;
}

.titleAvatarContainer {
	$size: 32px;
	contain: strict;
	overflow: clip;
	width: $size;
	height: $size;
	padding: 8px;
	flex-shrink: 0;
}

.titleAvatar {
	width: 100%;
	height: 100%;
	pointer-events: none;
}

.titleIcon {
	margin-right: 8px;
	width: 16px;
	text-align: center;
}

.title {
	min-width: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	line-height: 1.1;
}

.subtitle {
	opacity: 0.6;
	font-size: 0.8em;
	font-weight: normal;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;

	&.activeTab {
		text-align: center;

		> .chevron {
			display: inline-block;
			margin-left: 6px;
		}
	}
}

.tabs {
	position: relative;
	margin-left: 16px;
	font-size: 0.8em;
	overflow: auto;
	white-space: nowrap;
}

.tab {
	display: inline-block;
	position: relative;
	padding: 0 10px;
	height: 100%;
	font-weight: normal;
	opacity: 0.7;

	&:hover {
		opacity: 1;
	}

	&.active {
		opacity: 1;
	}
}

.tabIcon + .tabTitle {
	margin-left: 8px;
}

.tabHighlight {
	position: absolute;
	bottom: 0;
	height: 3px;
	background: var(--MI_THEME-accent);
	border-radius: 999px;
	transition: all 0.2s ease;
	pointer-events: none;
}

@container (max-width: 500px) {
	.followButton {
		margin: 0;
	}
}
</style>
