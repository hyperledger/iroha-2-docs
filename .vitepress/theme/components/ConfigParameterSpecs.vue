<script setup lang="ts">
import { computed } from 'vue'
import { computedEager } from '@vueuse/core'
import { withBase } from 'vitepress'
import { match, P } from 'ts-pattern'

const props = defineProps<{
  type: 'string' | 'number' | 'socket-addr' | 'duration' | 'bytes' | 'private-key' | 'multihash' | 'file-path'
  defaultValue?: string
  env?: boolean | string
}>()

function glossaryLink(text: string, id: string) {
  return { text, url: withBase(`/reference/config/glossary#${id}`) }
}

const typeModel = computed(() => {
  type Result = (string | { url: string; text: string })[]

  return match(props.type)
    .returnType<Result>()
    .with('string', () => ['String'])
    .with('number', () => ['Number'])
    .with('socket-addr', () => ['String, ', glossaryLink('Socket Address', 'type-socket-address')])
    .with('duration', () => ['String, ', glossaryLink('Duration', 'type-duration')])
    .with('bytes', () => ['String, ', glossaryLink('Bytes', 'type-bytes')])
    .with('private-key', () => ['Table, ', glossaryLink('Private Key', 'type-private-key')])
    .with('multihash', () => ['String, ', glossaryLink('Multihash', 'type-multihash')])
      .with('file-path', () => ['String, file path'])
    .exhaustive()
})
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>Type</th>
        <th v-if="env">Environment Alias</th>
        <th v-if="defaultValue">Default</th>
        <th v-else></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <template v-for="item in typeModel">
            <template v-if="typeof item === 'string'">{{ item }}</template>
            <a v-else :href="item.url">{{ item.text }}</a>
          </template>
        </td>
        <td v-if="env">
          <code v-if="typeof env === 'string'">{{ env }}</code>
          <slot name="env" v-else />
        </td>
        <td v-if="defaultValue">
          {{ defaultValue }}
        </td>
        <td v-else>
          <b>Required</b>
        </td>
      </tr>
    </tbody>
  </table>
</template>
