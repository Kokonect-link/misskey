<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<MkStickyContainer>
	<template #header>
		<CPPageHeader v-if="isMobile && defaultStore.state.mobileHeaderChange" v-model:tab="tab" :actions="headerActions" :tabs="headerTabs" :disableFollowButton="(user && (user.isBlocked || user.isBlocking)) == true"/>
		<MkPageHeader v-else v-model:tab="tab" :actions="headerActions" :tabs="headerTabs" :disableFollowButton="(user && (user.isBlocked || user.isBlocking)) == true"/>
	</template>
	<div>
		<div v-if="user">
			<MkHorizontalSwipe v-model:tab="tab" :tabs="headerTabs">
				<XHome v-if="tab === 'home'" key="home" :user="user" @unfoldFiles="() => { tab = 'files'; }"/>
				<MkSpacer v-else-if="tab === 'notes'" key="notes" :contentMax="800" style="padding-top: 0">
					<XTimeline :user="user"/>
				</MkSpacer>
				<XFiles v-else-if="tab === 'files'" :user="user"/>
				<XEvent v-else-if="tab === 'events'" key="events" :user="user"/>
				<XActivity v-else-if="tab === 'activity'" key="activity" :user="user"/>
				<XAchievements v-else-if="tab === 'achievements'" key="achievements" :user="user"/>
				<XClips v-else-if="tab === 'clips'" key="clips" :user="user"/>
				<XLists v-else-if="tab === 'lists'" key="lists" :user="user"/>
				<XPages v-else-if="tab === 'pages'" key="pages" :user="user"/>
				<XFlashs v-else-if="tab === 'flashs'" key="flashs" :user="user"/>
				<XGallery v-else-if="tab === 'gallery'" key="gallery" :user="user"/>
				<XRaw v-else-if="tab === 'raw'" key="raw" :user="user"/>
			</MkHorizontalSwipe>
		</div>
		<MkError v-else-if="error" @retry="fetchUser()"/>
		<MkLoading v-else/>
	</div>
</MkStickyContainer>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, computed, watch, ref } from 'vue';
import * as Misskey from 'cherrypick-js';
import * as os from '@/os.js';
import { $i } from '@/account.js';
import { acct as getAcct } from '@/filters/user.js';
import { misskeyApi } from '@/scripts/misskey-api.js';
import { definePageMetadata } from '@/scripts/page-metadata.js';
import { i18n } from '@/i18n.js';
import { getUserMenu } from '@/scripts/get-user-menu.js';
import { mainRouter } from '@/router/main.js';
import { defaultStore } from '@/store.js';
import { deviceKind } from '@/scripts/device-kind.js';
import MkHorizontalSwipe from '@/components/MkHorizontalSwipe.vue';
import { serverContext, assertServerContext } from '@/server-context.js';

const MOBILE_THRESHOLD = 500;

const isMobile = ref(deviceKind === 'smartphone' || window.innerWidth <= MOBILE_THRESHOLD);
window.addEventListener('resize', () => {
	isMobile.value = deviceKind === 'smartphone' || window.innerWidth <= MOBILE_THRESHOLD;
});

const XHome = defineAsyncComponent(() => import('./home.vue'));
const XTimeline = defineAsyncComponent(() => import('./index.timeline.vue'));
const XFiles = defineAsyncComponent(() => import('./files.vue'));
const XEvent = defineAsyncComponent(() => import('./events.vue'));
const XActivity = defineAsyncComponent(() => import('./activity.vue'));
const XAchievements = defineAsyncComponent(() => import('./achievements.vue'));
const XClips = defineAsyncComponent(() => import('./clips.vue'));
const XLists = defineAsyncComponent(() => import('./lists.vue'));
const XPages = defineAsyncComponent(() => import('./pages.vue'));
const XFlashs = defineAsyncComponent(() => import('./flashs.vue'));
const XGallery = defineAsyncComponent(() => import('./gallery.vue'));
const XRaw = defineAsyncComponent(() => import('./raw.vue'));

// contextは非ログイン状態の情報しかないためログイン時は利用できない
const CTX_USER = !$i && assertServerContext(serverContext, 'user') ? serverContext.user : null;

const props = withDefaults(defineProps<{
	acct: string;
	page?: string;
}>(), {
	page: 'home',
});

const tab = ref(props.page);

const user = ref<null | Misskey.entities.UserDetailed>(CTX_USER);
const error = ref<any>(null);

function fetchUser(): void {
	if (props.acct == null) return;

	const { username, host } = Misskey.acct.parse(props.acct);

	if (CTX_USER && CTX_USER.username === username && CTX_USER.host === host) {
		user.value = CTX_USER;
		return;
	}

	user.value = null;
	misskeyApi('users/show', {
		username,
		host,
	}).then(u => {
		user.value = u;
	}).catch(err => {
		error.value = err;
	});
}

watch(() => props.acct, fetchUser, {
	immediate: true,
});

const headerActions = computed(() => [{
	icon: 'ti ti-dots',
	text: i18n.ts.menu,
	handler: menu,
}]);

const headerTabs = computed(() => user.value ? [{
	key: 'home',
	title: i18n.ts.overview,
	icon: 'ti ti-home',
}, ...(!user.value.isBlocked ? [{
	key: 'notes',
	title: i18n.ts.notes,
	icon: 'ti ti-pencil',
}, {
	key: 'files',
	title: i18n.ts.files,
	icon: 'ti ti-photo',
}, {
	key: 'events',
	title: i18n.ts.events,
	icon: 'ti ti-calendar',
}, {
	key: 'activity',
	title: i18n.ts.activity,
	icon: 'ti ti-chart-line',
}, ...(user.value.host == null ? [{
	key: 'achievements',
	title: i18n.ts.achievements,
	icon: 'ti ti-medal',
}] : []), {
	key: 'clips',
	title: i18n.ts.clips,
	icon: 'ti ti-paperclip',
}, {
	key: 'lists',
	title: i18n.ts.lists,
	icon: 'ti ti-list',
}, {
	key: 'pages',
	title: i18n.ts.pages,
	icon: 'ti ti-news',
}, {
	key: 'flashs',
	title: 'Play',
	icon: 'ti ti-player-play',
}, {
	key: 'gallery',
	title: i18n.ts.gallery,
	icon: 'ti ti-icons',
}] : []), {
	key: 'raw',
	title: 'Raw',
	icon: 'ti ti-code',
}] : []);

function menu(ev) {
	const { menu, cleanup } = getUserMenu(user.value, mainRouter);
	os.popupMenu(menu, ev.currentTarget ?? ev.target).finally(cleanup);
}

definePageMetadata(() => ({
	title: i18n.ts.user,
	icon: 'ti ti-user',
	...user.value ? {
		title: user.value.name ? `${user.value.name} (@${user.value.username})` : `@${user.value.username}`,
		subtitle: `@${getAcct(user.value)}`,
		userName: user.value,
		avatar: user.value,
		path: `/@${user.value.username}`,
		share: {
			title: user.value.name,
		},
	} : {},
}));
</script>
