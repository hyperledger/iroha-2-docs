<script lang="ts">
let idCounter = 0

function useTabIndex(count: Ref<number>) {
  const tab = ref(0)

  const normalize = (value: number) => {
    const normalized = value % count.value
    const positive = normalized < 0 ? count.value + normalized : normalized
    return positive
  }

  return computed({
    get: () => normalize(tab.value),
    set: (value) => {
      tab.value = normalize(value)
    },
  })
}
</script>

<script setup lang="ts">
import { computed, Ref, ref, shallowRef, toRef, watchEffect, ComponentPublicInstance } from 'vue'
import invariant from 'tiny-invariant'
import CodeGroupTab from './CodeGroupTab.vue'

const props = defineProps<{
  blocks: number
  langs?: Record<number, string>
}>()

const tabpanelId = `code-group-tabpanel-${idCounter++}`

const computedTabs = computed(() =>
  Array.from({ length: props.blocks }, (v, i) => ({
    idx: i,
    lang: props.langs?.[i],
  })),
)

const tab = useTabIndex(toRef(props, 'blocks'))

const tabElems = shallowRef<ComponentPublicInstance[] | null>(null)
const enableTabsFocus = ref(false)

watchEffect(() => {
  if (enableTabsFocus.value) {
    const elem = tabElems.value?.at(tab.value)?.$el
    invariant(elem)
    if (document.activeElement !== elem) elem.focus()
  }
})

function onContainerFocus() {
  enableTabsFocus.value = true
}

function onTabFocus(idx: number) {
  enableTabsFocus.value = true
  tab.value = idx
}

function onTabBlur() {
  enableTabsFocus.value = false
}
</script>

<template>
  <div class="code-group my-4 rounded-lg">
    <div
      class="px-4 pt-2 space-x-2"
      role="tablist"
      aria-label="Code group"
      :tabindex="enableTabsFocus ? -1 : 0"
      @focus="onContainerFocus"
      @keydown.arrow-left="tab--"
      @keydown.arrow-right="tab++"
    >
      <CodeGroupTab
        v-for="{ idx, lang } in computedTabs"
        ref="tabElems"
        :key="idx"
        :selected="tab === idx"
        :controls="tabpanelId"
        :focus-active="enableTabsFocus"
        :lang="lang"
        @click="tab = idx"
        @focus="onTabFocus(idx)"
        @blur="onTabBlur()"
      >
        <slot :name="`block-${idx}-title`">
          <template v-if="lang">
            {{ lang }}
          </template>
          <template v-else>
            &gt;block-{{ idx }}&lt;
          </template>
        </slot>
      </CodeGroupTab>
    </div>

    <hr class="code-group__divider">

    <div
      :id="tabpanelId"
      role="tabpanel"
      aria-label="Code group"
    >
      <slot :name="`block-${tab}`" />
    </div>
  </div>
</template>

<style lang="scss">
.code-group {
  // shiki's "github" theme background
  background-color: rgb(34, 39, 46);

  hr {
    border-color: rgba(235, 235, 235, 0.28);
    margin: 0;
  }

  div[class*='language-'] {
    margin: 0;
  }
}
</style>
