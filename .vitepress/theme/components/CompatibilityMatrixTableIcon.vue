<script setup lang="ts">
import IconCheck from './icons/IconCheck.vue'
import IconCancelOutlineRounded from './icons/IconCancelOutlineRounded.vue'
import IconQuestionMarkRounded from './icons/IconQuestionMarkRounded.vue'
import { computed } from 'vue'

export type Status = 'ok' | 'failed' | 'no-data'

const props = defineProps<{
  status: Status
}>()

// eslint-disable-next-line vue/return-in-computed-property
const chosenComponent = computed(() => {
  switch (props.status) {
    case 'ok':
      return IconCheck
    case 'failed':
      return IconCancelOutlineRounded
    case 'no-data':
      return IconQuestionMarkRounded
  }
})
</script>

<template>
  <component
    :is="chosenComponent"
    :data-status="status"
    class="compat-matrix-table-icon"
  />
</template>

<style lang="scss">
svg.compat-matrix-table-icon {
  &[data-status='ok'] {
    color: var(--vp-c-green);
  }

  &[data-status='failed'] {
    color: var(--vp-c-red);
  }

  &[data-status='no-data'] {
    color: var(--vp-c-yellow);
  }
}
</style>
