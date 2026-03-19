<template lang="html">
    <div class="layout-top" :class="{ fullscreen: fusionStore.fusionElements.length === 0 }">
        <div class="layout-top-main-actions">
            <div class="layout-top-main-action" @click="loadImageFilesAsElements">
                <Icon codicon-name="files" class="layout-top-main-action-icon" />
                <span>Load Files</span>
            </div>
            <div class="layout-top-main-action" v-if="fusionStore.fusionElements.length > 0" @click="exportAll">
                <Icon codicon-name="save" class="layout-top-main-action-icon" />
                <span>Export all files</span>
            </div>
            <div class="layout-top-main-action" @click="$emit('onOpenSettings')">
                <Icon codicon-name="settings" class="layout-top-main-action-icon" />
                <span>Settings</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Icon from '@render/components/core/Icon.vue';
import { useDialogStore } from '@render/stores/dialogStore';
import { useFusionStore } from '@render/stores/fusionStore';
import { useModalStore } from '@render/stores/modalStore';
import { useProgressStore } from '@render/stores/progressStore';

// --- PROPS & EMITS ---

// --- STORES ---

const modalStore = useModalStore();
const fusionStore = useFusionStore();
const dialogStore = useDialogStore();
const progressStore = useProgressStore();

// --- STATES ---

// --- COMPUTED ---

// --- WATCHERS ---

// --- METHODS ---

const loadImageFilesAsElements = async (e: Event) => {
    const paths = await dialogStore.fileExplorerGetImages();
    try {
        await fusionStore.createElements(paths);
    } catch (error) {
        console.error('Error loading image files:', error);
        modalStore.openSimpleConfirmationModal(
            'Error Loading Files',
            'An error occurred while loading the image files. Please make sure the files are valid images and try again.',
            'Sad',
        );
    }

};

const exportAll = async () => {
    try {
        await fusionStore.exportAllContainersAsImages();
        modalStore.openSimpleConfirmationModal(
            'Export Process Completed',
            'All containers have been exported successfully.',
            'Cool!',
        );
    } catch (error) {
        console.error('Error during export process:', error);
        modalStore.openSimpleConfirmationModal(
            'Export Process Error',
            'An error occurred during the export process. Please make sure you have set a valid export path in the settings or enabled "Ask for location on export".',
            'Sad',
        );
    }
};
</script>

<style scoped lang="scss">
@use '@render/styles/variables' as *;

.layout-top {
    padding: 2rem;
    width: 100%;

    &-main-actions {
        display: flex;
        justify-content: center;
        gap: 2rem;
    }

    &-main-action {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;
        cursor: pointer;
        font-size: 1.25rem;

        &:hover {
            transition: color 0.2s;
            color: #fff;

            .layout-top-main-action-icon {
                transition: color 0.2s;
                color: #fff;
            }
        }

        &-icon {
            font-size: 3rem;
        }
    }
}

.fullscreen {
    &.layout-top {
        align-content: center;
        height: 100vh;
    }

    .layout-top-main-action {
        span {
            font-size: 2rem;
        }
    }

    :deep(.layout-top-main-action-icon) {
        font-size: 6rem;
    }
}
</style>
