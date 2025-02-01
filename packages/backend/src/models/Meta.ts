/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { id } from './util/id.js';
import { MiUser } from './User.js';

@Entity('meta')
export class MiMeta {
	@PrimaryColumn({
		type: 'varchar',
		length: 32,
	})
	public id: string;

	@Column('varchar', {
		length: 1024, nullable: true,
	})
	public name: string | null;

	@Column('varchar', {
		length: 64, nullable: true,
	})
	public shortName: string | null;

	@Column('varchar', {
		length: 1024, nullable: true,
	})
	public description: string | null;

	/**
	 * メンテナの名前
	 */
	@Column('varchar', {
		length: 1024, nullable: true,
	})
	public maintainerName: string | null;

	/**
	 * メンテナの連絡先
	 */
	@Column('varchar', {
		length: 1024, nullable: true,
	})
	public maintainerEmail: string | null;

	@Column('boolean', {
		default: false,
	})
	public disableRegistration: boolean;

	@Column('varchar', {
		length: 1024, array: true, default: '{}',
	})
	public langs: string[];

	@Column('varchar', {
		length: 1024, array: true, default: '{}',
	})
	public pinnedUsers: string[];

	@Column('varchar', {
		length: 1024, array: true, default: '{}',
	})
	public hiddenTags: string[];

	@Column('varchar', {
		length: 1024, array: true, default: '{}',
	})
	public blockedHosts: string[];

	@Column('varchar', {
		length: 1024, array: true, default: '{}',
	})
	public sensitiveWords: string[];

	@Column('varchar', {
		length: 1024, array: true, default: '{}',
	})
	public prohibitedWords: string[];

	@Column('varchar', {
		length: 1024, array: true, default: '{}',
	})
	public prohibitedWordsForNameOfUser: string[];

	@Column('varchar', {
		length: 1024, array: true, default: '{}',
	})
	public silencedHosts: string[];

	@Column('varchar', {
		length: 1024, array: true, default: '{}',
	})
	public mediaSilencedHosts: string[];

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public themeColor: string | null;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public mascotImageUrl: string | null;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public bannerUrl: string | null;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public backgroundImageUrl: string | null;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public logoImageUrl: string | null;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public iconUrl: string | null;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public app192IconUrl: string | null;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public app512IconUrl: string | null;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public serverErrorImageUrl: string | null;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public notFoundImageUrl: string | null;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public infoImageUrl: string | null;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public youBlockedImageUrl: string | null;

	@Column('boolean', {
		default: false,
	})
	public cacheRemoteFiles: boolean;

	@Column('boolean', {
		default: true,
	})
	public cacheRemoteSensitiveFiles: boolean;

	@Column({
		...id(),
		nullable: true,
	})
	public proxyAccountId: MiUser['id'] | null;

	@ManyToOne(type => MiUser, {
		onDelete: 'SET NULL',
	})
	@JoinColumn()
	public proxyAccount: MiUser | null;

	@Column('boolean', {
		default: false,
	})
	public emailRequiredForSignup: boolean;

	@Column('boolean', {
		default: false,
	})
	public enableHcaptcha: boolean;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public hcaptchaSiteKey: string | null;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public hcaptchaSecretKey: string | null;

	@Column('boolean', {
		default: false,
	})
	public enableMcaptcha: boolean;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public mcaptchaSitekey: string | null;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public mcaptchaSecretKey: string | null;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public mcaptchaInstanceUrl: string | null;

	@Column('boolean', {
		default: false,
	})
	public enableRecaptcha: boolean;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public recaptchaSiteKey: string | null;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public recaptchaSecretKey: string | null;

	@Column('boolean', {
		default: false,
	})
	public enableTurnstile: boolean;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public turnstileSiteKey: string | null;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public turnstileSecretKey: string | null;

	@Column('boolean', {
		default: false,
	})
	public enableTestcaptcha: boolean;

	// chaptcha系を追加した際にはnodeinfoのレスポンスに追加するのを忘れないようにすること

	@Column('enum', {
		enum: ['none', 'all', 'local', 'remote'],
		default: 'none',
	})
	public sensitiveMediaDetection: 'none' | 'all' | 'local' | 'remote';

	@Column('enum', {
		enum: ['medium', 'low', 'high', 'veryLow', 'veryHigh'],
		default: 'medium',
	})
	public sensitiveMediaDetectionSensitivity: 'medium' | 'low' | 'high' | 'veryLow' | 'veryHigh';

