<template lang="html">
    <div :class="`icon codicon codicon-${codiconName}`">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
// --- PROPS & EMITS ---

const props = defineProps({
    codiconName: {
        type: String,
        required: false,
        default: 'custom',
    },
});

// --- STORES ---

// --- STATES ---

// --- COMPUTED ---

// --- WATCHERS ---

// --- METHODS ---
</script>

<style scoped lang="scss">
@use '@render/styles/variables' as *;
.icon {
    display: inline;
    align-content: center;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-size: 20px;
    line-height: 1.2;

    &:hover {
        :deep(svg) {
            *:not([fill]) {
                fill: RGBA(255, 255, 255, 0.9);
                color: RGBA(255, 255, 255, 0.9);
            }
        }
    }

    :deep(svg) {
        * {
            fill: RGBA(255, 255, 255, 0.9);
            color: RGBA(255, 255, 255, 0.9);
        }
    }

    &:active {
        filter: brightness(0.5);
    }
}

.codicon {
    fill: RGBA(255, 255, 255, 0.9);
    color: RGBA(255, 255, 255, 0.9);

    &:hover {
        cursor: pointer;
        fill: RGBA(255, 255, 255, 0.9);
        color: RGBA(255, 255, 255, 0.9);
    }
}
</style>
