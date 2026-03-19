import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useProgressStore = defineStore('progress', () => {
    /* ---------------------------- STORES ---------------------------- */

    /* ---------------------------- STATES ---------------------------- */

    const progress = ref<number>(0);

    /* ----------------------------- GETTERS ------------------------- */

    /* ---------------------------- INTERNALS ------------------------- */

    const changeProgress = (currentValue: number, maxValue: number) => {
        progress.value = Math.round((currentValue / maxValue) * 100);
    };

    const resetProgress = () => {
        progress.value = 0;
    };

    /* ----------------------------- ACTIONS ------------------------- */

    return {
        progress,
        changeProgress,
        resetProgress,
    };
});
