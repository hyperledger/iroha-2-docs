import { MaybeRef } from '@vueuse/core'
import { computed, inject, InjectionKey, onScopeDispose, reactive, readonly, Ref, unref, watch } from 'vue'

interface TabsApi {
    register: (tab: { label: MaybeRef<string>; lang: MaybeRef<string> }) => number
    unregister: (key: number) => void
    activeLang: Readonly<Ref<string | null>>
}

interface Tab {
    lang: string
    label: string
}

export const TABS_KEY: InjectionKey<TabsApi> = Symbol('tabs')

export function createTabsApi(params: { activeLang: Ref<string | null> }): {
    api: TabsApi
    tabs: Ref<Tab[]>
} {
    let key = 0
    const map = reactive(new Map<number, Tab>())

    const tabs = computed(() => [...map.values()])

    return {
        api: {
            register: (tab) => {
                const tabKey = key++
                map.set(tabKey, reactive(tab))
                return tabKey
            },
            unregister: (key) => {
                map.delete(key)
            },
            activeLang: readonly(params.activeLang),
        },
        tabs,
    }
}

export function useTabBinding(params: { label: MaybeRef<string>; lang: MaybeRef<string> }): { isActive: Ref<boolean> } {
    const api = inject(TABS_KEY)
    if (!api) throw new Error(`...`)

    const key = api.register(params)
    onScopeDispose(() => api.unregister(key))

    const isActive = computed<boolean>(() => unref(params.lang) === api.activeLang.value)

    return { isActive }
}
