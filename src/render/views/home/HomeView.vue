<template lang="html">
    <div class="home-view">
        <LayoutTop @on-open-settings="settingsOpen = !settingsOpen" />
        <SettingsWindow v-if="settingsOpen" @on-close="settingsOpen = false" />
        <div class="home-view-content">
            <FusionOperatorList v-if="fusionStore.fusionElements.length > 0" />
        </div>
    </div>
</template>

<script setup lang="ts">
import FusionOperatorList from '@render/components/feature/FusionOperatorList.vue';
import LayoutTop from '@render/components/layout/LayoutTop.vue';
import { useFusionStore } from '@render/stores/fusionStore';
import { ref } from 'vue';
import SettingsWindow from '@render/views/home/components/SettingsWindow.vue';

// --- PROPS & EMITS ---

// --- STORES ---

const fusionStore = useFusionStore();

// --- STATES ---

const settingsOpen = ref<boolean>(false);

// --- COMPUTED ---

// --- WATCHERS ---

// --- METHODS ---
</script>

<style scoped lang="scss"></style>
