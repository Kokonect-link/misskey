<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<header :class="$style.root">
	<div :class="$style.section">
		<div style="display: flex; white-space: nowrap; align-items: baseline;">
			<div v-if="mock" :class="$style.name">
				<MkUserName :user="note.user"/>
			</div>
			<MkA v-else v-user-preview="note.user.id" :class="$style.name" :to="userPage(note.user)" noteClick>
				<MkUserName :user="note.user"/>
			</MkA>
			<div v-if="note.user.isBot" :class="$style.isBot">bot</div>
			<div v-if="note.user.badgeRoles" :class="$style.badgeRoles">
				<img v-for="(role, i) in note.user.badgeRoles" :key="i" v-tooltip="role.name" :class="$style.badgeRole" :src="role.iconUrl!"/>
			</div>
		</div>
		<div :class="$style.username"><MkAcct :user="note.user"/></div>
	</div>
	<div :class="$style.section">
		<div :class="$style.info">
			<span v-if="note.updatedAt" style="margin-right: 0.5em;"><i v-tooltip="i18n.tsx.noteUpdatedAt({ date: (new Date(note.updatedAt)).toLocaleDateString(), time: (new Date(note.updatedAt)).toLocaleTimeString() })" class="ti ti-pencil"></i></span>
			<span v-if="note.deleteAt" style="margin-right: 0.5em;"><i v-tooltip="`${i18n.ts.scheduledNoteDelete}: ${(new Date(note.deleteAt)).toLocaleString()}`" class="ti ti-bomb"></i></span>
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
			<div v-if="mock">
				<MkTime :time="note.createdAt" colored/>
			</div>
			<MkA v-else :class="$style.time" :to="notePage(note)">
				<MkTime :time="note.createdAt" :mode="defaultStore.state.enableAbsoluteTime ? 'absolute' : 'relative'" colored/>
			</MkA>
		</div>
		<div :style="$style.info"><MkInstanceTicker v-if="showTicker" :host="note.user.host" :instance="note.user.instance" @click.stop="showOnRemote"/></div>
	</div>
</header>
</template>

<script lang="ts" setup>
import { inject } from 'vue';
import * as Misskey from 'cherrypick-js';
import { i18n } from '@/i18n.js';
import { notePage } from '@/filters/note.js';
import { userPage } from '@/filters/user.js';
import { defaultStore } from '@/store.js';
import { useRouter } from '@/router/supplier.js';
import MkInstanceTicker from '@/components/MkInstanceTicker.vue';

const props = defineProps<{
	note: Misskey.entities.Note & {
		isSchedule?: boolean
	};
	scheduled?: boolean;
}>();

const mock = inject<boolean>('mock', false);

const showTicker = (defaultStore.state.instanceTicker === 'always') || (defaultStore.state.instanceTicker === 'remote' && props.note.user.instance);
const router = useRouter();

function showOnRemote() {
	if (props.note.user.instance === undefined) router.push(notePage(props.note));
	else window.open(props.note.url ?? props.note.uri, '_blank', 'noopener');
}
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
