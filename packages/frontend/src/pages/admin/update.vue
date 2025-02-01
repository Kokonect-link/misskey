<!--
SPDX-FileCopyrightText: syuilo and misskey-project & noridev and cherrypick-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<MkStickyContainer>
	<template #header><XHeader :actions="headerActions" :tabs="headerTabs"/></template>
	<MkSpacer :contentMax="700" :marginMin="16" :marginMax="32">
		<FormSuspense :p="init">
			<div class="_gaps_m">
				<div class="_panel" style="padding: 16px;">
					<MkSwitch v-model="enableReceivePrerelease">
						<template #label>{{ i18n.ts.enableReceivePrerelease }}</template>
					</MkSwitch>
				</div>

				<template v-if="(version && version.length > 0) && (releasesCherryPick && releasesCherryPick.length > 0)">
					<FormInfo v-if="compareVersions(version, releasesCherryPick[0].tag_name) > 0">{{ i18n.ts.youAreRunningBetaClient }}</FormInfo>
					<FormInfo v-else-if="compareVersions(version, releasesCherryPick[0].tag_name) === 0" check>{{ i18n.ts.youAreRunningUpToDateClient }}</FormInfo>
					<FormInfo v-else warn>{{ i18n.ts.newVersionOfClientAvailable }}</FormInfo>
				</template>
				<FormInfo v-else>{{ i18n.ts.loading }}</FormInfo>

				<FormSection first>
					<template #label>{{ instanceName }}</template>
					<MkKeyValue @click="whatIsNewCherryPick">
						<template #key>{{ i18n.ts.currentVersion }} <i class="ti ti-external-link"></i></template>
						<template #value>{{ version }}</template>
					</MkKeyValue>
					<MkKeyValue v-if="version < releasesCherryPick[0].tag_name && !skipVersion" style="margin-top: 10px;" @click="whatIsNewLatestCherryPick">
						<template #key>{{ i18n.ts.latestVersion }} <i class="ti ti-external-link"></i></template>
						<template v-if="releasesCherryPick" #value>{{ releasesCherryPick[0].tag_name }}</template>
						<template v-else #value><MkEllipsis/></template>
					</MkKeyValue>
					<MkButton v-if="!skipVersion && (compareVersions(version, releasesCherryPick[0].tag_name) < 0)" style="margin-top: 10px;" @click="skipThisVersion">{{ i18n.ts.skipThisVersion }}</MkButton>
				</FormSection>

				<FormSection @click="whatIsNewLatestCherryPick">
					<template #label>CherryPick <i class="ti ti-external-link"></i></template>
					<MkKeyValue>
						<template #key>{{ i18n.ts.latestVersion }}</template>
						<template v-if="releasesCherryPick" #value>{{ releasesCherryPick[0].tag_name }}</template>
						<template v-else #value><MkEllipsis/></template>
					</MkKeyValue>
					<MkKeyValue style="margin: 8px 0 0; color: var(--MI_THEME-fgTransparentWeak); font-size: 0.85em;">
						<template v-if="releasesCherryPick" #value><MkTime :time="releasesCherryPick[0].published_at" mode="detail"/></template>
						<template v-else #value><MkEllipsis/></template>
					</MkKeyValue>
				</FormSection>

				<FormSection @click="whatIsNewLatestMisskey">
					<template #label>Misskey <i class="ti ti-external-link"></i></template>
					<MkKeyValue>
						<template #key>{{ i18n.ts.latestVersion }}</template>
						<template v-if="releasesMisskey" #value>{{ releasesMisskey[0].tag_name }}</template>
						<template v-else #value><MkEllipsis/></template>
					</MkKeyValue>
					<MkKeyValue style="margin: 8px 0 0; color: var(--MI_THEME-fgTransparentWeak); font-size: 0.85em;">
						<template v-if="releasesMisskey" #value><MkTime :time="releasesMisskey[0].published_at" mode="detail"/></template>
						<template v-else #value><MkEllipsis/></template>
					</MkKeyValue>
				</FormSection>
			</div>
		</FormSuspense>
	</MkSpacer>
