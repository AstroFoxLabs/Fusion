import { build } from 'esbuild';

await build({
    entryPoints: ['src/main/main.ts'],
    outfile: 'dist/main/main.js',
    target: 'esnext',
    platform: 'node',
    format: 'cjs',
    bundle: true,
    external: [
        'electron',
        'fs',
        'path',
        'os',
        'child_process',
        'sharp',
        'vue',
        'vue-router',
        'vuex',
        'pinia',
        'axios',
        'dayjs',
        'lodash',
        'uuid',
    ],
    sourcemap: true,
    minify: false,
});
