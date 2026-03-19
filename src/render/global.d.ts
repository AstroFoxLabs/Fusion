import { ReturnImageFileType } from '@shared/types';

export {};

declare global {
    interface Window {
        electron: {
            disk: {
                saveFile: (path: string, data: Uint8Array) => Promise<void>;
                readImage: (filePath: string) => Promise<IpcResponse<ReturnImageFileType>>;
                selectFolder: () => Promise<IpcResponse<string>>;
                createBufferFromFile: (filePath: string) => Promise<IpcResponse<Uint8Array>>;
                createBufferHash: (buffer: Uint8Array) => Promise<IpcResponse<string>>;
            };
            settings: {
                loadSettings: () => Promise<IpcResponse<AppSettings>>;
                assignSettings: (newSettings: AppSettings) => Promise<IpcResponse<void>>;
                persistSettings: () => Promise<IpcResponse<void>>;
                setToDefault: () => Promise<IpcResponse<AppSettings>>;
            };
            log: {
                info: (message: string) => void;
                warn: (message: string) => void;
                error: (message: string) => void;
            };
            dialog: {
                showOpenDialog: (options: OpenDialogOptions) => Promise<IpcResponse<OpenDialogReturnValue>>;
            };
        };
    }
}
