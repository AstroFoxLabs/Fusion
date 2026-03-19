<template lang="html">
    <div class="field-group">
        <div class="field-group-title" v-if="$slots.title">
            <slot name="title"></slot>
        </div>
        <div class="field-group-content">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
// This component is meant to be used as a wrapper for fields.
// Example: Settings page with multiple sections, each section can be a FieldGroup.

// --- PROPS & EMITS ---

// --- STORES ---

// --- STATES ---

// --- COMPUTED ---

// --- WATCHERS ---

// --- METHODS ---
</script>

<style scoped lang="scss">
@use '@render/styles/variables' as *;

.field-group {
    &-title {
        border-radius: $border-radius-sm;
        background-color: RGBA(255, 255, 255, 0.1);
        padding: 0.5rem 0.75rem;
        font-weight: 600;
        font-size: 1.25rem;
    }
    &-content {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 0.25rem;
        border: 2px solid RGBA(255, 255, 255, 0.1);
        border-radius: $border-radius-sm;
        padding: 1rem;
        overflow: auto;
    }
}
</style>
