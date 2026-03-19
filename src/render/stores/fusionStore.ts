import { getImageDimensions } from '@render/utils';
import { ALLOWED_IMAGE_TYPES } from '@shared/constants';
import { FusionContainer, FusionElement, ReturnImageFileType } from '@shared/types';
import * as htmlToImage from 'html-to-image';
import { Options } from 'html-to-image/lib/types';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useDialogStore } from './dialogStore';
import { useModalStore } from './modalStore';
import { useProgressStore } from './progressStore';
import { useSettingsStore } from './settingsStore';

export const useFusionStore = defineStore('fusion', () => {
    /* ---------------------------- STORES ---------------------------- */

    const settingsStore = useSettingsStore();
    const progressStore = useProgressStore();
    const dialogStore = useDialogStore();
    const modalStore = useModalStore();

    /* ---------------------------- STATES ---------------------------- */

    const fusionContainers = ref<FusionContainer[]>([]);
    const fusionElements = ref<FusionElement[]>([]);

    const dragSrcId = ref<string | null>(null); // Used for swapping elements

    /* ----------------------------- GETTERS ------------------------- */

    /* ---------------------------- INTERNALS ------------------------- */

    const deleteContainer = (containerId: string) => {
        const deleteElement = (elementId: string) => {
            const el = fusionElements.value.find((e) => e.id === elementId);
            if (el) {
                URL.revokeObjectURL(el.blobUrl); // Make sure memory is freed up when an element is deleted
                fusionElements.value = fusionElements.value.filter((el) => el.id !== elementId);
            }
        };

        const fc = fusionContainers.value.find((c) => c.id === containerId);
        if (fc) {
            for (const element of fc.elements) {
                deleteElement(element.id);
            }
            fusionContainers.value = fusionContainers.value.filter((c) => c.id !== containerId);
        }
    };

    /* ----------------------------- ACTIONS ------------------------- */

    const createElements = async (filePaths: string[]): Promise<void> => {
        let nProgress = 0;
        const nTotal = filePaths.length;
        for (const filePath of filePaths) {
            try {
                const res = await window.electron.disk.readImage(filePath);
                if (!res.success) throw new Error(res.error);
                const file: ReturnImageFileType = res.data;

                if (!(Object.values(ALLOWED_IMAGE_TYPES) as string[]).includes(file.type)) {
                    console.error(`File type ${file.type} is not allowed for file ${file.name}.`);
                    continue;
                }

                const { width, height } = await getImageDimensions(file.url);
                const fusionElement = {
                    id: crypto.randomUUID(),
                    fileSize: file.size,
                    fileName: file.name,
                    fileType: file.type,
                    data: file.data,
                    blobUrl: file.url,
                    width: width,
                    height: height,
                } as FusionElement;
                fusionElements.value.push(fusionElement);
                nProgress++;
                progressStore.changeProgress(nProgress, nTotal);
            } catch (error) {
                console.error(`Error processing file ${filePath}:`, error);
                modalStore.openSimpleConfirmationModal(
                    `Error loading image at path ${filePath}`,
                    `An error occurred while loading the image ${filePath}. Please make sure the file is a valid image and try again.`,
                );
            }
        }
        progressStore.resetProgress();
    };

    const exportAllContainersAsImages = async () => {
        let nProcessedItems = 0;
        let path = settingsStore.settings.paths.export;

        // Setting it beforehand, otherwise it will ask on each container export where to save the image
        if (settingsStore.settings.export.askForLocation) {
            path = await dialogStore.fileExplorerGetFolder();
        }

        for (const container of fusionContainers.value) {
            try {
                const el = document.getElementById(container.id);
                if (!el) continue;
                await exportContainerAsImage(el, container, path);
            } catch (error) {
                console.error('Error exporting containers:', error);
                modalStore.openSimpleConfirmationModal(
                    `Export Error for container ${container.name}`,
                    'Please try again.',
                    'Sad',
                );
            }
            nProcessedItems++;
            progressStore.changeProgress(nProcessedItems, fusionContainers.value.length);
        }
        progressStore.resetProgress();
    };

    // HTML Element needed for html-to-image to work
    const exportContainerAsImage = async (el: HTMLElement, container: FusionContainer, path: string | null = null) => {
        try {
            // Get max height (Scaling down rather than upscaling to preserve image quality)
            let height = 0;
            for (const element of container.elements) {
                if (element.height > height) {
                    height = element.height;
                }
            }

            // Clone element to avoid DOM side effects
            let newEl: HTMLElement;
            newEl = el.cloneNode(true) as HTMLElement;
            newEl.id = `${container.id}-clone-${Date.now()}`;
            newEl.style.height = `${height}px`;
            newEl.style.width = 'max-content'; // Prevent empty space on export

            document.body.appendChild(newEl);
            // Ensure DOM layout is updated before export.
            // Otherwise sometimes an image will be exported 0x0 because the cloned element hasn't been fully rendered yet
            await new Promise((r) => setTimeout(r, 0));

            let blobUrl: string;
            const options: Options = {
                quality: settingsStore.settings.export.quality / 100,
            };

            switch (settingsStore.settings.export.format as keyof typeof ALLOWED_IMAGE_TYPES) {
                case 'png':
                    blobUrl = await htmlToImage.toPng(newEl, options);
                    break;
                case 'jpeg':
                    blobUrl = await htmlToImage.toJpeg(newEl, options);
                    break;
                case 'svg':
                    blobUrl = await htmlToImage.toSvg(newEl, options);
                    break;
                default:
                    blobUrl = await htmlToImage.toPng(newEl, options);
                    break;
            }

            if (!path) path = await dialogStore.fileExplorerGetFolder();

            const buffer = await fetch(blobUrl);
            const arrayBuffer = await buffer.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            await window.electron.disk.saveFile(
                `${path}/${container.name}.${settingsStore.settings.export.format}`,
                uint8Array,
            );
            newEl?.remove();
            // Revoke the object URL to free up memory - important for large images
            URL.revokeObjectURL(blobUrl);
            modalStore.openSimpleConfirmationModal(
                `Export Successful for image ${container.name}`,
                `Your image has been exported successfully to ${path}.`,
                'Cool!',
            );
        } catch (error) {
            console.error('Error exporting image:', error);
            throw error;
        }
    };

    return {
        fusionElements,
        fusionContainers,
        dragSrcId,
        exportContainerAsImage,
        deleteContainer,
        createElements,
        exportAllContainersAsImages,
    };
});
