import LogService from '@main/services/LogService.js';
import { changeObjectsIDType } from '@main/utils.js';
import { IpcResponse } from '@shared/types';
import electron from 'electron';

type IPCMainHandler<TReq, TRes> = (event: Electron.IpcMainInvokeEvent, req: TReq) => Promise<TRes>;

export function register<TReq, TRes>(channel: string, fn: IPCMainHandler<TReq, TRes>) {
    const ipcMain = electron.ipcMain;
    ipcMain.handle(channel, async (event, req: TReq): Promise<IpcResponse<TRes>> => {
        try {
            const res = await fn(event, req);
            if (res && typeof res === 'object' && 'id' in res) {
                changeObjectsIDType(res);
            }
            return { success: true, data: res as TRes } as IpcResponse<TRes>;
        } catch (err: any) {
            LogService.error(`Error in IPC handler for channel "${channel}":`, err);
            return {
                success: false,
                error: err?.message ?? 'Unknown error',
            } as IpcResponse<TRes>;
        }
    });
}

import './dialogHandlers.js';
import './diskHandlers.js';
import './logHandlers.js';
import './settingsHandlers.js';
