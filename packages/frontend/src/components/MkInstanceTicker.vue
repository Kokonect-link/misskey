<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<div :class="$style.root" :style="themeColorStyle">
	<img v-if="faviconUrl" :class="$style.icon" :src="faviconUrl"/>
	<div :class="$style.name">{{ instanceName }}</div>
</div>
</template>

<script lang="ts" setup>
import { computed, type CSSProperties } from 'vue';
import { instanceName as localInstanceName } from '@@/js/config.js';
import { instance as localInstance } from '@/instance.js';
import { getProxiedImageUrlNullable } from '@/scripts/media-proxy.js';

const props = defineProps<{
	host: string | null;
	instance?: {
		faviconUrl?: string | null
		name?: string | null
		themeColor?: string | null
	}
}>();

// if no instance data is given, this is for the local instance
const instanceName = computed(() => props.host == null ? localInstanceName : props.instance?.name ?? props.host);

const faviconUrl = computed(() => {
	let imageSrc: string | null = null;
	if (props.host == null) {
		if (localInstance.iconUrl == null) {
			return '/favicon.ico';
		} else {
			imageSrc = localInstance.iconUrl;
		}
	} else {
		imageSrc = props.instance?.faviconUrl ?? null;
	}
	return getProxiedImageUrlNullable(imageSrc);
});

const themeColorStyle = computed<CSSProperties>(() => {
	const themeColor = (props.host == null ? localInstance.themeColor : props.instance?.themeColor) ?? '#777777';
	return {
		background: `${themeColor}`,
	};
});
</script>

<style lang="scss" module>
$height: 2ex;

.root {
	display: flex;
	cursor: pointer;
	align-items: center;
	height: $height;
	border-radius: .5rem;
	overflow: clip;
	color: #000;
	margin-top: 5px;
	padding: 1px 5px 1px 0;
	text-shadow: /* .866 ≈ sin(60deg) */
		1px 0 1px #fff,
		.866px .5px 1px #fff,
		.5px .866px 1px #fff,
		0 1px 1px #fff,
		-.5px .866px 1px #fff,
		-.866px .5px 1px #fff,
		-1px 0 1px #fff,
		-.866px -.5px 1px #fff,
		-.5px -.866px 1px #fff,
		0 -1px 1px #fff,
		.5px -.866px 1px #fff,
		.866px -.5px 1px #fff;
}

.icon {
	height: 2.5ex;
	flex-shrink: 0;
}

.name {
	margin-left: 4px;
	line-height: 1;
	font-size: 0.9em;
	font-weight: bold;
	white-space: nowrap;
	overflow: hidden;
  overflow-wrap: anywhere;
  max-width: 300px;
  text-overflow: ellipsis;

  &::-webkit-scrollbar {
    display: none;
  }
}

@container (max-width: 500px) {
  .name {
    max-width: 100px;
  }
}
</style>
