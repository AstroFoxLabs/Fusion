import { ALLOWED_IMAGE_TYPES } from '@shared/constants';
import type { DialogOptions } from '@shared/types';
import { defineStore } from 'pinia';
import { useSettingsStore } from './settingsStore';

export const useDialogStore = defineStore('dialog', () => {
    /* ---------------------------- STORES ---------------------------- */

    /* ---------------------------- STATES ---------------------------- */

    /* ----------------------------- GETTERS ------------------------- */

    /* ---------------------------- INTERNALS ------------------------- */

    /* ----------------------------- ACTIONS ------------------------- */

    const fileExplorerGetImages = async (): Promise<string[]> => {
        try {
            const response = await window.electron.dialog.showOpenDialog({
                title: 'Select Images',
                properties: ['openFile', 'multiSelections'],
                filters: [{ name: 'Images', extensions: Object.keys(ALLOWED_IMAGE_TYPES) }],
                defaultPath: useSettingsStore().settings.paths.export || useSettingsStore().settings.paths.userData,
            } as DialogOptions);
            if (!response.success) {
                throw new Error(response.error);
            } else {
                if (response.data.canceled) {
                    console.warn('File selection was canceled by the user.');
                    return [];
                }
                return response.data.filePaths;
            }
        } catch (error) {
            console.error('Error opening file explorer:', error);
            throw error;
        }
    };

    const fileExplorerGetFolder = async (): Promise<string> => {
        try {
            const response = await window.electron.dialog.showOpenDialog({
                title: 'Select Folder',
                properties: ['openDirectory'],
                defaultPath: useSettingsStore().settings.paths.export || useSettingsStore().settings.paths.userData,
            } as DialogOptions);
            if (!response.success) {
                throw new Error(response.error);
            } else {
                if (response.data.canceled) {
                    console.warn('Folder selection was canceled by the user.');
                    return '';
                }
                return response.data.filePaths[0];
            }
        } catch (error) {
            console.error('Error opening folder explorer:', error);
            throw error;
        }
    };

    return {
        fileExplorerGetImages,
        fileExplorerGetFolder,
    };
});
