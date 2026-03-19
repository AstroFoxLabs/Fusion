type Keys<T> = keyof T;
type Values<T> = T[keyof T];
export type IpcResponse<T> = IpcSuccess<T> | IpcError;
export interface FusionElement {
    id: UUID;
    data: Uint8Array;
    fileSize: number;
    fileName: string;
    fileType: AllowedMimeType;
    width: number;
    height: number;
    blobUrl: string;
}

export interface FusionContainer {
    id: UUID;
    elements: FusionElement[];
    name: string;
}

export interface ImageSize {
    width: number;
    height: number;
}

export interface Coordinates {
    x: number;
    y: number;
}

export interface DialogOptions extends Electron.OpenDialogOptions {}
export interface DialogReturn extends Electron.OpenDialogReturnValue {}
export interface ReturnImageFileType {
    filePath: string;
    data: Uint8Array;
    url: string;
    name: string;
    size: number;
    type: AllowedMimeType;
}
