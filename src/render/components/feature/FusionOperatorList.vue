<template lang="html">
    <div class="fusion-operator-list">
        <FieldGroup class="fusion-operator-list-settings">
            <template #title>
                <span>Fusion Container Settings</span>
            </template>
            <Field label="Width (No affect on export)">
                <Slider :min="20" :max="80" :step="1" v-model="sliderValue" />
            </Field>
            <Field label="Image per Container">
                <InputField
                    label="Image per Container"
                    placeholder="Enter image count per container"
                    v-model.number="elementContainerCount"
                    type="number"
                />
            </Field>
        </FieldGroup>
        <div class="fusion-operator-list-container">
            <FusionOperator
                v-for="container in fusionStore.fusionContainers"
                :key="container.id"
                :container="container"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import InputField from '@render/components/core/InputField.vue';
import Slider from '@render/components/core/Slider.vue';
import { useFusionStore } from '@render/stores/fusionStore';
import type { FusionContainer } from '@shared/types';
import { computed, onMounted, ref, watch } from 'vue';
import Field from '../core/Field.vue';
import FieldGroup from '../core/FieldGroup.vue';
import FusionOperator from './FusionOperator.vue';

// --- PROPS & EMITS ---

// --- STORES ---

const fusionStore = useFusionStore();

// --- STATES ---

const sliderValue = ref<number>(45);
const elementContainerCount = ref<number>(2);

// --- COMPUTED ---

const fusionContainerWidth = computed(() => {
    return `${sliderValue.value}%`;
});

// --- WATCHERS ---

watch(
    [() => fusionStore.fusionElements, () => elementContainerCount.value],
    () => {
        updateContainers();
    },
    { deep: true },
);

const updateContainers = () => {
    const containers: FusionContainer[] = [];
    const elementCount = elementContainerCount.value; // -> 3 => 3 Images next to eachother

    for (let i = 0; i < fusionStore.fusionElements.length; i++) {
        if (containers.length <= Math.floor(i / elementCount) || containers.length === 0) {
            containers.push({
                id: crypto.randomUUID(),
                elements: [],
                name: `fusion-image-${crypto.randomUUID().slice(0, 5)}`,
            });
        }

        containers[Math.floor(i / elementCount)].elements.push(fusionStore.fusionElements[i]);
    }
    fusionStore.fusionContainers = containers;
};

onMounted(() => {
    updateContainers();
});

// --- METHODS ---
</script>

<style scoped lang="scss">
.fusion-operator-list {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1rem;

    &-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        vertical-align: middle;
        gap: 1rem;
        width: 100%;

        :deep(.fusion-operator) {
            width: v-bind(fusionContainerWidth);
        }
    }

    &-settings {
        margin-bottom: 1rem;
        width: 100%;
        max-width: 30rem;
    }
}
</style>
