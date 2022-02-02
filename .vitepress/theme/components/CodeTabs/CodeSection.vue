<script setup lang="ts">
import { computed } from 'vue'
import { useTabBinding } from './api'

const props = defineProps<{
  label?: string
  lang: string
}>()

const label = computed(() => props.label ?? props.lang)

const { isActive } = useTabBinding({ label, lang: computed(() => props.lang) })
</script>

<template>
  <section
    class="code-tab"
    :active="isActive ? '' : null"
  >
    <slot />
  </section>
</template>

<style lang="scss">
.code-tab {
  display: none;

  &[active] {
    display: block;
  }
}
</style>
