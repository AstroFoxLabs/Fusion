import FileStorageService from '@main/services/FileStorageService.js';
import { ReturnImageFileType } from '@shared/types.js';
import { fileTypeFromBuffer } from 'file-type';
import path from 'path';
import { pathToFileURL } from 'url';
import { register } from './ipcHandlers.js';

register<{ path: string; data: Uint8Array }, void>('save-file', async (event, { path, data }): Promise<void> => {
    try {
        FileStorageService.store(data, path);
    } catch (error) {
        throw new Error(`Failed to write file to ${path}: ${error}`);
    }
});

register<{ filePath: string }, ReturnImageFileType>('read-image', async (event, { filePath }) => {
    try {
        const uint8Array = FileStorageService.read(filePath);
        const type = await fileTypeFromBuffer(uint8Array);
        return {
            filePath: filePath,
            data: uint8Array,
            url: pathToFileURL(filePath).href,
            name: path.basename(filePath),
            size: uint8Array.length,
            type: type?.mime,
        } as ReturnImageFileType;
    } catch (error) {
        throw new Error(`Failed to read image from ${filePath}: ${error}`);
    }
});
