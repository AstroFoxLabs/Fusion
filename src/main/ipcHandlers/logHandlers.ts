import LogService from '@main/services/LogService.js';
import { register } from './ipcHandlers.js';

register<{ message: string }, void>('log-info', async (event, { message }) => {
    LogService.info(`${message}`);
});

register<{ message: string }, void>('log-warn', async (event, { message }) => {
    LogService.warn(`${message}`);
});

register<{ message: string }, void>('log-error', async (event, { message }) => {
    LogService.error(`${message}`);
});
