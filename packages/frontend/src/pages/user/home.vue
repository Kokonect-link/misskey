<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<MkSpacer :contentMax="narrow ? 800 : 1100">
	<div ref="rootEl" class="ftskorzw" :class="{ wide: !narrow }" style="container-type: inline-size;">
		<div class="main _gaps">
			<!-- TODO -->
			<!-- <div class="punished" v-if="user.isSuspended"><i class="ti ti-alert-triangle" style="margin-right: 8px;"></i> {{ i18n.ts.userSuspended }}</div> -->
			<!-- <div class="punished" v-if="user.isSilenced"><i class="ti ti-alert-triangle" style="margin-right: 8px;"></i> {{ i18n.ts.userSilenced }}</div> -->

			<div class="profile _gaps">
				<MkAccountMoved v-if="user.movedTo" :movedTo="user.movedTo"/>
				<MkRemoteCaution v-if="user.host != null" :href="user.url ?? user.uri!" class="warn"/>

				<div :key="user.id" class="main _panel">
					<div class="banner-container" :style="style">
						<div ref="bannerEl" class="banner" :style="style"></div>
						<div class="fade"></div>
						<div class="title">
							<div class="name">
								<MkUserName :user="user" :nowrap="true" @click="editNickname(props.user)"/>
							</div>
							<div class="bottom">
								<span class="username"><MkAcct :user="user" :detail="true"/></span>
								<span v-if="user.isAdmin" :title="i18n.ts.isAdmin" style="color: var(--MI_THEME-badge);"><i class="ti ti-shield"></i></span>
								<span v-if="user.isLocked" :title="i18n.ts.isLocked"><i class="ti ti-lock"></i></span>
								<span v-if="user.isBot" :title="i18n.ts.isBot"><i class="ti ti-robot"></i></span>
								<button v-if="$i && !isEditingMemo && !memoDraft" class="_button add-note-button" @click="showMemoTextarea">
									<i class="ti ti-edit"/> {{ i18n.ts.addMemo }}
								</button>
							</div>
						</div>
						<span v-if="$i && $i.id != user.id && user.isFollowed" class="followed">{{ i18n.ts.followsYou }}</span>
						<div class="actions">
							<button class="menu _button" @click="menu"><i class="ti ti-dots"></i></button>
							<button v-if="notesSearchAvailable && (user.host == null || canSearchNonLocalNotes)" v-tooltip="i18n.ts.searchThisUsersNotes" class="menu _button" @click="router.push(`/search?username=${encodeURIComponent(user.username)}${user.host != null ? '&host=' + encodeURIComponent(user.host) : ''}`);"><i class="ti ti-search"></i></button>
							<button v-tooltip="user.notify === 'none' ? i18n.ts.notifyNotes : i18n.ts.unnotifyNotes" class="menu _button" @click="toggleNotify"><i :class="user.notify === 'none' ? 'ti ti-bell-plus' : 'ti ti-bell-minus'"></i></button>
							<MkFollowButton v-if="$i?.id != user.id" v-model:user="user" :inline="true" :transparent="false" :full="true" class="koudoku"/>
						</div>
					</div>
					<MkAvatar class="avatar" :user="user" indicator/>
					<div class="title">
						<MkUserName :user="user" :nowrap="false" class="name" @click="editNickname(props.user)"/>
						<div class="bottom">
							<span class="username"><MkAcct :user="user" :detail="true"/></span>
							<span v-if="user.isAdmin" :title="i18n.ts.isAdmin" style="color: var(--MI_THEME-badge);"><i class="ti ti-shield"></i></span>
							<span v-if="user.isLocked" :title="i18n.ts.isLocked"><i class="ti ti-lock"></i></span>
							<span v-if="user.isBot" :title="i18n.ts.isBot"><i class="ti ti-robot"></i></span>
						</div>
					</div>
					<div v-if="user.followedMessage != null" class="followedMessage">
						<MkFukidashi class="fukidashi" :tail="narrow ? 'none' : 'left'" negativeMargin shadow>
							<div class="messageHeader">{{ i18n.ts.messageToFollower }}</div>
							<div><MkSparkle><Mfm :plain="true" :text="user.followedMessage" :author="user" :enableEmojiMenu="!!$i"/></MkSparkle></div>
						</MkFukidashi>
					</div>
					<div v-if="user.roles.length > 0" class="roles">
						<span v-for="role in user.roles" :key="role.id" v-tooltip="role.description" class="role" :style="{ '--color': role.color }">
							<MkA v-adaptive-bg :to="`/roles/${role.id}`">
								<img v-if="role.iconUrl" style="height: 1.3em; vertical-align: -22%; border-radius: 0.4em;" :src="role.iconUrl"/>
								{{ role.name }}
							</MkA>
						</span>
					</div>
					<div v-if="iAmModerator" class="moderationNote">
						<MkTextarea v-if="editModerationNote || (moderationNote != null && moderationNote !== '')" v-model="moderationNote" manualSave>
							<template #label>{{ i18n.ts.moderationNote }}</template>
							<template #caption>{{ i18n.ts.moderationNoteDescription }}</template>
						</MkTextarea>
						<div v-else>
							<MkButton class="moderationNoteButton" small @click="editModerationNote = true">{{ i18n.ts.addModerationNote }}</MkButton>
						</div>
					</div>
					<div v-if="isEditingMemo || memoDraft" class="memo" :class="{'no-memo': !memoDraft}">
						<div class="heading" v-text="i18n.ts.memo"/>
						<textarea
							ref="memoTextareaEl"
							v-model="memoDraft"
							rows="1"
							@focus="isEditingMemo = true"
							@blur="updateMemo"
							@input="adjustMemoTextarea"
						/>
					</div>
					<div class="description">
						<MkOmit>
							<Mfm v-if="user.description" :text="user.description" :isNote="false" :author="user" :enableEmojiMenu="!!$i"/>
							<p v-else class="empty">{{ i18n.ts.noAccountDescription }}</p>
							<div v-if="user.description && isForeignLanguage">
								<MkButton v-if="!(translating || translation)" class="translateButton" small @click="translate"><i class="ti ti-language-hiragana"></i> {{ i18n.ts.translateProfile }}</MkButton>
								<MkButton v-else class="translateButton" small @click="translation = null"><i class="ti ti-x"></i> {{ i18n.ts.close }}</MkButton>
							</div>
							<div v-if="translating || translation" class="translation">
								<MkLoading v-if="translating" mini/>
								<div v-else-if="translation">
									<b>{{ i18n.tsx.translatedFrom({ x: translation.sourceLang }) }}:</b><hr style="margin: 10px 0;">
									<Mfm :text="translation.text" :isNote="false" :author="user" :nyaize="false" :enableEmojiMenu="!!$i"/>
									<div v-if="translation.translator == 'ctav3'" style="margin-top: 10px; padding: 0 0 15px;">
										<img v-if="!defaultStore.state.darkMode" src="/client-assets/color-short.svg" alt="" style="float: right;">
										<img v-else src="/client-assets/white-short.svg" alt="" style="float: right;"/>
									</div>
								</div>
							</div>
						</MkOmit>
					</div>
					<div class="fields system">
						<dl v-if="user.location" class="field">
							<dt class="name"><i class="ti ti-map-pin ti-fw"></i> {{ i18n.ts.location }}</dt>
							<dd class="value">{{ user.location }}</dd>
						</dl>
						<dl v-if="user.birthday" class="field">
							<dt class="name"><i class="ti ti-cake ti-fw"></i> {{ i18n.ts.birthday }}</dt>
							<dd class="value">{{ user.birthday.replace('-', '/').replace('-', '/') }} ({{ i18n.tsx.yearsOld({ age }) }})</dd>
						</dl>
						<dl class="field">
							<dt class="name"><i class="ti ti-calendar ti-fw"></i> {{ i18n.ts.registeredDate }}</dt>
							<dd class="value">{{ dateString(user.createdAt) }} (<MkTime :time="user.createdAt"/>)</dd>
						</dl>
					</div>
					<div v-if="user.fields.length > 0" class="fields">
						<dl v-for="(field, i) in user.fields" :key="i" class="field">
							<dt class="name">
								<Mfm :text="field.name" :author="user" :plain="true" :colored="false" :enableEmojiMenu="!!$i"/>
							</dt>
							<dd class="value">
								<Mfm :text="field.value" :author="user" :colored="false" :enableEmojiMenu="!!$i"/>
								<i v-if="user.verifiedLinks.includes(field.value)" v-tooltip:dialog="i18n.ts.verifiedLink" class="ti ti-circle-check" :class="$style.verifiedLink"></i>
							</dd>
						</dl>
					</div>
					<div class="status">
						<MkA :to="userPage(user)">
							<b>{{ number(user.notesCount) }}</b>
							<span>{{ i18n.ts.notes }}</span>
						</MkA>
						<MkA v-if="isFollowingVisibleForMe(user)" :to="userPage(user, 'following')">
							<b>{{ number(user.followingCount) }}</b>
							<span>{{ i18n.ts.following }}</span>
						</MkA>
						<MkA v-if="isFollowersVisibleForMe(user)" :to="userPage(user, 'followers')">
							<b>{{ number(user.followersCount) }}</b>
							<span>{{ i18n.ts.followers }}</span>
						</MkA>
					</div>
				</div>
			</div>

			<div class="contents _gaps">
				<div v-if="user.pinnedNotes.length > 0 && !user.isBlocked" class="_gaps">
					<MkNote v-for="note in user.pinnedNotes" :key="note.id" class="note _panel" :note="note" :pinned="true"/>
				</div>
				<MkInfo v-else-if="$i && $i.id === user.id">{{ i18n.ts.userPagePinTip }}</MkInfo>
				<template v-if="narrow && !user.isBlocked">
					<MkLazy>
						<XFiles :key="user.id" :user="user" @unfold="emit('unfoldFiles')"/>
					</MkLazy>
					<MkLazy>
						<XActivity :key="user.id" :user="user"/>
					</MkLazy>
				</template>
				<div v-if="!disableNotes && !user.isBlocked">
					<MkLazy>
						<XTimeline :user="user"/>
					</MkLazy>
				</div>
				<div v-if="user.isBlocked" class="_fullinfo">
					<img :src="youBlockedImageUrl" class="_ghost"/>
					<div style="font-size: 1.4rem; font-weight: bold; padding-bottom: 4px;">{{ i18n.ts.youBlocked }}</div>
					<div style="opacity: 0.7">{{ i18n.tsx.youBlockedDescription({ user: `@${ user.username }` }) }}</div>
				</div>
			</div>
		</div>
		<div v-if="!narrow && !user.isBlocked" class="sub _gaps" style="container-type: inline-size;">
			<XFiles :key="user.id" :user="user" @unfold="emit('unfoldFiles')"/>
			<XActivity :key="user.id" :user="user"/>
		</div>
	</div>
