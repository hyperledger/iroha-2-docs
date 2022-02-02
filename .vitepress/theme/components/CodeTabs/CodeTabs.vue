<script setup lang="ts">
import { provide, ref, watch } from 'vue'
import { TABS_KEY, createTabsApi } from './api'
import { getLangLabel } from './labels'

const activeLang = ref(null)

const { api, tabs } = createTabsApi({ activeLang })
provide(TABS_KEY, api)

// applying "mandatory" mode
watch([activeLang, tabs], ([val, items]) => {
    if (!val && items.length) {
        ;[{ lang: activeLang.value }] = items
    }
})
</script>

<template>
    <div class="border border-solid border-gray-300 rounded-md">
        <div class="m-4 flex space-x-2">
            <span
                v-for="tab in tabs"
                :key="tab.lang"
                :class="['code-tabs__tab', { 'code-tabs__tab_active': tab.lang === activeLang }]"
                @click="activeLang = tab.lang"
            >
                {{ getLangLabel(tab.label) || tab.label }}
            </span>
        </div>

        <div class="m-4">
            <slot />
        </div>
    </div>
</template>

<style lang="scss">
.code-tabs {
    &__tab {
        @apply rounded-md  px-2 py-1;
        @apply border border-solid border-gray-300;
        cursor: pointer;

        &_active {
            // @apply bg-gray-50;
            color: var(--c-brand);
            // font-weight: bold;
        }
    }
}
</style>
