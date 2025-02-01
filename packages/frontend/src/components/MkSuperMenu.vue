<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<div class="rrevdjwu" :class="{ grid }">
	<div v-for="group in def" class="group">
		<div v-if="group.title" class="title">{{ group.title }}</div>

		<div class="items">
			<template v-for="(item, i) in group.items">
				<a v-if="item.type === 'a'" :href="item.href" :target="item.target" class="_button item" :class="{ danger: item.danger, active: item.active }">
					<span>
						<span v-if="item.icon" class="icon"><i :class="item.icon" class="ti-fw"></i></span>
						<span class="text">{{ item.text }}</span>
					</span>
					<span v-if="item.indicated" class="itemIndicator _blink"><i class="_indicatorCircle"></i></span>
				</a>
				<button v-else-if="item.type === 'button'" class="_button item" :class="{ danger: item.danger, active: item.active }" :disabled="item.active" @click="ev => item.action(ev)">
					<span>
						<span v-if="item.icon" class="icon"><i :class="item.icon" class="ti-fw"></i></span>
						<span class="text">{{ item.text }}</span>
					</span>
					<span v-if="item.indicated" class="itemIndicator _blink"><i class="_indicatorCircle"></i></span>
				</button>
				<MkA v-else :to="item.to" class="_button item" :class="{ danger: item.danger, active: item.active }">
					<span>
						<span v-if="item.icon" class="icon"><i :class="item.icon" class="ti-fw"></i></span>
						<span class="text">{{ item.text }}</span>
					</span>
					<span v-if="item.indicated" class="itemIndicator _blink"><i class="_indicatorCircle"></i></span>
				</MkA>
			</template>
		</div>
	</div>
</div>
</template>

<script lang="ts">
export type SuperMenuDef = {
	title?: string;
	items: ({
		type: 'a';
		href: string;
		target?: string;
		icon?: string;
		text: string;
		danger?: boolean;
		active?: boolean;
		indicated?: boolean;
	} | {
		type: 'button';
		icon?: string;
		text: string;
		danger?: boolean;
		active?: boolean;
		action: (ev: MouseEvent) => void;
		indicated?: boolean;
	} | {
		type?: 'link';
		to: string;
		icon?: string;
		text: string;
		danger?: boolean;
		active?: boolean;
		indicated?: boolean;
	})[];
};
</script>

<script lang="ts" setup>
defineProps<{
	def: SuperMenuDef[];
	grid?: boolean;
}>();
</script>

<style lang="scss" scoped>
.rrevdjwu {
	> .group {
		& + .group {
			margin-top: 16px;
			padding-top: 16px;
			border-top: solid 0.5px var(--MI_THEME-divider);
		}

		> .title {
			opacity: 0.7;
			margin: 0 0 8px 0;
			font-size: 0.9em;
		}

		> .items {
			> .item {
				display: flex;
				align-items: center;
				width: 100%;
				box-sizing: border-box;
				padding: 12px 16px 12px 8px;
				border-radius: 15px;
				font-size: 0.9em;
        margin-bottom: 0.3rem;

				&:hover {
					text-decoration: none;
					background: var(--MI_THEME-panelHighlight);
				}

				&:focus-visible {
					outline-offset: -2px;
				}

				&.active {
					color: var(--MI_THEME-accent);
					background: var(--MI_THEME-accentedBg);
				}

				&.danger {
					color: var(--MI_THEME-error);
				}

				> span {
					display: inherit;

					> .icon {
						width: 32px;
						margin-right: 2px;
						flex-shrink: 0;
						text-align: center;
						opacity: 0.8;
					}

					> .text {
						white-space: normal;
						padding-right: 12px;
						flex-shrink: 1;
					}
				}

        > .itemIndicator {
          position: relative;
					top: -10px;
          left: -72.5px;
          color: var(--MI_THEME-navIndicator);
          font-size: 8px;
          animation: blink 1s infinite;
        }
			}
		}
	}

	&.grid {
		> .group {
			margin-left: 0;
			margin-right: 0;

			& + .group {
				padding-top: 0;
				border-top: none;
			}

			> .title {
				font-size: 1em;
				opacity: 0.7;
				margin: 0 0 8px 16px;
			}

			> .items {
				display: grid;
				grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
				grid-gap: 16px;
				padding: 0 16px;

				> .item {
					flex-direction: column;
					text-align: center;
					padding: 0;

					&:hover {
						text-decoration: none;
						background: none;
						color: var(--MI_THEME-accent);

						> span {
							> .icon {
								background: var(--MI_THEME-accentedBg);
							}
						}
					}

					> span {
						display: contents;

						> .icon {
							display: grid;
							place-content: center;
							margin-right: 0;
							margin-bottom: 6px;
							font-size: 1.5em;
							width: 60px;
							height: 60px;
							aspect-ratio: 1;
							background: var(--MI_THEME-panel);
							border-radius: 100%;
						}

						> .text {
							padding-right: 0;
							width: 100%;
							font-size: 0.8em;
						}
					}

          > .itemIndicator {
						display: flex;
						top: -80px;
            left: -22.5px;
            font-size: 0.8em;
          }
				}
			}
		}
	}
}
</style>