</MkSpacer>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, computed, onMounted, onUnmounted, nextTick, watch, ref } from 'vue';
import * as Misskey from 'cherrypick-js';
import { getScrollPosition } from '@@/js/scroll.js';
import MkNote from '@/components/MkNote.vue';
import MkFollowButton from '@/components/MkFollowButton.vue';
import MkAccountMoved from '@/components/MkAccountMoved.vue';
import MkFukidashi from '@/components/MkFukidashi.vue';
import MkRemoteCaution from '@/components/MkRemoteCaution.vue';
import MkTextarea from '@/components/MkTextarea.vue';
import MkOmit from '@/components/MkOmit.vue';
import MkInfo from '@/components/MkInfo.vue';
import MkButton from '@/components/MkButton.vue';
import { getUserMenu } from '@/scripts/get-user-menu.js';
import number from '@/filters/number.js';
import { userPage } from '@/filters/user.js';
import * as os from '@/os.js';
import { i18n } from '@/i18n.js';
import { defaultStore } from '@/store.js';
import { $i, iAmModerator } from '@/account.js';
import { dateString } from '@/filters/date.js';
import { confetti } from '@/scripts/confetti.js';
import { misskeyApi } from '@/scripts/misskey-api.js';
import { isFollowingVisibleForMe, isFollowersVisibleForMe } from '@/scripts/isFfVisibleForMe.js';
import { useRouter } from '@/router/supplier.js';
import { getStaticImageUrl } from '@/scripts/media-proxy.js';
import MkSparkle from '@/components/MkSparkle.vue';
import { miLocalStorage } from '@/local-storage.js';
import { editNickname } from '@/scripts/edit-nickname.js';
import { vibrate } from '@/scripts/vibrate.js';
import detectLanguage from '@/scripts/detect-language.js';
import { globalEvents } from '@/events.js';
import { notesSearchAvailable, canSearchNonLocalNotes } from '@/scripts/check-permissions.js';
import { youBlockedImageUrl } from '@/instance.js';

