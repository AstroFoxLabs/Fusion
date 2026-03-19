<template lang="html">
    <input
        class="input-field"
        :placeholder="placeholder"
        @keydown.enter="onSubmit"
        v-model="model"
        type="text"
        @blur="$emit('blur', $event, model)"
        ref="refInputField"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue';

// --- PROPS & EMITS ---

const props = defineProps({
    label: {
        type: String,
        required: false,
    },
    placeholder: {
        type: String,
        required: false,
        default: 'Enter here...',
    },
});

const model = defineModel({
    type: null,
    required: true,
});

const emit = defineEmits(['onSubmit', 'blur']);

// --- STORES ---

// --- STATES ---

const refInputField = ref<HTMLInputElement | null>(null);

// --- COMPUTED ---

// --- WATCHERS ---

// --- METHODS ---

const onSubmit = (e: KeyboardEvent) => {
    refInputField.value?.blur();
    emit('onSubmit', e, model.value);
};

defineExpose({
    focus: () => {
        if (refInputField.value) {
            refInputField.value.focus();
        }
    },
});
</script>

<style scoped lang="scss">
@use '@render/styles/variables' as *;

.input-field {
    box-shadow: none;
    border: none;
    border-radius: $border-radius-sm;
    background-color: $primary-700;
    padding: 0.25rem 0.5rem;
    width: 100%;
    max-width: 25rem;
    color: $text-normal;
    font-weight: 500;
    font-size: inherit;

    &:disabled {
        cursor: not-allowed;
        background-color: $primary-500;
        color: RGBA(255, 255, 255, 0.5);
    }

    &:focus-visible {
        outline: 2px solid $accent-400;
        box-shadow: none;
        border: none;
    }
}
</style>
