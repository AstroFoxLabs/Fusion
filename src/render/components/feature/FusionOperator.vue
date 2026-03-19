<template lang="html">
    <div class="fusion-operator" :data-fusion-container-id="container.id">
        <div class="fusion-operator-images" :id="container.id" ref="fusion-html-to-image-template">
            <div
                class="fusion-operator-image"
                v-for="el in container.elements"
                :key="el.id"
                :data-fusion-element-id="el.id"
                :draggable="true"
                @dragstart="onDragStart($event, el)"
                @dragover.prevent="onDragOver($event, el)"
            >
                <img :src="el.blobUrl" />
            </div>
        </div>
        <div class="fusion-operator-bottom">
            <InputField label="Name" placeholder="Enter Name" v-model="props.container.name" />
            <div class="fusion-operator-bottom-actions">
                <div class="fusion-operator-bottom-action">
                    <Icon codicon-name="download" @click="onSave" />
                </div>
                <div class="fusion-operator-bottom-action">
                    <Icon codicon-name="trash" @click="onTrash" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Icon from '@render/components/core/Icon.vue';
import InputField from '@render/components/core/InputField.vue';
import { useFusionStore } from '@render/stores/fusionStore';
import { useModalStore } from '@render/stores/modalStore';
import { useSettingsStore } from '@render/stores/settingsStore';
import type { FusionContainer, FusionElement } from '@shared/types';
import { useTemplateRef } from 'vue';

// --- PROPS & EMITS ---

const props = defineProps({
    container: {
        type: Object as () => FusionContainer,
        required: true,
    },
});

// --- STORES ---

const fusionStore = useFusionStore();
const settingsStore = useSettingsStore();

// --- STATES ---

const fusionHtmlToImageTemplate = useTemplateRef('fusion-html-to-image-template');

// --- COMPUTED ---

// --- WATCHERS ---

// --- METHODS ---

const onSave = () => {
    const el = fusionHtmlToImageTemplate.value;
    if (!el) return;

    try {
        if (!settingsStore.settings.export.askForLocation) {
            fusionStore.exportContainerAsImage(el, props.container, settingsStore.settings.paths.export);
        } else {
            fusionStore.exportContainerAsImage(el, props.container);
        }
    } catch (error) {
        console.error('Error exporting container as image:', error);
        useModalStore().openSimpleConfirmationModal(
            'Export Error',
            'An error occurred while exporting the container as an image. Please try again.',
            'Sad',
        );
    }
};

const onTrash = () => {
    fusionStore.deleteContainer(props.container.id);
};

// Info:
// Drag Start and Drag Over will not be the same component,
// so we store the source element in the store because the drag-over component
// needs to know which element is being dragged to swap them
const onDragStart = (event: DragEvent, element: FusionElement) => {
    fusionStore.dragSrcId = element.id;
};

// Swap elements on drag over
const onDragOver = async (event: DragEvent, targetElement: FusionElement) => {
    if (targetElement.id === fusionStore.dragSrcId) {
        return;
    }

    const sourceContainer = fusionStore.fusionContainers.find((c) =>
        c.elements.some((e) => e.id === fusionStore.dragSrcId),
    );
    const targetContainer = fusionStore.fusionContainers.find((c) => c.elements.some((e) => e.id === targetElement.id));

    const sourceIndex = sourceContainer?.elements.findIndex((e) => e.id === fusionStore.dragSrcId);
    const targetIndex = targetContainer?.elements.findIndex((e) => e.id === targetElement.id);

    if (sourceContainer && targetContainer && sourceIndex !== undefined && targetIndex !== undefined) {
        // Swap elements in the same container
        if (sourceContainer.id === targetContainer.id) {
            const temp = sourceContainer.elements[sourceIndex];
            sourceContainer.elements[sourceIndex] = sourceContainer.elements[targetIndex];
            sourceContainer.elements[targetIndex] = temp;
        } else {
            const temp = sourceContainer.elements[sourceIndex];
            sourceContainer.elements[sourceIndex] = targetContainer.elements[targetIndex];
            targetContainer.elements[targetIndex] = temp;
        }
    }
};
</script>

<style scoped lang="scss">
@use '@render/styles/variables' as *;

.fusion-operator {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border: 1px solid RGBA(255, 255, 255, 0.1);
    border-radius: $border-radius-md;
    background-color: $primary-500;
    padding: 1rem;
    width: 49%;

    &-images {
        display: flex;
        justify-content: center;
        width: 100%;
        height: 25rem;
        overflow: hidden;

        img {
            width: 100%;
            height: 100%;
            object-fit: contain;

            &:hover {
                transform: scale(0.95);
                transition: all 0.2s ease;
                cursor: grab;
            }
        }
    }

    &-bottom {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 1rem;

        :deep(.input-field) {
            font-size: 1rem;
        }

        &-actions {
            display: flex;
            gap: 0.5rem;
        }
    }
}
</style>