function calcAge(birthdate: string): number {
	const date = new Date(birthdate);
	const now = new Date();

	let yearDiff = now.getFullYear() - date.getFullYear();
	const monthDiff = now.getMonth() - date.getMonth();
	const pastDate = now.getDate() < date.getDate();

	if (monthDiff < 0 || (monthDiff === 0 && pastDate)) {
		yearDiff--;
	}

	return yearDiff;
}

const XFiles = defineAsyncComponent(() => import('./index.files.vue'));
const XActivity = defineAsyncComponent(() => import('./index.activity.vue'));
const XTimeline = defineAsyncComponent(() => import('./index.timeline.vue'));

const props = withDefaults(defineProps<{
	user: Misskey.entities.UserDetailed;
	/** Test only; MkNotes currently causes problems in vitest */
	disableNotes: boolean;
}>(), {
	disableNotes: false,
});

const emit = defineEmits<{
	(ev: 'unfoldFiles'): void;
}>();

const router = useRouter();

const user = ref(props.user);
const parallaxAnimationId = ref<null | number>(null);
const narrow = ref<null | boolean>(null);
const rootEl = ref<null | HTMLElement>(null);
const bannerEl = ref<null | HTMLElement>(null);
const memoTextareaEl = ref<null | HTMLElement>(null);
const memoDraft = ref(props.user.memo);
const isEditingMemo = ref(false);
const moderationNote = ref(props.user.moderationNote);
const editModerationNote = ref(false);

