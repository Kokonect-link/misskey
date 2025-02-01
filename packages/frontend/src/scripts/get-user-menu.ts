/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { toUnicode } from 'punycode.js';
import { defineAsyncComponent, ref, watch } from 'vue';
import * as Misskey from 'cherrypick-js';
import { host, url } from '@@/js/config.js';
import type { MenuItem } from '@/types/menu.js';
import { i18n } from '@/i18n.js';
import { copyToClipboard } from '@/scripts/copy-to-clipboard.js';
import * as os from '@/os.js';
import { misskeyApi } from '@/scripts/misskey-api.js';
import { defaultStore, userActions } from '@/store.js';
import { $i, iAmAdmin, iAmModerator } from '@/account.js';
import { notesSearchAvailable, canSearchNonLocalNotes } from '@/scripts/check-permissions.js';
import { IRouter } from '@/nirax.js';
import { antennasCache, rolesCache, userListsCache } from '@/cache.js';
import { mainRouter } from '@/router/main.js';
import { genEmbedCode } from '@/scripts/get-embed-code.js';
import { editNickname } from '@/scripts/edit-nickname.js';

export function getUserMenu(user: Misskey.entities.UserDetailed, router: IRouter = mainRouter) {
	const meId = $i ? $i.id : null;

	const cleanups = [] as (() => void)[];

	async function inviteGroup() {
		const groups = await misskeyApi('users/groups/owned');
		if (groups.length === 0) {
			os.alert({
				type: 'error',
				text: i18n.ts.youHaveNoGroups,
			});
			return;
		}
		const { canceled, result: groupId } = await os.select({
			title: i18n.ts.group,
			items: groups.map(group => ({
				value: group.id, text: group.name,
			})),
		});
		if (canceled) return;
		os.apiWithDialog('users/groups/invite', {
			groupId: groupId,
			userId: user.id,
		});
	}

	const meta = ref<Misskey.entities.AdminMetaResponse | null>(null);
	const instance = ref<Misskey.entities.FederationInstance | null>(null);

	const isAdminInstanceBlocked = ref(false);
	const isAdminInstanceSilenced = ref(false);
	const isAdminInstanceMediaSilenced = ref(false);

	const isInstanceMuted = ref(false);

	async function fetch(): Promise<void> {
		if (iAmAdmin) {
			meta.value = await misskeyApi('admin/meta');
		}
		instance.value = await misskeyApi('federation/show-instance', {
			host: user.host ?? host,
		});
		isAdminInstanceBlocked.value = instance.value?.isBlocked ?? false;
		isAdminInstanceSilenced.value = instance.value?.isSilenced ?? false;
		isAdminInstanceMediaSilenced.value = instance.value?.isMediaSilenced ?? false;

		isInstanceMuted.value = $i?.mutedInstances?.some((mutedInstance: string) => mutedInstance === instance.value?.host) ?? false;
	}

	fetch();

	async function toggleAdminInstanceBlock(): Promise<void> {
		if (!iAmAdmin) return;
		if (!meta.value) throw new Error('No meta?');
		if (!instance.value) throw new Error('No instance?');
		// eslint-disable-next-line no-shadow
		const { host } = instance.value;
		await misskeyApi('admin/update-meta', {
			blockedHosts: isAdminInstanceBlocked.value ? meta.value.blockedHosts.concat([host]) : meta.value.blockedHosts.filter(x => x !== host),
		});
	}

	async function toggleAdminInstanceSilenced(): Promise<void> {
		if (!iAmAdmin) return;
		if (!meta.value) throw new Error('No meta?');
		if (!instance.value) throw new Error('No instance?');
		// eslint-disable-next-line no-shadow
		const { host } = instance.value;
		const silencedHosts = meta.value.silencedHosts ?? [];
		await misskeyApi('admin/update-meta', {
			silencedHosts: isAdminInstanceSilenced.value ? silencedHosts.concat([host]) : silencedHosts.filter(x => x !== host),
		});
	}

	async function toggleAdminInstanceMediaSilenced(): Promise<void> {
		if (!iAmAdmin) return;
		if (!meta.value) throw new Error('No meta?');
		if (!instance.value) throw new Error('No instance?');
		// eslint-disable-next-line no-shadow
		const { host } = instance.value;
		const mediaSilencedHosts = meta.value.mediaSilencedHosts ?? [];
		await misskeyApi('admin/update-meta', {
			mediaSilencedHosts: isAdminInstanceMediaSilenced.value ? mediaSilencedHosts.concat([host]) : mediaSilencedHosts.filter(x => x !== host),
		});
	}

	async function toggleInstanceMute(): Promise<void> {
		if (!instance.value) throw new Error('No instance?');
		// eslint-disable-next-line no-shadow
		const { host } = instance.value;
		const mutedInstances = $i?.mutedInstances ?? [];
		await misskeyApi('i/update', {
			mutedInstances: isInstanceMuted.value
				? [...new Set(mutedInstances.concat([host]))]
				: mutedInstances.filter(x => x !== host),
		});
	}

	async function toggleMute() {
		if (user.isMuted) {
			os.apiWithDialog('mute/delete', {
				userId: user.id,
			}).then(() => {
				user.isMuted = false;
			});
		} else {
			const { canceled, result: period } = await os.select({
				title: i18n.ts.mutePeriod,
				items: [{
					value: 'indefinitely', text: i18n.ts.indefinitely,
				}, {
					value: 'tenMinutes', text: i18n.ts.tenMinutes,
				}, {
					value: 'oneHour', text: i18n.ts.oneHour,
				}, {
					value: 'oneDay', text: i18n.ts.oneDay,
				}, {
					value: 'oneWeek', text: i18n.ts.oneWeek,
				}],
				default: 'indefinitely',
			});
			if (canceled) return;

			const expiresAt = period === 'indefinitely' ? null
				: period === 'tenMinutes' ? Date.now() + (1000 * 60 * 10)
				: period === 'oneHour' ? Date.now() + (1000 * 60 * 60)
				: period === 'oneDay' ? Date.now() + (1000 * 60 * 60 * 24)
				: period === 'oneWeek' ? Date.now() + (1000 * 60 * 60 * 24 * 7)
				: null;

			os.apiWithDialog('mute/create', {
				userId: user.id,
				expiresAt,
			}).then(() => {
				user.isMuted = true;
			});
		}
	}

	async function toggleRenoteMute() {
		os.apiWithDialog(user.isRenoteMuted ? 'renote-mute/delete' : 'renote-mute/create', {
			userId: user.id,
		}).then(() => {
			user.isRenoteMuted = !user.isRenoteMuted;
		});
	}

	async function toggleBlock() {
		if (!await getConfirmed(user.isBlocking ? i18n.ts.unblockConfirm : i18n.ts.blockConfirm)) return;

		os.apiWithDialog(user.isBlocking ? 'blocking/delete' : 'blocking/create', {
			userId: user.id,
		}).then(() => {
			user.isBlocking = !user.isBlocking;
		});
	}

	async function toggleNotify() {
		os.apiWithDialog('following/update', {
			userId: user.id,
			notify: user.notify === 'normal' ? 'none' : 'normal',
		}).then(() => {
			user.notify = user.notify === 'normal' ? 'none' : 'normal';
		});
	}

	function reportAbuse() {
		const { dispose } = os.popup(defineAsyncComponent(() => import('@/components/MkAbuseReportWindow.vue')), {
			user: user,
		}, {
			closed: () => dispose(),
		});
	}

	async function getConfirmed(text: string): Promise<boolean> {
		const confirm = await os.confirm({
			type: 'warning',
			title: 'confirm',
			text,
		});

		return !confirm.canceled;
	}

	async function userInfoUpdate() {
		os.apiWithDialog('federation/update-remote-user', {
			userId: user.id,
		});
	}

	async function invalidateFollow() {
		if (!await getConfirmed(i18n.ts.breakFollowConfirm)) return;

		os.apiWithDialog('following/invalidate', {
			userId: user.id,
		}).then(() => {
			user.isFollowed = !user.isFollowed;
		});
	}

	async function editMemo(): Promise<void> {
		const userDetailed = await misskeyApi('users/show', {
			userId: user.id,
		});
		const { canceled, result } = await os.form(i18n.ts.editMemo, {
			memo: {
				type: 'string',
				required: true,
				multiline: true,
				label: i18n.ts.memo,
				default: userDetailed.memo,
			},
		});
		if (canceled) return;

		os.apiWithDialog('users/update-memo', {
			memo: result.memo,
			userId: user.id,
		});
	}

	watch(isAdminInstanceBlocked, () => {
		toggleAdminInstanceBlock();
	});

	watch(isAdminInstanceSilenced, () => {
		toggleAdminInstanceSilenced();
	});

	watch(isAdminInstanceMediaSilenced, () => {
		toggleAdminInstanceMediaSilenced();
	});

	watch(isInstanceMuted, () => {
		toggleInstanceMute();
	});

	const menuItems: MenuItem[] = [];

	menuItems.push({
		icon: 'ti ti-at',
		text: i18n.ts.copyUsername,
		action: () => {
			copyToClipboard(`@${user.username}@${user.host ?? host}`);
			os.toast(i18n.ts.copied, 'copied');
		},
	});

	if (notesSearchAvailable && (user.host == null || canSearchNonLocalNotes)) {
		menuItems.push({
			icon: 'ti ti-search',
			text: i18n.ts.searchThisUsersNotes,
			action: () => {
				router.push(`/search?username=${encodeURIComponent(user.username)}${user.host != null ? '&host=' + encodeURIComponent(user.host) : ''}`);
			},
		});
	}

	if (iAmModerator) {
		menuItems.push({
			icon: 'ti ti-user-exclamation',
			text: i18n.ts.moderation,
			action: () => {
				router.push(`/admin/user/${user.id}`);
			},
		});
	}

	menuItems.push({
		icon: 'ti ti-rss',
		text: i18n.ts.copyRSS,
		action: () => {
			copyToClipboard(`${user.host ?? host}/@${user.username}.atom`);
			os.toast(i18n.ts.copied, 'copied');
		},
	});

	if (user.host != null && user.url != null) {
		menuItems.push({
			icon: 'ti ti-external-link',
			text: i18n.ts.showOnRemote,
			action: () => {
				if (user.url == null) return;
				window.open(user.url, '_blank', 'noopener');
			},
		});
	} else {
		menuItems.push({
			icon: 'ti ti-code',
			text: i18n.ts.genEmbedCode,
			type: 'parent',
			children: [{
				text: i18n.ts.noteOfThisUser,
				action: () => {
					genEmbedCode('user-timeline', user.id);
				},
			}], // TODO: ユーザーカードの埋め込みなど
		});
	}

	menuItems.push({
		icon: 'ti ti-share',
		text: i18n.ts.copyProfileUrl,
		action: () => {
			const canonical = user.host === null ? `@${user.username}` : `@${user.username}@${toUnicode(user.host)}`;
			copyToClipboard(`${url}/${canonical}`);
			os.toast(i18n.ts.copiedLink, 'copied');
		},
	}, {
		icon: 'ti ti-qrcode',
		text: i18n.ts.getQRCode,
		action: () => {
			os.displayQRCode(`https://${user.host ?? host}/@${user.username}`);
		},
	});

	if ($i) {
		menuItems.push({
			icon: 'ti ti-mail',
			text: i18n.ts.sendMessage,
			action: () => {
				const canonical = user.host === null ? `@${user.username}` : `@${user.username}@${user.host}`;
				os.post({ specified: user, initialText: `${canonical} ` });
			},
		});

		if (meId !== user.id) {
			menuItems.push({
				type: 'link',
				icon: 'ti ti-messages',
				text: i18n.ts.startMessaging,
				to: `/my/messaging/@${user.host === null ? user.username : user.username + '@' + user.host}`,
			});

			if (user.host === null) {
				menuItems.push({
					icon: 'ti ti-users',
					text: i18n.ts.inviteToGroup,
					action: inviteGroup,
				});
			}
		}

		if (defaultStore.state.nicknameEnabled) {
			menuItems.push({ type: 'divider' }, {
				icon: 'ti ti-edit',
				text: i18n.ts.editNickName,
				action: () => {
					editNickname(user);
				},
			});
		}

		menuItems.push({
			icon: 'ti ti-pencil',
			text: i18n.ts.editMemo,
			action: editMemo,
		});

		menuItems.push({
			type: 'parent',
			icon: 'ti ti-list',
			text: i18n.ts.addToList,
			children: async () => {
				const lists = await userListsCache.fetch();
				return lists.map(list => {
					const isListed = ref(list.userIds?.includes(user.id) ?? false);
					cleanups.push(watch(isListed, () => {
						if (isListed.value) {
							os.apiWithDialog('users/lists/push', {
								listId: list.id,
								userId: user.id,
							}).then(() => {
								list.userIds?.push(user.id);
							});
						} else {
							os.apiWithDialog('users/lists/pull', {
								listId: list.id,
								userId: user.id,
							}).then(() => {
								list.userIds?.splice(list.userIds?.indexOf(user.id), 1);
							});
						}
					}));

					return {
						type: 'switch',
						text: list.name,
						ref: isListed,
					};
				});
			},
		});

		menuItems.push({
			type: 'parent',
			icon: 'ti ti-antenna',
			text: i18n.ts.addToAntenna,
			children: async () => {
				const antennas = await antennasCache.fetch();
				const canonical = user.host === null ? `@${user.username}` : `@${user.username}@${toUnicode(user.host)}`;
				return antennas.filter((a) => a.src === 'users').map(antenna => ({
					text: antenna.name,
					action: async () => {
						await os.apiWithDialog('antennas/update', {
							antennaId: antenna.id,
							name: antenna.name,
							keywords: antenna.keywords,
							excludeKeywords: antenna.excludeKeywords,
							src: antenna.src,
							userListId: antenna.userListId,
							users: [...antenna.users, canonical],
							caseSensitive: antenna.caseSensitive,
							withReplies: antenna.withReplies,
							withFile: antenna.withFile,
							notify: antenna.notify,
						});
						antennasCache.delete();
					},
				}));
			},
		});
	}

	if ($i && meId !== user.id) {
		if (iAmModerator) {
			menuItems.push({
				type: 'parent',
				icon: 'ti ti-badges',
				text: i18n.ts.roles,
				children: async () => {
					const roles = await rolesCache.fetch();

					return roles.filter(r => r.target === 'manual').map(r => ({
						text: r.name,
						action: async () => {
							const { canceled, result: period } = await os.select({
								title: i18n.ts.period + ': ' + r.name,
								items: [{
									value: 'indefinitely', text: i18n.ts.indefinitely,
								}, {
									value: 'oneHour', text: i18n.ts.oneHour,
								}, {
									value: 'oneDay', text: i18n.ts.oneDay,
								}, {
									value: 'oneWeek', text: i18n.ts.oneWeek,
								}, {
									value: 'oneMonth', text: i18n.ts.oneMonth,
								}],
								default: 'indefinitely',
							});
							if (canceled) return;

							const expiresAt = period === 'indefinitely' ? null
								: period === 'oneHour' ? Date.now() + (1000 * 60 * 60)
								: period === 'oneDay' ? Date.now() + (1000 * 60 * 60 * 24)
								: period === 'oneWeek' ? Date.now() + (1000 * 60 * 60 * 24 * 7)
								: period === 'oneMonth' ? Date.now() + (1000 * 60 * 60 * 24 * 30)
								: null;

							os.apiWithDialog('admin/roles/assign', { roleId: r.id, userId: user.id, expiresAt });
						},
					}));
				},
			});
		}

		// フォローしたとしても user.isFollowing はリアルタイム更新されないので不便なため
		//if (user.isFollowing) {
		const withRepliesRef = ref(user.withReplies ?? false);

		menuItems.push({
			type: 'switch',
			icon: 'ti ti-messages',
			text: i18n.ts.showRepliesToOthersInTimeline,
			ref: withRepliesRef,
		}, {
			icon: user.notify === 'none' ? 'ti ti-bell' : 'ti ti-bell-off',
			text: user.notify === 'none' ? i18n.ts.notifyNotes : i18n.ts.unnotifyNotes,
			action: toggleNotify,
		});

		watch(withRepliesRef, (withReplies) => {
			misskeyApi('following/update', {
				userId: user.id,
				withReplies,
			}).then(() => {
				user.withReplies = withReplies;
			});
		});
		//}

		menuItems.push({ type: 'divider' });

		if (iAmAdmin && user.host !== null) {
			menuItems.push({
				type: 'parent',
				icon: 'ti ti-server-cog',
				text: `${i18n.ts.instances} (${i18n.ts.administrator})`,
				children: async () => {
					const federationChildMenu = [] as MenuItem[];

					federationChildMenu.push({
						icon: 'ti ti-server',
						text: i18n.ts.instanceInfo,
						action: () => {
							if (user.host == null) return;
							router.push(`/instance-info/${user.host}`);
						},
					}, {
						type: 'switch',
						text: i18n.ts.blockThisInstance,
						ref: isAdminInstanceBlocked,
						action: toggleAdminInstanceBlock,
					}, {
						type: 'switch',
						text: i18n.ts.silenceThisInstance,
						ref: isAdminInstanceSilenced,
						action: toggleAdminInstanceSilenced,
					}, {
						type: 'switch',
						text: i18n.ts.mediaSilenceThisInstance,
						ref: isAdminInstanceMediaSilenced,
						action: toggleAdminInstanceMediaSilenced,
					});

					return federationChildMenu;
				},
			});
		}

		if (user.host !== null) {
			menuItems.push({
				type: 'parent',
				icon: 'ti ti-server-cog',
				text: i18n.ts.instances,
				children: async () => {
					const federationChildMenu = [] as MenuItem[];

					federationChildMenu.push({
						icon: 'ti ti-server',
						text: i18n.ts.instanceInfo,
						action: () => {
							if (user.host == null) return;
							router.push(`/instance-info/${user.host}`);
						},
					}, {
						type: 'switch',
						text: i18n.ts.instanceMute,
						ref: isInstanceMuted,
						action: toggleInstanceMute,
					});

					return federationChildMenu;
				},
			});
		}

		menuItems.push({
			icon: user.isMuted ? 'ti ti-eye' : 'ti ti-eye-off',
			text: user.isMuted ? i18n.ts.unmute : i18n.ts.mute,
			action: toggleMute,
		}, {
			icon: user.isRenoteMuted ? 'ti ti-repeat' : 'ti ti-repeat-off',
			text: user.isRenoteMuted ? i18n.ts.renoteUnmute : i18n.ts.renoteMute,
			action: toggleRenoteMute,
		}, {
			icon: 'ti ti-ban',
			text: user.isBlocking ? i18n.ts.unblock : i18n.ts.block,
			action: toggleBlock,
		});

		if (user.isFollowed) {
			menuItems.push({
				icon: 'ti ti-link-off',
				text: i18n.ts.breakFollow,
				action: invalidateFollow,
			});
		}

		menuItems.push({ type: 'divider' }, {
			icon: 'ti ti-exclamation-circle',
			text: i18n.ts.reportAbuse,
			action: reportAbuse,
		});
	}

	if (user.host !== null) {
		menuItems.push({ type: 'divider' }, {
			icon: 'ti ti-refresh',
			text: i18n.ts.updateRemoteUser,
			action: userInfoUpdate,
		});
	}

	if (defaultStore.state.devMode) {
		menuItems.push({ type: 'divider' }, {
			icon: 'ti ti-id',
			text: i18n.ts.copyUserId,
			action: () => {
				copyToClipboard(user.id);
				os.toast(i18n.ts.copied, 'copied');
			},
		});
	}

	if ($i && meId === user.id) {
		menuItems.push({ type: 'divider' }, {
			icon: 'ti ti-pencil',
			text: i18n.ts.editProfile,
			action: () => {
				router.push('/settings/profile');
			},
		});
	}

	if (userActions.length > 0) {
		menuItems.push({ type: 'divider' }, ...userActions.map(action => ({
			icon: 'ti ti-plug',
			text: action.title,
			action: () => {
				action.handler(user);
			},
		})));
	}

	return {
		menu: menuItems,
		cleanup: () => {
			if (_DEV_) console.log('user menu cleanup', cleanups);
			for (const cl of cleanups) {
				cl();
			}
		},
	};
}
