<template lang="html">
    <CloseableWindow class="settings-window" v-if="tmpSettings">
        <div class="settings-window-container">
            <FieldGroup>
                <template #title>
                    <span>Export Settings</span>
                </template>
                <Field label="Default Save Location">
                    <div class="settings-window-container-save-loaction">
                        <InputCheckbox label="Ask each time" v-model="tmpSettings.export.askForLocation" />
                        <InputField
                            label="Default Save Location"
                            placeholder="Enter a default save location"
                            v-model="tmpSettings.paths.export"
                            :disabled="tmpSettings.export.askForLocation"
                            @click="selectFolder"
                        />
                    </div>
                </Field>
                <Field label="Quality 0 - 100 (Only for JPEG)">
                    <InputField
                        label="Quality"
                        placeholder="Enter a quality setting"
                        v-model="tmpSettings.export.quality"
                    />
                </Field>
                <Field label="Format" class="field">
                    <select v-model="tmpSettings.export.format">
                        <option v-for="format in Object.keys(ALLOWED_IMAGE_TYPES)" :key="format" :value="format">
                            {{ format }}
                        </option>
                    </select>
                </Field>
            </FieldGroup>
            <div class="settings-window-container-actions">
                <button @click="setToDefault">Set to default</button>
                <button @click="saveSettings()">Save</button>
            </div>
        </div>
    </CloseableWindow>
</template>

<script setup lang="ts">
import CloseableWindow from '@render/components/core/CloseableWindow.vue';
import Field from '@render/components/core/Field.vue';
import FieldGroup from '@render/components/core/FieldGroup.vue';
import InputCheckbox from '@render/components/core/InputCheckbox.vue';
import InputField from '@render/components/core/InputField.vue';
import { useDialogStore } from '@render/stores/dialogStore';
import { useModalStore } from '@render/stores/modalStore';
import { useSettingsStore } from '@render/stores/settingsStore';
import { ALLOWED_IMAGE_TYPES } from '@shared/constants';
import type { AppSettings } from '@shared/settings';
import { onMounted, ref } from 'vue';
// --- PROPS & EMITS ---

// --- STORES ---

const settingsStore = useSettingsStore();
const modalStore = useModalStore();
const dialogStore = useDialogStore();

// --- STATES ---
const tmpSettings = ref<AppSettings>();

// --- COMPUTED ---

// --- WATCHERS ---

// --- METHODS ---
const setToDefault = async () => {
    modalStore.openModal({
        title: 'Reset Settings',
        description: 'Are you sure?',
        cbs: [
            {
                title: 'Yep',
                cb: async () => {
                    await settingsStore.setToDefault();
                    tmpSettings.value = settingsStore.settings;
                    modalStore.closeModal();
                },
            },
            {
                title: 'Nope',
                cb: () => modalStore.closeModal(),
            },
        ],
    });
};

const saveSettings = async () => {
    modalStore.openModal({
        title: 'Saving Settings',
        description: 'Save Settings?',
        cbs: [
            {
                title: 'Yep',
                cb: async () => {
                    try {
                        await settingsStore.assignSettings(tmpSettings.value!);
                        await settingsStore.persistSettings();
                        modalStore.closeModal();
                    } catch (error) {
                        modalStore.closeModal();
                        console.error('Error saving settings:', error);
                        modalStore.openSimpleConfirmationModal(
                            'Save Error',
                            'An error occurred while saving settings. Please try again.',
                            'Sad',
                        );
                    }
                },
            },
            {
                title: 'Nope',
                cb: () => modalStore.closeModal(),
            },
        ],
    });
};

const selectFolder = async () => {
    try {
        const path = await dialogStore.fileExplorerGetFolder();
        if (tmpSettings.value) tmpSettings.value.paths.export = path;
    } catch (error) {
        modalStore.openSimpleConfirmationModal(
            'Folder Selection Error',
            'An error occurred while selecting the folder. Please try again.',
            'Sad',
        );
        console.error('Error selecting folder:', error);
    }
};

onMounted(async () => {
    tmpSettings.value = await settingsStore.loadSettings();
});
</script>

<style scoped lang="scss">
@use '@render/styles/variables' as *;

.settings-window {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 2px solid $primary-600;
    width: 50vw;
    max-height: 50vh;
    overflow-y: auto;

    &-container {
        padding: 1rem;

        &-save-loaction {
            display: flex;
            flex-direction: column;
            align-items: start;
            gap: 0.5rem;
        }

        &-actions {
            display: flex;
            gap: 0.5rem;
            margin-top: 1rem;
        }
    }
}
</style>
