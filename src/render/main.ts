import '@/styles/main.scss';
import App from '@render/App.vue';
import router from '@render/router';
import { createPinia } from 'pinia';
import { createApp } from 'vue';

const overrideLogging = () => {
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    console.log = (...args) => {
        window.electron.log.info(
            `[RENDER] ` + args.map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg))).join(' '),
        );
        originalLog(...args);
    };

    console.warn = (...args) => {
        window.electron.log.warn(
            `[RENDER] ` + args.map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg))).join(' '),
        );
        originalWarn(...args);
    };

    console.error = (...args) => {
        window.electron.log.error(
            `[RENDER] ` + args.map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg))).join(' '),
        );
        originalError(...args);
    };
};

try {
    overrideLogging(); // Override console.log/warn/error to log warnings to the main process to log them in the log file
    const pinia = createPinia();
    const app = createApp(App);
    app.use(router);
    app.use(pinia);
    app.mount('#app');
} catch (err) {
    console.error('Initialization failed, stopping opening App.', err);
}