const translation = ref<Misskey.entities.UsersTranslateResponse | null>(null);
const translating = ref(false);

watch(moderationNote, async () => {
	await misskeyApi('admin/update-user-note', { userId: props.user.id, text: moderationNote.value });
});

const playAnimation = ref(true);
if (defaultStore.state.showingAnimatedImages === 'interaction') playAnimation.value = false;
let playAnimationTimer = setTimeout(() => playAnimation.value = false, 5000);

const style = computed(() => {
	if (props.user.bannerUrl == null) return {};
	if (defaultStore.state.disableShowingAnimatedImages || defaultStore.state.dataSaver.avatar || (['interaction', 'inactive'].includes(<string>defaultStore.state.showingAnimatedImages) && !playAnimation.value)) {
		return {
			backgroundImage: `url(${ getStaticImageUrl(props.user.bannerUrl) })`,
		};
	} else {
		return {
			backgroundImage: `url(${ props.user.bannerUrl })`,
		};
	}
});

const age = computed(() => {
	return calcAge(props.user.birthday);
});

function menu(ev: MouseEvent) {
	const { menu, cleanup } = getUserMenu(user.value, router);
	os.popupMenu(menu, ev.currentTarget ?? ev.target).finally(cleanup);
}

function parallaxLoop() {
	parallaxAnimationId.value = window.requestAnimationFrame(parallaxLoop);
	parallax();
}