</MkStickyContainer>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { version, instanceName, basedMisskeyVersion } from '@@/js/config.js';
import { compareVersions } from 'compare-versions';
import * as os from '@/os.js';
import { misskeyApi } from '@/scripts/misskey-api.js';
import FormInfo from '@/components/MkInfo.vue';
import FormSection from '@/components/form/section.vue';
import MkKeyValue from '@/components/MkKeyValue.vue';
import { definePageMetadata } from '@/scripts/page-metadata.js';
import { i18n } from '@/i18n.js';
import XHeader from '@/pages/admin/_header_.vue';
import MkSwitch from '@/components/MkSwitch.vue';
import { fetchInstance } from '@/instance.js';
import FormSuspense from '@/components/form/suspense.vue';
import MkButton from '@/components/MkButton.vue';

const enableReceivePrerelease = ref<boolean>(false);
const skipVersion = ref<boolean>(false);
const skipCherryPickVersion = ref<string | null>(null);

const releasesCherryPick = ref(null);
const releasesMisskey = ref(null);

const meta = await misskeyApi('admin/meta');

async function init() {
	enableReceivePrerelease.value = meta.enableReceivePrerelease;
	skipVersion.value = meta.skipVersion;
	skipCherryPickVersion.value = meta.skipCherryPickVersion;

	try {
		// CherryPick Releases Fetch
		const cherryPickResponse = await fetch('https://api.github.com/repos/kokonect-link/cherrypick/releases');
		const cherryPickData = await cherryPickResponse.json();
		releasesCherryPick.value = meta.enableReceivePrerelease ? cherryPickData : cherryPickData.filter(x => !x.prerelease);

		if (compareVersions(skipCherryPickVersion.value, releasesCherryPick.value[0].tag_name) < 0) {
			skipVersion.value = false;
			await misskeyApi('admin/update-meta', { skipVersion: skipVersion.value });
		}
	} catch (error) {
		console.error('Failed to fetch CherryPick releases:', error);
	}

	try {
		// Misskey Releases Fetch
		const misskeyResponse = await fetch('https://api.github.com/repos/misskey-dev/misskey/releases');
		const misskeyData = await misskeyResponse.json();
		releasesMisskey.value = meta.enableReceivePrerelease ? misskeyData : misskeyData.filter(x => !x.prerelease);
	} catch (error) {
		console.error('Failed to fetch Misskey releases:', error);
	}
}

function save() {
	os.apiWithDialog('admin/update-meta', {
		enableReceivePrerelease: enableReceivePrerelease.value,
	}).then(() => {
		fetchInstance(true);
	});
}

function skipThisVersion() {
	skipCherryPickVersion.value = releasesCherryPick.value[0].tag_name;
	skipVersion.value = true;

	os.apiWithDialog('admin/update-meta', {
		skipVersion: skipVersion.value,
		skipCherryPickVersion: skipCherryPickVersion.value,
	}).then(() => {
		fetchInstance(true);
	});
}

const whatIsNewCherryPick = () => {
	window.open(`https://github.com/kokonect-link/cherrypick/blob/develop/CHANGELOG_CHERRYPICK.md#${version.replace(/\./g, '')}`, '_blank');
};

const whatIsNewLatestCherryPick = () => {
	window.open(`https://github.com/kokonect-link/cherrypick/blob/develop/CHANGELOG_CHERRYPICK.md#${releasesCherryPick.value[0].tag_name.replace(/\./g, '')}`, '_blank');
};

const whatIsNewMisskey = () => {
	window.open(`https://misskey-hub.net/docs/releases.html#_${basedMisskeyVersion.replace(/\./g, '-')}`, '_blank');
};

const whatIsNewLatestMisskey = () => {
	window.open(`https://github.com/misskey-dev/misskey/blob/develop/CHANGELOG.md#${releasesMisskey.value[0].tag_name.replace(/\./g, '')}`, '_blank');
};

const headerActions = computed(() => [{
	asFullButton: true,
	icon: 'ti ti-check',
	text: i18n.ts.save,
	handler: save,
}]);

const headerTabs = computed(() => []);

definePageMetadata(() => ({
	title: i18n.ts.cherrypickUpdate,
	icon: 'ti ti-refresh',
}));
</script>
