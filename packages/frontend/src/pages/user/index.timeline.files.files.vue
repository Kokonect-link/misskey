<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<div v-if="note.files.length > 0" :class="[$style.root, $style.visible]">
	<div v-if="!showingFiles.includes(note.files[0].id)" :key="note.id + note.files[0].id" :class="$style.img" @click="onClick($event,note.files[0])" @dblclick="onDblClick(note.files[0])">
		<!-- TODO: 画像以外のファイルに対応 -->
		<ImgWithBlurhash :class="$style.sensitiveImg" :hash="note.files[0].blurhash" :src="thumbnail(note.files[0])" :title="note.files[0].name" :forceBlurhash="true"/>
		<div :class="$style.sensitive">
			<div>
				<div v-if="note.files[0].isSensitive" style="display: block;"><i class="ti ti-eye-exclamation"></i> {{ i18n.ts.sensitive }}{{ defaultStore.state.dataSaver.media ? ` (${i18n.ts.image}${note.files[0].size ? ' ' + bytes(note.files[0].size) : ''})` : '' }}</div>
				<div v-else style="display: block;"><i class="ti ti-photo"></i> {{ defaultStore.state.dataSaver.media && note.files[0].size ? bytes(note.files[0].size) : i18n.ts.image }}</div>
				<div>{{ i18n.ts.clickToShow }}</div>
			</div>
		</div>
	</div>
	<MkA v-else :class="[$style.img, { [$style.multipleImg]: note.files.length > 1 }]" :to="notePage(note)">
		<!-- TODO: 画像以外のファイルに対応 -->
		<ImgWithBlurhash
			:hash="note.files[0].blurhash"
			:src="thumbnail(note.files[0])"
			:title="note.files[0].name"
			@mouseover="defaultStore.state.showingAnimatedImages === 'interaction' ? playAnimation = true : ''"
			@mouseout="defaultStore.state.showingAnimatedImages === 'interaction' ? playAnimation = false : ''"
			@touchstart="defaultStore.state.showingAnimatedImages === 'interaction' ? playAnimation = true : ''"
			@touchend="defaultStore.state.showingAnimatedImages === 'interaction' ? playAnimation = false : ''"
		/>
		<div :class="$style.indicators">
			<div v-if="['image/gif'].includes(note.files[0].type)" :class="$style.indicator">GIF</div>
			<div v-if="['image/apng'].includes(note.files[0].type)" :class="$style.indicator">APNG</div>
			<div v-if="note.files[0].isSensitive" :class="$style.indicator" style="color: var(--MI_THEME-warn);" :title="i18n.ts.sensitive"><i class="ti ti-eye-exclamation"></i></div>
		</div>
	</MkA>
	<div v-if="note.files.length > 1" :class="$style.multiple">
		<span style="text-align: center; margin-right: 0.25em;">{{ note.files.length }}</span>
		<i class="ti ti-box-multiple-filled"></i>
	</div>
</div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import * as Misskey from 'cherrypick-js';
import * as os from '@/os.js';
import bytes from '@/filters/bytes.js';
import { getStaticImageUrl } from '@/scripts/media-proxy.js';
import { notePage } from '@/filters/note.js';
import ImgWithBlurhash from '@/components/MkImgWithBlurhash.vue';
import MkA from '@/components/global/MkA.vue';
import { defaultStore } from '@/store.js';
import { i18n } from '@/i18n.js';
import MkRippleEffect from '@/components/MkRippleEffect.vue';

const props = defineProps<{
	user: Misskey.entities.UserDetailed;
	note: Misskey.entities.Note & { files:Misskey.entities.DriveFile[] };
}>();

const showingFiles = ref<string[]>([]);

const playAnimation = ref(true);
if (defaultStore.state.showingAnimatedImages === 'interaction') playAnimation.value = false;
let playAnimationTimer = setTimeout(() => playAnimation.value = false, 5000);

function thumbnail(image: Misskey.entities.DriveFile): string | null {
	return (defaultStore.state.disableShowingAnimatedImages || defaultStore.state.dataSaver.media) || (['interaction', 'inactive'].includes(<string>defaultStore.state.showingAnimatedImages) && !playAnimation.value)
		? getStaticImageUrl(image.url)
		: image.thumbnailUrl;
}

async function onClick(ev: MouseEvent, image:Misskey.entities.DriveFile) {
	if (!showingFiles.value.includes(image.id)) {
		ev.stopPropagation();
		if (image.isSensitive && defaultStore.state.confirmWhenRevealingSensitiveMedia) {
			const { canceled } = await os.confirm({
				type: 'question',
				text: i18n.ts.sensitiveMediaRevealConfirm,
			});
			if (canceled) return;
			showingFiles.value.push(image.id);
		}
	}

	if (defaultStore.state.nsfwOpenBehavior === 'doubleClick') os.popup(MkRippleEffect, { x: ev.clientX, y: ev.clientY }, {});
	if (defaultStore.state.nsfwOpenBehavior === 'click') showingFiles.value.push(image.id);
}