	@Column('boolean', {
		default: false,
	})
	public setSensitiveFlagAutomatically: boolean;

	@Column('boolean', {
		default: false,
	})
	public enableSensitiveMediaDetectionForVideos: boolean;

	@Column('boolean', {
		default: false,
	})
	public enableEmail: boolean;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public email: string | null;

	@Column('boolean', {
		default: false,
	})
	public smtpSecure: boolean;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public smtpHost: string | null;

	@Column('integer', {
		nullable: true,
	})
	public smtpPort: number | null;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public smtpUser: string | null;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public smtpPass: string | null;

	@Column('boolean', {
		default: false,
	})
	public enableServiceWorker: boolean;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public swPublicKey: string | null;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public swPrivateKey: string | null;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public translatorType: string | null;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public deeplAuthKey: string | null;

	@Column('boolean', {
		default: false,
	})
	public deeplIsPro: boolean;

	@Column('varchar', {
		length: 5120,
		nullable: true,
	})
	public ctav3SaKey: string | null;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public ctav3ProjectId: string | null;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public ctav3Location: string | null;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public ctav3Model: string | null;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public ctav3Glossary: string | null;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public libreTranslateEndPoint: string | null;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public libreTranslateApiKey: string | null;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public termsOfServiceUrl: string | null;

	@Column('varchar', {
		length: 1024,
		default: 'https://github.com/kokonect-link/cherrypick',
		nullable: true,
	})
	public repositoryUrl: string | null;

	@Column('varchar', {
		length: 1024,
		default: 'https://github.com/kokonect-link/cherrypick/issues/new',
		nullable: true,
	})
	public feedbackUrl: string | null;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public impressumUrl: string | null;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public privacyPolicyUrl: string | null;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public inquiryUrl: string | null;

	@Column('varchar', {
		length: 8192,
		nullable: true,
	})
	public defaultLightTheme: string | null;

	@Column('varchar', {
		length: 8192,
		nullable: true,
	})
	public defaultDarkTheme: string | null;

	@Column('boolean', {
		default: false,
	})
	public useObjectStorage: boolean;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public objectStorageBucket: string | null;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public objectStoragePrefix: string | null;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public objectStorageBaseUrl: string | null;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public objectStorageEndpoint: string | null;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public objectStorageRegion: string | null;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public objectStorageAccessKey: string | null;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public objectStorageSecretKey: string | null;

	@Column('integer', {
		nullable: true,
	})
	public objectStoragePort: number | null;

	@Column('boolean', {
		default: true,
	})
	public objectStorageUseSSL: boolean;

	@Column('boolean', {
		default: true,
	})
	public objectStorageUseProxy: boolean;

	@Column('boolean', {
		default: false,
	})
	public objectStorageSetPublicRead: boolean;

	@Column('boolean', {
		default: true,
	})
	public objectStorageS3ForcePathStyle: boolean;

	@Column('boolean', {
		default: false,
	})
	public useRemoteObjectStorage: boolean;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public remoteObjectStorageBucket: string | null;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public remoteObjectStoragePrefix: string | null;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public remoteObjectStorageBaseUrl: string | null;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public remoteObjectStorageEndpoint: string | null;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public remoteObjectStorageRegion: string | null;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public remoteObjectStorageAccessKey: string | null;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public remoteObjectStorageSecretKey: string | null;

	@Column('integer', {
		nullable: true,
	})
	public remoteObjectStoragePort: number | null;

	@Column('boolean', {
		default: true,
	})
	public remoteObjectStorageUseSSL: boolean;

	@Column('boolean', {
		default: true,
	})
	public remoteObjectStorageUseProxy: boolean;

	@Column('boolean', {
		default: false,
	})
	public remoteObjectStorageSetPublicRead: boolean;

	@Column('boolean', {
		default: true,
	})
	public remoteObjectStorageS3ForcePathStyle: boolean;

	@Column('boolean', {
		default: false,
	})
	public enableIpLogging: boolean;

	@Column('boolean', {
		default: true,
	})
	public enableActiveEmailValidation: boolean;

	@Column('boolean', {
		default: false,
	})
	public enableVerifymailApi: boolean;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public verifymailAuthKey: string | null;

	@Column('boolean', {
		default: false,
	})
	public enableTruemailApi: boolean;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public truemailInstance: string | null;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public truemailAuthKey: string | null;

	@Column('boolean', {
		default: true,
	})
	public enableChartsForRemoteUser: boolean;

