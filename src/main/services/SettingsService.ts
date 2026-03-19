import { AppSettings } from '@shared/settings.js';
import electron from 'electron';
import path from 'path';
import FileStorageService from './FileStorageService.js';
import LogService from './LogService.js';

const defaultSettings: AppSettings = {
    paths: {
        app: electron.app.getAppPath(),
        userData: electron.app.getPath('userData'),
        export: path.join(electron.app.getPath('userData'), 'exports'),
    },
    export: {
        quality: 80,
        format: 'png',
        askForLocation: true,
    },
};

export default class SettingsService {
    private static instance: SettingsService;
    private settings: AppSettings;

    private constructor() {
        this.settings = { ...defaultSettings };
    }

    static getInstance(): SettingsService {
        if (!SettingsService.instance) {
            SettingsService.instance = new SettingsService();
        }
        return SettingsService.instance;
    }

    getSettings(): AppSettings {
        return this.settings;
    }

    assignSettings(partial: Partial<AppSettings>) {
        Object.assign(this.settings, partial);
    }

    loadSettings(): AppSettings {
        try {
            const data = FileStorageService.getFileAsJSON(path.join(electron.app.getPath('userData'), 'settings.json'));
            Object.assign(this.settings, defaultSettings, data);
            return this.settings;
        } catch (err) {
            LogService.warn('Can not find Settings file. Using defaults:', err);
            this.settings = { ...defaultSettings };
            this.persistSettings();
            return this.settings;
        }
    }

    persistSettings(): void {
        try {
            const settingsPath = path.join(electron.app.getPath('userData'), 'settings.json');
            FileStorageService.store(
                new Uint8Array(Buffer.from(JSON.stringify(this.settings, null, 4), 'utf-8')),
                settingsPath,
            );
        } catch (error) {
            LogService.error('Failed to persist settings:', error);
            throw error;
        }
    }

    getDefaultSettings(): AppSettings {
        return defaultSettings;
    }
}
