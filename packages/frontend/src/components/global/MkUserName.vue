<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<Mfm :text="userName(user)" :author="user" :plain="true" :nowrap="nowrap" :emojiUrls="user.emojis" :enableEmojiMenu="!!$i"/>
</template>

<script lang="ts" setup>
import { } from 'vue';
import * as Misskey from 'cherrypick-js';
import { userName } from '@/filters/user.js';
import { $i } from '@/account.js';

const props = withDefaults(defineProps<{
	user: Misskey.entities.User;
	nowrap?: boolean;
}>(), {
	nowrap: true,
});
</script>