function parallax() {
	const banner = bannerEl.value;
	if (banner == null) return;

	const top = getScrollPosition(rootEl.value);

	if (top < 0) return;

	const z = 1.75; // 奥行き(小さいほど奥)
	const pos = -(top / z);
	banner.style.backgroundPosition = `center calc(50% - ${pos}px)`;
}

function showMemoTextarea() {
	isEditingMemo.value = true;
	nextTick(() => {
		memoTextareaEl.value?.focus();
	});
}

function adjustMemoTextarea() {
	if (!memoTextareaEl.value) return;
	memoTextareaEl.value.style.height = '0px';
	memoTextareaEl.value.style.height = `${memoTextareaEl.value.scrollHeight}px`;
}

async function updateMemo() {
	await misskeyApi('users/update-memo', {
		memo: memoDraft.value,
		userId: props.user.id,
	});
	isEditingMemo.value = false;
}

const isForeignLanguage: boolean = props.user.description != null && (() => {
	const targetLang = (miLocalStorage.getItem('lang') ?? navigator.language).slice(0, 2);
	const postLang = detectLanguage(props.user.description);
	return postLang !== '' && postLang !== targetLang;
})();

async function translate(): Promise<void> {
	if (translation.value != null) return;
	globalEvents.emit('showNoteContent', true);
	translating.value = true;

	vibrate(defaultStore.state.vibrateSystem ? 5 : []);

	const res = await misskeyApi('users/translate', {
		userId: props.user.id,
		targetLang: miLocalStorage.getItem('lang') ?? navigator.language,
	});
	translating.value = false;
	translation.value = res;

	vibrate(defaultStore.state.vibrateSystem ? [5, 5, 10] : []);
}

function resetTimer() {
	playAnimation.value = true;
	clearTimeout(playAnimationTimer);
	playAnimationTimer = setTimeout(() => playAnimation.value = false, 5000);
}

async function toggleNotify() {
	os.apiWithDialog('following/update', {
		userId: props.user.id,
		notify: props.user.notify === 'normal' ? 'none' : 'normal',
	}).then(() => {
		user.value.notify = user.value.notify === 'normal' ? 'none' : 'normal';
	});
}

watch([props.user], () => {
	memoDraft.value = props.user.memo;
});

onMounted(() => {
	window.requestAnimationFrame(parallaxLoop);
	narrow.value = rootEl.value!.clientWidth < 1000;

	if (props.user.birthday) {
		const m = new Date().getMonth() + 1;
		const d = new Date().getDate();
		const bm = parseInt(props.user.birthday.split('-')[1]);
		const bd = parseInt(props.user.birthday.split('-')[2]);
		if (m === bm && d === bd) {
			confetti({
				duration: 1000 * 4,
			});
		}
	}
	nextTick(() => {
		adjustMemoTextarea();
	});

	if (defaultStore.state.showingAnimatedImages === 'inactive') {
		window.addEventListener('mousemove', resetTimer);
		window.addEventListener('touchstart', resetTimer);
		window.addEventListener('touchend', resetTimer);
	}
});

onUnmounted(() => {
	if (parallaxAnimationId.value) {
		window.cancelAnimationFrame(parallaxAnimationId.value);
	}

	if (defaultStore.state.showingAnimatedImages === 'inactive') {
		window.removeEventListener('mousemove', resetTimer);
		window.removeEventListener('touchstart', resetTimer);
		window.removeEventListener('touchend', resetTimer);
	}
});
</script>

