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
    await fusionStore.createElements(paths);
};

const exportAll = async () => {
    await fusionStore.exportAllContainersAsImages();
    modalStore.openModal({
        title: 'Export Complete',
        description: `Exported images successfully!`,
        cbs: [
            {
                title: 'Cool!',
                cb: () => modalStore.closeModal(),
            },
        ],
    });
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
