import '@main/ipcHandlers/ipcHandlers.js';
import LogService from '@main/services/LogService.js';
import dotenv from 'dotenv';
import electron from 'electron';
import path from 'path';
import UpdateService from './services/UpdateService';

dotenv.config();

const { app, BrowserWindow } = electron;
export let mainWindow: electron.BrowserWindow | null = null;

LogService.clearLogFile();

const windowSettingsDev: Electron.BrowserWindowConstructorOptions = {
    width: 1600,
    height: 900,
    webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        webSecurity: false,
        preload: path.join(__dirname, '../preload', 'preload.js'),
    },
    autoHideMenuBar: true,
    //frame: false,
};

const windowSettingsProd: Electron.BrowserWindowConstructorOptions = {
    width: 1600,
    height: 900,
    webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        webSecurity: true,
        preload: path.join(__dirname, '../preload', 'preload.js'),
    },
    autoHideMenuBar: true,
    frame: false,
};

const createWindow = async () => {
    mainWindow = new BrowserWindow(app.isPackaged ? windowSettingsProd : windowSettingsDev);
    if (!app.isPackaged && process.env.VITE_DEV_SERVER_URL && process.env.NODE_ENV === 'development') {
        LogService.info('Loading development server at', process.env.VITE_DEV_SERVER_URL);
        mainWindow.webContents.openDevTools();
        await mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    } else {
        LogService.info('Loading production build at index.html');
        await mainWindow.loadFile(path.join(__dirname, '../render/index.html'));
    }
};

const initFilesystem = async () => {};

app.on('ready', async () => {
    try {
        try {
            await new UpdateService().checkForUpdates();
        } catch (err) {
            LogService.error('Failed to check for updates. Skipping.', err);
        }
        await initFilesystem();
        await createWindow();
    } catch (err) {
        LogService.error('Failed to initialize application:', err);
        app.quit();
    }
});

// Important: Will not be emitted on Windows, when app closes through shutdown/restart or logout
app.on('quit', () => {
    LogService.info('Application is quitting.');
});

// Needed for clean exit on macOS (Cause it doesn't close the app when closing the last window)
app.on('window-all-closed', () => {
    LogService.info('All windows closed.');
    if (process.platform !== 'darwin') app.quit();
});

// On macOS it's common to re-create a window in the app when the dock icon is clicked and there are no other windows open
app.on('activate', async (event, hasVisibleWindows: boolean) => {
    try {
        if (BrowserWindow.getAllWindows().length === 0) {
            await createWindow();
        } else if (mainWindow && !hasVisibleWindows) {
            mainWindow.show();
        }
    } catch (err) {
        LogService.error('Failed to create window on activate:', err);
    }
});
