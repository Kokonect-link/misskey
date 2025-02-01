<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<div :class="$style.root">
	<template v-if="edit">
		<header :class="$style.editHeader">
			<MkSelect v-model="widgetAdderSelected" style="margin-bottom: var(--MI-margin)" data-cy-widget-select>
				<template #label>{{ i18n.ts.selectWidget }}</template>
				<option v-for="widget in _widgetDefs" :key="widget" :value="widget">{{ i18n.ts._widgets[widget] }}</option>
			</MkSelect>
			<MkButton primary data-cy-widget-add :class="$style.btn" @click="addWidget"><i class="ti ti-plus"></i> {{ i18n.ts.add }}</MkButton>
			<MkButton :class="$style.btn" @click="emit('exit')"><i class="ti ti-check"></i> {{ i18n.ts.close }}</MkButton>
		</header>
		<Sortable
			:modelValue="props.widgets"
			itemKey="id"
			handle=".handle"
			:animation="150"
			:group="{ name: 'SortableMkWidgets' }"
			:class="$style.editEditing"
			@update:modelValue="v => emit('updateWidgets', v)"
		>
			<template #item="{element}">
				<div :class="[$style.widget, $style.customizeContainer]" data-cy-customize-container>
					<header class="handle">
						<span :class="$style.widgetContainerHandle"><i class="ti ti-menu"/></span>
						<div style="position: absolute; top: 0; left: 35px; font-size: 12px; font-weight: bold; line-height: 33px;">
							{{ i18n.ts._widgets[element.name] }}
						</div>
						<button :class="$style.widgetContainerConfig" class="_button" @click.prevent.stop="configWidget(element.id)"><i class="ti ti-settings"></i></button>
						<button :class="$style.widgetContainerRemove" data-cy-customize-container-remove class="_button" @click.prevent.stop="removeWidget(element)"><i class="ti ti-x"></i></button>
					</header>
					<div>
						<component :is="`widget-${element.name}`" :ref="el => widgetRefs[element.id] = el" class="widget" :class="$style.customizeContainerHandleWidget" :widget="element" @updateProps="updateWidget(element.id, $event)"/>
					</div>
				</div>
			</template>
		</Sortable>
	</template>
	<component :is="`widget-${widget.name}`" v-for="widget in _widgets" v-else :key="widget.id" :ref="el => widgetRefs[widget.id] = el" :class="$style.widget" :widget="widget" @updateProps="updateWidget(widget.id, $event)" @contextmenu.stop="onContextmenu(widget, $event)"/>
</div>
</template>

<script lang="ts">
export type Widget = {
	name: string;
	id: string;
	data: Record<string, any>;
};
export type DefaultStoredWidget = {
	place: string | null;
} & Widget;
</script>

<script lang="ts" setup>
import { defineAsyncComponent, ref, computed } from 'vue';
import { v4 as uuid } from 'uuid';
import { isLink } from '@@/js/is-link.js';
import MkSelect from '@/components/MkSelect.vue';
import MkButton from '@/components/MkButton.vue';
import { widgets as widgetDefs, federationWidgets } from '@/widgets/index.js';
import * as os from '@/os.js';
import { i18n } from '@/i18n.js';
import { instance } from '@/instance.js';

const Sortable = defineAsyncComponent(() => import('vuedraggable').then(x => x.default));

const props = defineProps<{
	widgets: Widget[];
	edit: boolean;
}>();

const _widgetDefs = computed(() => {
	if (instance.federation === 'none') {
		return widgetDefs.filter(x => !federationWidgets.includes(x));
	} else {
		return widgetDefs;
	}
});

const _widgets = computed(() => props.widgets.filter(x => _widgetDefs.value.includes(x.name)));

const emit = defineEmits<{
	(ev: 'updateWidgets', widgets: Widget[]): void;
	(ev: 'addWidget', widget: Widget): void;
	(ev: 'removeWidget', widget: Widget): void;
	(ev: 'updateWidget', widget: Partial<Widget>): void;
	(ev: 'exit'): void;
}>();

const widgetRefs = {};
const configWidget = (id: string) => {
	widgetRefs[id].configure();
};
const widgetAdderSelected = ref<string | null>(null);
const addWidget = () => {
	if (widgetAdderSelected.value == null) return;

	emit('addWidget', {
		name: widgetAdderSelected.value,
		id: uuid(),
		data: {},
	});

	widgetAdderSelected.value = null;
};
const removeWidget = (widget) => {
	emit('removeWidget', widget);
};
const updateWidget = (id, data) => {
	emit('updateWidget', { id, data });
};

function onContextmenu(widget: Widget, ev: MouseEvent) {
	const element = ev.target as HTMLElement | null;
	if (element && isLink(element)) return;
	if (element && (['INPUT', 'TEXTAREA', 'IMG', 'VIDEO', 'CANVAS'].includes(element.tagName) || element.attributes['contenteditable'])) return;
	if (window.getSelection()?.toString() !== '') return;

	os.contextMenu([{
		type: 'label',
		text: i18n.ts._widgets[widget.name],
	}, {
		icon: 'ti ti-settings',
		text: i18n.ts.settings,
		action: () => {
			configWidget(widget.id);
		},
	}], ev);
}
</script>

<style lang="scss" module>
.root {
	container-type: inline-size;
}

.btn {
	margin: 10px 0;
	padding: 10px !important;
}

.widget {
	contain: content;
	margin: var(--MI-margin) 0;

	&:first-of-type {
		margin-top: 0;
	}
}

.edit {
	&Header {
		margin: 16px 0;

		> * {
			width: 100%;
			padding: 4px 0;
		}
	}

	&Editing {
		min-height: 100px;
	}
}

.customizeContainer {
	position: relative;
	// cursor: move;
	background: var(--MI_THEME-panel);
	margin: var(--MI-margin) 0;
	border-radius: var(--MI-radius);

	> header {
		position: relative;
		line-height: 25px;

		&Config,
		&Remove {
			position: absolute;
			top: 0;
			padding: 0 8px;
			line-height: 32px;
		}

		&Config {
			right: 30px;
		}

		&Remove {
			right: 5px;
		}
	}

	&Handle {

		&Widget {
			pointer-events: none;
		}
	}

}

.widgetContainerHandle {
	padding: 0 10px;
	cursor: move;
	line-height: 32px;
}

.widgetContainerButton {
	position: absolute;
	top: 0;
	padding: 0 8px;
	line-height: 32px;
}

.widgetContainerConfig {
	composes: widgetContainerButton;
	right: 30px;
}

.widgetContainerRemove {
	composes: widgetContainerButton;
	right: 5px;
}

</style>
