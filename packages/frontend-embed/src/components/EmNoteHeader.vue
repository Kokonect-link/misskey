<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<header :class="$style.root">
	<div :class="$style.section">
		<div style="display: flex;">
			<EmA :class="$style.name" :to="userPage(note.user)">
				<EmUserName :user="note.user"/>
			</EmA>
			<div v-if="note.user.isBot" :class="$style.isBot">bot</div>
			<div v-if="note.user.badgeRoles" :class="$style.badgeRoles">
				<img v-for="(role, i) in note.user.badgeRoles" :key="i" :class="$style.badgeRole" :src="role.iconUrl!"/>
			</div>
		</div>
		<div :class="$style.username"><EmAcct :user="note.user"/></div>
	</div>
	<div :class="$style.section">
		<div :class="$style.info">
			<span v-if="note.updatedAt" style="margin-right: 0.5em;"><i v-tooltip="i18n.tsx.noteUpdatedAt({ date: (new Date(note.updatedAt)).toLocaleDateString(), time: (new Date(note.updatedAt)).toLocaleTimeString() })" class="ti ti-pencil"></i></span>
			<span v-if="note.visibility !== 'public'" style="margin-left: 0.5em;">
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
			<span v-if="note.localOnly" style="margin-left: 0.5em;"><i class="ti ti-rocket-off"></i></span>
			<span v-if="note.channel" style="margin-left: 0.5em;" :title="note.channel.name"><i class="ti ti-device-tv"></i></span>
			<EmA :class="$style.time" :to="notePage(note)">
				<EmTime :time="note.createdAt" colored/>
			</EmA>
		</div>
		<div :style="$style.info"><EmInstanceTicker v-if="note.user.instance != null" :instance="note.user.instance"/></div>
	</div>
</header>
</template>

<script lang="ts" setup>
import { } from 'vue';
import * as Misskey from 'cherrypick-js';
import { notePage } from '@/utils.js';
import { userPage } from '@/utils.js';
import EmA from '@/components/EmA.vue';
import EmUserName from '@/components/EmUserName.vue';
import EmAcct from '@/components/EmAcct.vue';
import EmTime from '@/components/EmTime.vue';
import EmInstanceTicker from '@/components/EmInstanceTicker.vue';

defineProps<{
	note: Misskey.entities.Note;
}>();
</script>

<style lang="scss" module>
.root {
	display: flex;
}

.section {
	align-items: flex-start;
	white-space: nowrap;
	flex-direction: column;
	overflow: hidden;

	&:last-child {
		display: flex;
		align-items: flex-end;
		margin-left: auto;
		padding-left: 10px;
		overflow: clip;
	}
}

.name {
	flex-shrink: 1;
	display: block;
	margin: 0 .5em 0 0;
	padding: 0;
	overflow: hidden;
	overflow-wrap: anywhere;
	font-size: 1em;
	font-weight: bold;
	text-decoration: none;
	text-overflow: ellipsis;
	max-width: 300px;

	&::-webkit-scrollbar {
		display: none;
	}

	&:hover {
		color: var(--MI_THEME-nameHover);
		text-decoration: none;
	}
}

.isBot {
	flex-shrink: 0;
	align-self: center;
	margin: 0 .5em 0 0;
	padding: 1px 6px;
	font-size: 80%;
	border: solid 0.5px var(--MI_THEME-divider);
	border-radius: 3px;
}

.username {
	flex-shrink: 9999999;
	margin: 0 .5em 0 0;
	overflow: hidden;
	text-overflow: ellipsis;
	font-size: .95em;
	max-width: 300px;

	&::-webkit-scrollbar {
		display: none;
	}
}

.info {
	flex-shrink: 0;
	margin-left: auto;
	font-size: 0.9em;
}

.time {
	text-decoration: none;

	&:hover {
		text-decoration: none;
	}
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

.danger {
	color: var(--MI_THEME-accent);
}

@container (max-width: 500px) {
	.name, .username {
		max-width: 200px;
	}
}
</style>