	@Column('boolean', {
		default: true,
	})
	public enableChartsForFederatedInstances: boolean;

	@Column('boolean', {
		default: true,
	})
	public enableStatsForFederatedInstances: boolean;

	@Column('boolean', {
		default: false,
	})
	public enableServerMachineStats: boolean;

	@Column('boolean', {
		default: true,
	})
	public enableIdenticonGeneration: boolean;

	@Column('jsonb', {
		default: { },
	})
	public policies: Record<string, any>;

	@Column('varchar', {
		length: 280,
		array: true,
		default: '{}',
	})
	public serverRules: string[];

	@Column('varchar', {
		length: 8192,
		default: '{}',
	})
	public manifestJsonOverride: string;

	@Column('varchar', {
		length: 1024,
		array: true,
		default: '{}',
	})
	public bannedEmailDomains: string[];

	@Column('varchar', {
		length: 1024, array: true, default: '{ "admin", "administrator", "root", "system", "maintainer", "host", "mod", "moderator", "owner", "superuser", "staff", "auth", "i", "me", "everyone", "all", "mention", "mentions", "example", "user", "users", "account", "accounts", "official", "help", "helps", "support", "supports", "info", "information", "informations", "announce", "announces", "announcement", "announcements", "notice", "notification", "notifications", "dev", "developer", "developers", "tech", "misskey", "cherrypick" }',
	})
	public preservedUsernames: string[];

	@Column('boolean', {
		default: true,
	})
	public enableFanoutTimeline: boolean;

	@Column('boolean', {
		default: true,
	})
	public enableFanoutTimelineDbFallback: boolean;

	@Column('integer', {
		default: 300,
	})
	public perLocalUserUserTimelineCacheMax: number;

	@Column('integer', {
		default: 100,
	})
	public perRemoteUserUserTimelineCacheMax: number;

	@Column('integer', {
		default: 300,
	})
	public perUserHomeTimelineCacheMax: number;

	@Column('integer', {
		default: 300,
	})
	public perUserListTimelineCacheMax: number;

	@Column('boolean', {
		default: false,
	})
	public enableReactionsBuffering: boolean;

	@Column('integer', {
		default: 0,
	})
	public notesPerOneAd: number;

	@Column('boolean', {
		default: true,
	})
	public urlPreviewEnabled: boolean;

	@Column('integer', {
		default: 10000,
	})
	public urlPreviewTimeout: number;

	@Column('bigint', {
		default: 1024 * 1024 * 10,
	})
	public urlPreviewMaximumContentLength: number;

	@Column('boolean', {
		default: true,
	})
	public urlPreviewRequireContentLength: boolean;

	@Column('varchar', {
		length: 3072,
		array: true,
		default: '{}',
		comment: 'An array of URL strings or regex that can be used to omit warnings about redirects to external sites. Separate them with spaces to specify AND, and enclose them with slashes to specify regular expressions. Each item is regarded as an OR.',
	})
	public trustedLinkUrlPatterns: string[];

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public urlPreviewSummaryProxyUrl: string | null;

	@Column('varchar', {
		length: 1024,
		nullable: true,
	})
	public urlPreviewUserAgent: string | null;

	@Column('varchar', {
		length: 128,
		default: 'all',
	})
	public federation: 'all' | 'specified' | 'none';

	@Column('varchar', {
		length: 1024,
		array: true,
		default: '{}',
	})
	public federationHosts: string[];

	@Column('boolean', {
		default: false,
	})
	public doNotSendNotificationEmailsForAbuseReport: boolean;

	@Column('varchar', {
		length: 1024, nullable: true,
	})
	public emailToReceiveAbuseReport: string | null;

	@Column('boolean', {
		default: false,
	})
	public enableReceivePrerelease: boolean;

	@Column('boolean', {
		default: false,
	})
	public skipVersion: boolean;

	@Column('varchar', {
		length: 32,
		nullable: true,
	})
	public skipCherryPickVersion: string | null;

	@Column('varchar', {
		length: 1024,
		array: true,
		default: '{}',
	})
	public customSplashText: string[];

	@Column('boolean', {
		default: true,
	})
	public disableRegistrationWhenInactive: boolean;

	@Column('boolean', {
		default: false,
	})
	public disablePublicNoteWhenInactive: boolean;

	@Column('integer', {
		default: 7,
	})
	public moderatorInactivityLimitDays: number;

	@Column('varchar', {
		length: 256,
		array: true,
		default: '{}',
	})
	public bubbleInstances: string[];
}
