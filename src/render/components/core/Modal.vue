<template lang="html">
    <teleport to="body">
        <div v-if="modalStore.modal" class="modal">
            <div class="modal-content">
                <div class="modal-content-title">
                    {{ modalStore.modal.title }}
                </div>
                <div class="modal-content-description">
                    {{ modalStore.modal.description }}
                </div>
                <div class="modal-content-actions">
                    <div class="modal-content-action" v-for="action in modalStore.modal.cbs" :key="action.title">
                        <button class="modal-content-action-button" @click="action.cb">
                            {{ action.title }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script setup lang="ts">
import { useModalStore } from '@render/stores/modalStore';

// --- PROPS & EMITS ---

// --- STORES ---

const modalStore = useModalStore();

// --- STATES ---

// --- COMPUTED ---

// --- WATCHERS ---

// --- METHODS ---
</script>

<style scoped lang="scss">
@use '@render/styles/variables.scss' as *;

.modal {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    background-color: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;

    &-content {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        background-color: $primary-500;
        padding: 20px;
        width: 100%;
        max-width: 400px;
        text-align: center;

        &-title {
            font-size: 1.5rem;
        }

        &-actions {
            display: flex;
            justify-content: center;
            gap: 1rem;
            width: 100%;
        }
    }
}
</style>