<style lang="scss" scoped>
.ftskorzw {
	> .main {
		> .punished {
			font-size: 0.8em;
			padding: 16px;
		}

		> .profile {
			> .main {
				position: relative;
				overflow: clip;

				> .banner-container {
					position: relative;
					height: 250px;
					overflow: clip;
					background-size: cover;
					background-position: center;

					> .banner {
						height: 100%;
						background-color: #4c5e6d;
						background-size: cover;
						background-position: center;
						box-shadow: 0 0 128px rgba(0, 0, 0, 0.5) inset;
						will-change: background-position;
					}

					> .fade {
						position: absolute;
						bottom: 0;
						left: 0;
						width: 100%;
						height: 78px;
						background: linear-gradient(transparent, rgba(#000, 0.7));
					}

					> .followed {
						position: absolute;
						top: 12px;
						left: 12px;
						padding: 4px 8px;
						color: #fff;
						background: rgba(0, 0, 0, 0.7);
						font-size: 0.7em;
						border-radius: 6px;
					}

					> .actions {
						position: absolute;
						top: 12px;
						right: 12px;
						-webkit-backdrop-filter: var(--MI-blur, blur(8px));
						backdrop-filter: var(--MI-blur, blur(8px));
						background: rgba(0, 0, 0, 0.2);
						padding: 8px;
						border-radius: 24px;

						> .menu {
							vertical-align: bottom;
							height: 31px;
							width: 31px;
							color: #fff;
							text-shadow: 0 0 8px #000;
							font-size: 16px;
						}

						> .koudoku {
							margin-left: 4px;
							vertical-align: bottom;
						}
					}

					> .title {
						position: absolute;
						bottom: 0;
						left: 0;
						width: 100%;
						padding: 0 0 8px 154px;
						box-sizing: border-box;
						color: #fff;

						> .name {
							display: flex;
							gap: 8px;
							margin: -10px;
							padding: 10px;
							line-height: 32px;
							font-weight: bold;
							font-size: 1.8em;
							filter: drop-shadow(0 0 4px #000);
						}

						> .bottom {
							> * {
								display: inline-block;
								margin-right: 16px;
								line-height: 20px;
								opacity: 0.8;

								&.username {
									font-weight: bold;
								}
							}

							> .add-note-button {
								background: rgba(0, 0, 0, 0.2);
								color: #fff;
								-webkit-backdrop-filter: var(--MI-blur, blur(8px));
								backdrop-filter: var(--MI-blur, blur(8px));
								border-radius: 24px;
								padding: 4px 8px;
								font-size: 80%;
							}
						}
					}
				}

				> .title {
					display: none;
					text-align: center;
					padding: 50px 8px 16px 8px;
					font-weight: bold;
					border-bottom: solid 0.5px var(--MI_THEME-divider);

					> .bottom {
						> * {
							display: inline-block;
							margin-right: 8px;
							opacity: 0.8;
						}
					}
				}

				> .avatar {
					display: block;
					position: absolute;
					top: 170px;
					left: 16px;
					z-index: 2;
					width: 120px;
					height: 120px;
					box-shadow: 1px 1px 3px rgba(#000, 0.2);
				}

				> .followedMessage {
					padding: 24px 24px 0 154px;

					> .fukidashi {
						display: block;
						--fukidashi-bg: color-mix(in srgb, var(--MI_THEME-accent), var(--MI_THEME-panel) 85%);
						--fukidashi-radius: 16px;
						font-size: 0.9em;

						.messageHeader {
							opacity: 0.7;
							font-size: 0.85em;
						}
					}
				}

				> .roles {
					padding: 24px 24px 0 154px;
					font-size: 0.95em;
					display: flex;
					flex-wrap: wrap;
					gap: 8px;

					> .role {
						border: solid 1px var(--color, var(--MI_THEME-divider));
						border-radius: 999px;
						margin-right: 4px;
						padding: 3px 8px;
					}
				}

				> .moderationNote {
					margin: 12px 24px 0 154px;
				}

				> .memo {
					margin: 12px 24px 0 154px;
					background: transparent;
					color: var(--MI_THEME-fg);
					border: 1px solid var(--MI_THEME-divider);
					border-radius: 8px;
					padding: 8px;
					line-height: 0;

					> .heading {
						text-align: left;
						color: var(--MI_THEME-fgTransparent);
						line-height: 1.5;
						font-size: 85%;
					}

					textarea {
						margin: 0;
						padding: 0;
						resize: none;
						border: none;
						outline: none;
						width: 100%;
						height: auto;
						min-height: 0;
						line-height: 1.5;
						color: var(--MI_THEME-fg);
						overflow: hidden;
						background: transparent;
						font-family: inherit;
					}
				}

				> .description {
					padding: 24px 24px 24px 154px;
					font-size: 0.95em;

					div {
						> .empty {
							margin: 0;
							opacity: 0.5;
						}

						> .translateButton {
							margin-top: 10px;
						}

						> .translation {
							border: solid 0.5px var(--MI_THEME-divider);
							border-radius: var(--MI-radius);
							padding: 12px;
							margin-top: 8px;
						}
					}
				}

				> .fields {
					padding: 24px;
					font-size: 0.9em;
					border-top: solid 0.5px var(--MI_THEME-divider);

					> .field {
						display: flex;
						padding: 0;
						margin: 0;
						align-items: center;

						&:not(:last-child) {
							margin-bottom: 8px;
						}

						> .name {
							width: 30%;
							overflow: hidden;
							white-space: nowrap;
							text-overflow: ellipsis;
							font-weight: bold;
							text-align: center;
						}

						> .value {
							width: 70%;
							overflow: hidden;
							white-space: nowrap;
							text-overflow: ellipsis;
							margin: 0;
						}
					}

					&.system > .field > .name {
					}
				}

				> .status {
					display: flex;
					padding: 24px;
					border-top: solid 0.5px var(--MI_THEME-divider);

					> a {
						flex: 1;
						text-align: center;

						&.active {
							color: var(--MI_THEME-accent);
						}

						&:hover {
							text-decoration: none;
						}

						> b {
							display: block;
							line-height: 16px;
						}

						> span {
							font-size: 70%;
						}
					}

					>div {
						flex: 1;
						text-align: center;

						> i {
							display: block;
							line-height: 16px;
							margin: 0 auto;
						}

						> span {
							font-size: 70%;
						}
					}
				}
			}
		}

		> .contents {
			> .content {
				margin-bottom: var(--MI-margin);
			}
		}
	}

	&.wide {
		display: flex;
		width: 100%;

		> .main {
			width: 100%;
			min-width: 0;
		}

		> .sub {
			max-width: 350px;
			min-width: 350px;
			margin-left: var(--MI-margin);
		}
	}
}

@container (max-width: 500px) {
	.ftskorzw {
		> .main {
			> .profile > .main {
				> .banner-container {
					height: 140px;

					> .fade {
						display: none;
					}

					> .title {
						display: none;
					}
				}

				> .title {
					display: block;
				}

				> .avatar {
					top: 90px;
					left: 0;
					right: 0;
					width: 92px;
					height: 92px;
					margin: auto;
				}

				> .followedMessage {
					padding: 16px 16px 0 16px;
				}

				> .roles {
					padding: 16px 16px 0 16px;
					justify-content: center;
				}

				> .moderationNote {
					margin: 16px 16px 0 16px;

					div {
						> .moderationNoteButton {
							margin: 0 auto;
						}
					}
				}

				> .memo {
					margin: 16px 16px 0 16px;
				}

				> .description {
					padding: 16px;
					text-align: center;

					div {
						> .translateButton {
							margin: 10px auto 0;
						}
					}
				}

				> .fields {
					padding: 16px;
				}

				> .status {
					padding: 16px;
				}
			}

			> .contents {
				> .nav {
					font-size: 80%;
				}
			}
		}
	}
}
</style>

<style lang="scss" module>
.tl {
	background: var(--MI_THEME-bg);
	border-radius: var(--MI-radius);
	overflow: clip;
}

.verifiedLink {
	margin-left: 4px;
	color: var(--MI_THEME-success);
}
</style>
