import { DialogOptions, DialogReturn } from '@shared/types.js';
import Electron from 'electron';
import { register } from './ipcHandlers.js';

register<{ options: DialogOptions }, DialogReturn>('show-open-dialog', async (event, { options }) => {
    try {
        return await Electron.dialog.showOpenDialog(options);
    } catch (error) {
        throw new Error(`Failed to show open dialog: ${error}`);
    }
});
