import type { AppSettings } from '@shared/settings';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSettingsStore = defineStore('settings', () => {
    /* ---------------------------- STORES ---------------------------- */

    /* ---------------------------- STATES ---------------------------- */

    // Type Fix so that typescript knows that settings will be assigned definitely later
    const settings = ref<AppSettings>(null as unknown as AppSettings);

    /* ----------------------------- GETTERS ------------------------- */

    /* ---------------------------- INTERNALS ------------------------- */

    /* ----------------------------- ACTIONS ------------------------- */

    const loadSettings = async (): Promise<AppSettings> => {
        try {
            if (settings.value) return settings.value;
            const res = await window.electron.settings.loadSettings();
            settings.value = res.data;
            return settings.value;
        } catch (err) {
            console.error('Error loading settings:', err);
            throw err;
        }
    };

    const assignSettings = async (newSettings: AppSettings): Promise<void> => {
        try {
            await window.electron.settings.assignSettings(JSON.parse(JSON.stringify(newSettings)));
            settings.value = newSettings;
        } catch (err) {
            console.error('Error assigning settings:', err);
            throw err;
        }
    };

    // Persists the settings that were last pushed to the main process via assignSettings.
    const persistSettings = async (): Promise<void> => {
        try {
            await window.electron.settings.persistSettings();
        } catch (err) {
            console.error('Error persisting settings:', err);
            throw err;
        }
    };

    const setToDefault = async (): Promise<void> => {
        try {
            const defaultSettings = await window.electron.settings.setToDefault();
            settings.value = defaultSettings.data;
        } catch (err) {
            console.error('Error setting settings to default:', err);
            throw err;
        }
    };

    return {
        settings,
        loadSettings,
        assignSettings,
        persistSettings,
        setToDefault,
    };
});
