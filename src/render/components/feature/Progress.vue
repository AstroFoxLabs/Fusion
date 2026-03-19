<template lang="html">
    <Teleport to="body">
        <div class="progress" v-show="progressStore.progress > 0 && progressStore.progress < 100">
            <div class="progress-bar" :style="{ width: `${progressStore.progress}%` }"></div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { useProgressStore } from '@render/stores/progressStore';
// --- PROPS & EMITS ---

// --- STORES ---

const progressStore = useProgressStore();

// --- STATES ---

// --- COMPUTED ---

// --- WATCHERS ---

// --- METHODS ---
</script>

<style scoped lang="scss">
@use '@render/styles/variables' as *;

.progress {
    position: fixed;
    top: 0;
    left: 0;
    background-color: #ffffff45;
    width: 100%;
    height: 0.5rem;

    &-bar {
        transition: width 0.3s ease;
        background-color: $accent-500;
        height: 100%;
    }
}
</style>
