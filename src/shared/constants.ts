// Must be in a normal *.ts file because d.ts are compilation only
export const ALLOWED_IMAGE_TYPES = {
    png: 'image/png',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
} as const;
