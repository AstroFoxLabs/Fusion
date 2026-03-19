import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface ModalCb<TReq = unknown, TRes = unknown> {
    title: string;
    cb: (request: TReq | null) => TRes;
}

export interface ModalType {
    title: string;
    description: string;
    cbs: ModalCb[];
}

export const useModalStore = defineStore('modal', () => {
    /* ---------------------------- STORES ---------------------------- */

    /* ---------------------------- STATES ---------------------------- */

    const modal = ref<ModalType | null>(null);

    /* ----------------------------- GETTERS ------------------------- */

    /* ---------------------------- INTERNALS ------------------------- */

    const openModal = (newModal: ModalType) => {
        modal.value = newModal;
    };

    const closeModal = () => {
        modal.value = null;
    };

    const openSimpleConfirmationModal = (title: string, description: string, confirmTitle: string = 'OK') => {
        openModal({
            title,
            description,
            cbs: [
                {
                    title: confirmTitle,
                    cb: () => {
                        closeModal();
                    },
                },
            ],
        });
    };

    /* ----------------------------- ACTIONS ------------------------- */

    return {
        modal,
        openModal,
        closeModal,
        openSimpleConfirmationModal,
    };
});
