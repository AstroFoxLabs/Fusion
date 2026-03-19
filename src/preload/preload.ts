import type { AppSettings } from '@shared/settings.js';
import type { IpcResponse, ReturnImageFileType } from '@shared/types.js';
import { contextBridge, ipcRenderer, OpenDialogOptions, OpenDialogReturnValue } from 'electron';

console.log('Preload script loaded.');

contextBridge.exposeInMainWorld('electron', {
    settings: {
        loadSettings: (): Promise<IpcResponse<AppSettings>> => ipcRenderer.invoke('load-app-settings'),
        assignSettings: (newSettings: AppSettings): Promise<IpcResponse<void>> =>
            ipcRenderer.invoke('assign-app-settings', { ...newSettings }),
        persistSettings: (): Promise<IpcResponse<void>> => ipcRenderer.invoke('persist-app-settings'),
        setToDefault: (): Promise<IpcResponse<AppSettings>> => ipcRenderer.invoke('set-default-app-settings'),
    },

    disk: {
        saveFile: (path: string, data: Uint8Array): Promise<void> => ipcRenderer.invoke('save-file', { path, data }),
        readImage: (filePath: string): Promise<IpcResponse<ReturnImageFileType>> =>
            ipcRenderer.invoke('read-image', { filePath }),
        selectFolder: (): Promise<IpcResponse<string>> => ipcRenderer.invoke('select-folder'),
        createBufferFromFile: (filePath: string): Promise<IpcResponse<Uint8Array>> =>
            ipcRenderer.invoke('create-buffer-from-file', { filePath }),
        createBufferHash: (buffer: Uint8Array): Promise<IpcResponse<string>> =>
            ipcRenderer.invoke('create-buffer-hash', { buffer }),
    },

    log: {
        info: (message: string) => ipcRenderer.invoke('log-info', { message }),
        warn: (message: string) => ipcRenderer.invoke('log-warn', { message }),
        error: (message: string) => ipcRenderer.invoke('log-error', { message }),
    },
    dialog: {
        showOpenDialog: (options: OpenDialogOptions): Promise<IpcResponse<OpenDialogReturnValue>> =>
            ipcRenderer.invoke('show-open-dialog', { options }),
    },
});
