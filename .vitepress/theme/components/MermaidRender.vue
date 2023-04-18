<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useParamScope, useTask } from '@vue-kakuyaku/core'
import { computedEager, templateRef, useIntersectionObserver } from '@vueuse/core'
import { useData } from 'vitepress'
import { renderSvg } from '../mermaid-render'

const props = defineProps<{ id: string; text: string }>()

const textDecoded = computed(() => decodeURIComponent(props.text))

const isVisibleOnce = ref(false)
useIntersectionObserver(templateRef('root'), ([{ isIntersecting }]) => {
  isVisibleOnce.value ||= isIntersecting
})

const { isDark } = useData()
const theme = computedEager<'dark' | 'light'>(() => (isDark.value ? 'dark' : 'light'))

const scope = useParamScope(
  () =>
    isVisibleOnce.value && {
      key: `${props.id}-${props.text}-${theme.value}`,
      payload: { id: props.id, text: textDecoded.value, theme: theme.value },
    },
  ({ payload: { id, text, theme } }) => {
    return useTask(() => renderSvg(id, text, { theme }), { immediate: true })
  },
)

const svg = computedEager<string | null>(() => scope.value?.expose.state.fulfilled?.value.svg ?? null)
</script>

<template>
  <pre ref="root" data-mermaid v-html="svg" />
</template>