async function onDblClick(image:Misskey.entities.DriveFile) {
	if (!showingFiles.value.includes(image.id) && defaultStore.state.nsfwOpenBehavior === 'doubleClick') showingFiles.value.push(image.id);
}

watch(() => props.note, () => {
	if (defaultStore.state.nsfw === 'force' || defaultStore.state.dataSaver.media) {
		//hide = true;
	} else {
		for (const image of props.note.files) {
			if (image.isSensitive) {
				if (defaultStore.state.nsfw !== 'ignore') {
					//hide = true;
				} else {
					if (!showingFiles.value.includes(image.id)) {
						showingFiles.value.push(image.id);
					}
				}
			} else {
				if (!showingFiles.value.includes(image.id)) {
					showingFiles.value.push(image.id);
				}
			}
		}
	}
}, {
	deep: true,
	immediate: true,
});

function resetTimer() {
	playAnimation.value = true;
	clearTimeout(playAnimationTimer);
	playAnimationTimer = setTimeout(() => playAnimation.value = false, 5000);
}

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
}

.img {
	display: flex;
	position: relative;
	height: 224px;
	border-radius: 3px;
	overflow: clip;
}

.empty {
	margin: 0;
	padding: 16px;
	text-align: center;
}

.sensitiveImg {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	filter: brightness(0.7);
}

.sensitive {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: grid;
	place-items: center;
	font-size: 0.8em;
	color: #fff;
	cursor: pointer;
}
.sensitive > div{
	display: flex;
	flex-direction: column;
	align-items: center;
}

.visible {
	position: relative;
	-webkit-tap-highlight-color: transparent;
	//box-shadow: 0 0 0 1px var(--MI_THEME-divider) inset;
	background: var(--MI_THEME-bg);
	background-size: 16px 16px;
}

html[data-color-scheme=dark] .visible {
	--c: rgb(255 255 255 / 2%);
	background-image: linear-gradient(45deg, var(--c) 16.67%, var(--MI_THEME-bg) 16.67%, var(--MI_THEME-bg) 50%, var(--c) 50%, var(--c) 66.67%, var(--MI_THEME-bg) 66.67%, var(--MI_THEME-bg) 100%);
}

html[data-color-scheme=light] .visible {
	--c: rgb(0 0 0 / 2%);
	background-image: linear-gradient(45deg, var(--c) 16.67%, var(--MI_THEME-bg) 16.67%, var(--MI_THEME-bg) 50%, var(--c) 50%, var(--c) 66.67%, var(--MI_THEME-bg) 66.67%, var(--MI_THEME-bg) 100%);
}

.multipleImg {
	filter: brightness(0.9);
}

.multiple {
	display: flex;
	align-items: center;
	justify-content: center;
	position: absolute;
	top: 10px;
	right: 10px;
	font-size: 1.25em;
	color: #fff;
	opacity: .9;
	filter: drop-shadow(0 0 1.5px #6060608a);
}

.indicators {
	display: inline-flex;
	position: absolute;
	top: 10px;
	left: 10px;
	pointer-events: none;
	opacity: .5;
	gap: 6px;
}

.indicator {
	/* Hardcode to black because either --MI_THEME-bg or --MI_THEME-fg makes it hard to read in dark/light mode */
	background-color: black;
	border-radius: 6px;
	color: var(--MI_THEME-accentLighten);
	display: inline-block;
	font-weight: bold;
	font-size: 0.8em;
	padding: 2px 5px;
}

.indicators {
	display: inline-flex;
	position: absolute;
	top: 10px;
	left: 10px;
	pointer-events: none;
	opacity: .5;
	gap: 6px;
}

.indicator {
	/* Hardcode to black because either --MI_THEME-bg or --MI_THEME-fg makes it hard to read in dark/light mode */
	background-color: black;
	border-radius: 6px;
	color: var(--MI_THEME-accentLighten);
	display: inline-block;
	font-weight: bold;
	font-size: 0.8em;
	padding: 2px 5px;
}

@container (max-width: 785px) {
	.img {
		height: 192px;
	}
}

@container (max-width: 660px) {
	.img {
		height: 160px;
	}
}

@container (max-width: 530px) {
	.img {
		height: 145px;
	}

	.multiple {
		top: 7px;
		right: 7px;
		font-size: 1.1em;
	}
}
</style>
