<!--
SPDX-FileCopyrightText: syuilo and misskey-project & noridev and cherrypick-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<component :is="link ? MkA : 'span'" v-user-preview="preview ? user.id : undefined" v-bind="bound" class="_noSelect" :class="$style.root" :style="{ color }" :title="acct(user)" @click="onClick">
	<MkImgWithBlurhash
		:class="[$style.inner, $style.noDrag, { [$style.reduceBlurEffect]: !defaultStore.state.useBlurEffect }]"
		:src="url"
		:hash="user.avatarBlurhash"
		:cover="true"
		:onlyAvgColor="true"
		:noDrag="true"
		@mouseover="defaultStore.state.showingAnimatedImages === 'interaction' ? playAnimation = true : ''"
		@mouseout="defaultStore.state.showingAnimatedImages === 'interaction' ? playAnimation = false : ''"
		@touchstart="defaultStore.state.showingAnimatedImages === 'interaction' ? playAnimation = true : ''"
		@touchend="defaultStore.state.showingAnimatedImages === 'interaction' ? playAnimation = false : ''"
	/>
	<template v-if="showDecoration && defaultStore.state.friendlyUiShowAvatarDecorationsInNavBtn">
		<img
			v-for="decoration in decorations ?? user.avatarDecorations"
			:class="[$style.decoration, { [$style.decorationBlink]: decoration.blink }]"
			:src="getDecorationUrl(decoration)"
			:style="{
				rotate: getDecorationAngle(decoration),
				scale: getDecorationScale(decoration),
				translate: getDecorationOffset(decoration),
				transform: getDecorationTransform(decoration),
				opacity: getDecorationOpacity(decoration),
			}"
			alt=""
		>
	</template>
</component>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, watch, ref, computed } from 'vue';
import * as Misskey from 'cherrypick-js';
import { extractAvgColorFromBlurhash } from '@@/js/extract-avg-color-from-blurhash.js';
import MkImgWithBlurhash from '../MkImgWithBlurhash.vue';
import MkA from './MkA.vue';
import { getStaticImageUrl } from '@/scripts/media-proxy.js';
import { acct, userPage } from '@/filters/user.js';
import { defaultStore } from '@/store.js';

const props = withDefaults(defineProps<{
	user: Misskey.entities.User;
	target?: string | null;
	link?: boolean;
	preview?: boolean;
	decorations?: (Omit<Misskey.entities.UserDetailed['avatarDecorations'][number], 'id'> & { blink?: boolean; })[];
	forceShowDecoration?: boolean;
}>(), {
	target: null,
	link: false,
	preview: false,
	decorations: undefined,
	forceShowDecoration: false,
});

const emit = defineEmits<{
	(ev: 'click', v: MouseEvent): void;
}>();

const showDecoration = props.forceShowDecoration || defaultStore.state.showAvatarDecorations;

const bound = computed(() => props.link
	? { to: userPage(props.user), target: props.target }
	: {});

const playAnimation = ref(true);
if (defaultStore.state.showingAnimatedImages === 'interaction') playAnimation.value = false;
let playAnimationTimer = setTimeout(() => playAnimation.value = false, 5000);
const url = computed(() => {
	if (props.user.avatarUrl == null) return null;
	if (defaultStore.state.disableShowingAnimatedImages || defaultStore.state.dataSaver.avatar || (['interaction', 'inactive'].includes(<string>defaultStore.state.showingAnimatedImages) && !playAnimation.value)) return getStaticImageUrl(props.user.avatarUrl);
	return props.user.avatarUrl;
});

function onClick(ev: MouseEvent): void {
	if (props.link) return;
	emit('click', ev);
}

function getDecorationUrl(decoration: Omit<Misskey.entities.UserDetailed['avatarDecorations'][number], 'id'>) {
	if (defaultStore.state.disableShowingAnimatedImages || defaultStore.state.dataSaver.avatar || (['interaction', 'inactive'].includes(<string>defaultStore.state.showingAnimatedImages) && !playAnimation.value)) return getStaticImageUrl(decoration.url);
	return decoration.url;
}

function getDecorationAngle(decoration: Omit<Misskey.entities.UserDetailed['avatarDecorations'][number], 'id'>) {
	const angle = decoration.angle ?? 0;
	return angle === 0 ? undefined : `${angle * 360}deg`;
}

function getDecorationScale(decoration: Omit<Misskey.entities.UserDetailed['avatarDecorations'][number], 'id'>) {
	const scaleX = decoration.flipH ? -1 : 1;
	return scaleX === 1 ? undefined : `${scaleX} 1`;
}

function getDecorationOffset(decoration: Omit<Misskey.entities.UserDetailed['avatarDecorations'][number], 'id'>) {
	const offsetX = decoration.offsetX ?? 0;
	const offsetY = decoration.offsetY ?? 0;
	return offsetX === 0 && offsetY === 0 ? undefined : `${offsetX * 100}% ${offsetY * 100}%`;
}

function getDecorationTransform(decoration: Omit<Misskey.entities.UserDetailed['avatarDecorations'][number], 'id'>) {
	const scale = decoration.scale ?? 1;
	return `${scale === 1 ? '' : `scale(${scale})`}`;
}

function getDecorationOpacity(decoration: Omit<Misskey.entities.UserDetailed['avatarDecorations'][number], 'id'>) {
	const opacity = decoration.opacity ?? 1;
	return opacity === 1 ? undefined : opacity;
}

function resetTimer() {
	playAnimation.value = true;
	clearTimeout(playAnimationTimer);
	playAnimationTimer = setTimeout(() => playAnimation.value = false, 5000);
}

const color = ref<string | undefined>();

watch(() => props.user.avatarBlurhash, () => {
	if (props.user.avatarBlurhash == null) return;
	color.value = extractAvgColorFromBlurhash(props.user.avatarBlurhash);
}, {
	immediate: true,
});

onMounted(() => {
	if (defaultStore.state.showingAnimatedImages === 'inactive') {
		window.addEventListener('mousemove', resetTimer);
		window.addEventListener('touchstart', resetTimer);
		window.addEventListener('touchend', resetTimer);
	}
});

onUnmounted(() => {
	if (defaultStore.state.showingAnimatedImages === 'inactive') {
		window.removeEventListener('mousemove', resetTimer);
		window.removeEventListener('touchstart', resetTimer);
		window.removeEventListener('touchend', resetTimer);
	}
});
</script>

<style lang="scss" module>
.root {
	position: relative;
	display: inline-block;
	vertical-align: bottom;
	flex-shrink: 0;
	// border-radius: 100%;
	line-height: 16px;
}

.inner {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	top: 0;
	border-radius: 28px;
	z-index: 1;
	overflow: clip;
	object-fit: cover;
	width: 100%;
	height: 100%;
	opacity: .7;

	&.reduceBlurEffect {
		opacity: 1;
	}

	&.noDrag {
		-webkit-user-drag: none;
	}
}

.decoration {
	position: absolute;
	z-index: 1;
	top: -50%;
	left: -50%;
	width: 200%;
	pointer-events: none;
}

.decorationBlink {
	animation: blink 1s infinite;
}

@keyframes blink {
	0%, 100% {
		filter: brightness(2);
	}
	50% {
		filter: brightness(1);
	}
}
</style>
