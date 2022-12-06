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
    <span>
      <component
        :is="maybeIcon"
        v-if="maybeIcon"
      />

      <slot />
    </span>
  </button>
</template>

<style lang="scss" scoped>
button {
  color: white;
  padding: 8px 12px;
  position: relative;
  border-radius: 2px;

  $active-bg: rgba(235, 235, 235, 0.1);

  & > span {
    border-radius: 2px;
    padding: 2px;
  }

  &:hover,
  &:focus,
  &:active {
    & > span {
      outline: 2px solid transparentize(white, 0.3);
    }
  }

  &:focus {
    outline: none;
  }

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    right: 2px;
    left: 2px;
    visibility: hidden;
    border-top: 3px solid white;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
  }

  &[aria-selected='true'] {
    &::before {
      visibility: visible;
    }
  }

  svg {
    font-size: 1.2em;
    display: inline-block;
    vertical-align: middle;
    margin-right: 6px;
  }
}
</style>
