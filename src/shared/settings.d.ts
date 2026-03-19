export interface AppSettings {
    paths: {
        app: string;
        userData: string;
        export: string;
    };
    export: {
        quality: number;
        format: string;
        askForLocation: boolean;
    };
}
