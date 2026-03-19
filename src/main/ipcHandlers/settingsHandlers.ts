import SettingsService from '@main/services/SettingsService.js';
import type { AppSettings } from '@shared/settings.js';
import { register } from './ipcHandlers.js';

register<{}, AppSettings>('load-app-settings', async () => {
    try {
        return SettingsService.getInstance().loadSettings();
    } catch (error) {
        throw new Error(`Failed to load settings: ${error}`);
    }
});

register<AppSettings, void>('assign-app-settings', async (event, newSettings) => {
    try {
        SettingsService.getInstance().assignSettings(newSettings);
    } catch (error) {
        throw new Error(`Failed to assign settings: ${error}`);
    }
});

register<{}, void>('persist-app-settings', async () => {
    try {
        SettingsService.getInstance().persistSettings();
    } catch (error) {
        throw new Error(`Failed to persist settings: ${error}`);
    }
});

register<{}, AppSettings>('set-default-app-settings', async () => {
    try {
        const settingsInstance = SettingsService.getInstance();
        const defaultSettings = settingsInstance.getDefaultSettings();
        settingsInstance.assignSettings(defaultSettings);
        settingsInstance.persistSettings();
        return defaultSettings;
    } catch (error) {
        throw new Error(`Failed to reset settings to default: ${error}`);
    }
});
