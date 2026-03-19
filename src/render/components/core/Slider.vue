<template lang="html">
    <input
        type="range"
        @change="onChange"
        v-model.number="model"
        :min="props.min"
        :max="props.max"
        :step="props.step"
        draggable="false"
        class="slider"
    />
</template>

<script setup lang="ts">
// --- PROPS & EMITS ---

const props = defineProps({
    min: {
        type: Number,
        default: 0,
    },
    max: {
        type: Number,
        default: 100,
    },
    step: {
        type: Number,
        default: 10,
    },
});

const emits = defineEmits(['onChange', 'onInput']);

// --- STORES ---

// --- STATES ---

const model = defineModel({
    type: Number,
    default: 50,
});

// --- COMPUTED ---

// --- WATCHERS ---

// --- METHODS ---

// Happens after letting go of the slider
const onChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    emits('onChange', e, parseInt(target.value));
};
</script>

<style scoped lang="scss">
@use '@render/styles/variables' as *;

.slider {
    background-color: transparent;
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    max-width: 25rem;

    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        outline: none;
        border-radius: $border-radius-full;
        background-color: #b4b4b4;
        width: 0.75rem;
        height: 0.75rem;
        pointer-events: none;

        &:hover {
            cursor: pointer;
            background-color: #FFF;
        }
    }

    &::-webkit-slider-runnable-track {
        border-radius: $border-radius-full;
        background: $primary-800;
        height: 10px;

        &:hover {
            cursor: pointer;
        }
    }
}
</style>
