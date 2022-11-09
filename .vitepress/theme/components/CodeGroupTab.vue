<script setup lang="ts">
import { computed } from 'vue'
import { tryFindIcon } from '../lang-icons'

const props = defineProps<{
  selected: boolean
  focusActive: boolean
  controls: string
  lang?: string
}>()

const maybeIcon = computed(() => props.lang && tryFindIcon(props.lang))
</script>

<template>
  <button
    :tabindex="focusActive && selected ? 0 : -1"
    type="button"
    role="tab"
    :aria-selected="selected"
    :aria-controls="controls"
  >
    <component
      :is="maybeIcon"
      v-if="maybeIcon"
    />

    <slot />
  </button>
</template>

<style lang="scss" scoped>
@use '../style/index';

button {
  color: white;
  padding: 4px 8px;
  position: relative;
  border-radius: 2px;

  $active-bg: rgba(235, 235, 235, 0.1);

  &:hover,
  &:focus,
  &:active {
    background: $active-bg;
  }

  &:focus {
    outline: 2px solid transparentize(white, 0.5);
  }

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    visibility: hidden;
    border-top: 3px solid index.$iroha-brand-light;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
  }

  &[aria-selected='true'] {
    &::before {
      visibility: visible;
    }
  }

  svg {
    display: inline-block;
    vertical-align: middle;
    margin-right: 4px;
  }
}
</style>
