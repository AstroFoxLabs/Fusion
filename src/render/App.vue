<template>
    <div class="app">
        <div class="app-router-view">
            <RouterView />
        </div>
        <Modal></Modal>
        <Progress></Progress>
    </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import Modal from './components/core/Modal.vue';
import Progress from './components/feature/Progress.vue';
import { useSettingsStore } from './stores/settingsStore';

const settingsStore = useSettingsStore();



onMounted(async () => {
    await settingsStore.loadSettings();
});
</script>

<style lang="scss"></style>
