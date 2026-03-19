<template lang="html">
    <div class="closeable-window" :style="containerStyle ?? {}">
        <div class="closeable-window-topbar">
            <div class="closeable-window-topbar-close-button" @click="$emit('onClose')">
                <Icon codicon-name="close" />
            </div>
        </div>
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { computed } from 'vue';
import Icon from './Icon.vue';

// --- PROPS & EMITS ---

const props = defineProps({
    position: {
        type: Object as () => { x: number; y: number },
        required: false,
        default: null,
    },
});

// --- STORES ---

// --- STATES ---

// --- COMPUTED ---

// CSSProperties needed to avoid TS error
const containerStyle = computed<CSSProperties | null>(() => {
    if (!props.position) return null;

    return {
        position: 'absolute',
        left: `${props.position.x}px`,
        top: `${props.position.y}px`,
    };
});

// --- WATCHERS ---

// --- METHODS ---
</script>

<style scoped lang="scss">
@use '@render/styles/variables' as *;

.closeable-window {
    z-index: 10;
    border-radius: $border-radius-sm;
    background-color: $primary-400;
    padding: 1rem;

    &-topbar {
        display: flex;
        justify-content: flex-end;
        width: 100%;
        height: 2rem;

        &-close-button {
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            width: 1.5rem;
            height: 1.5rem;
        }
    }
}
</style>
