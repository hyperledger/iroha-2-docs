<script lang="ts">
import BashIconUrl from '../icons/Bash.svg?url'
import PythonIconUrl from '../icons/Python.svg?url'
import RustIconUrl from '../icons/Rust.svg?url'
import JavaIconUrl from '../icons/Java.svg?url'
import JavaScriptIconUrl from '../icons/JavaScript.svg?url'
import TypeScriptIconUrl from '../icons/TypeScript.svg?url'

const langIconURLs = {
  'rust': RustIconUrl,
  'javascript': JavaScriptIconUrl,
  'typescript': TypeScriptIconUrl,
  'java': JavaIconUrl,
  'python': PythonIconUrl,
  'py': PythonIconUrl,
  'sh': BashIconUrl,
  'zsh': BashIconUrl,
  'bash': BashIconUrl,
  'shell': BashIconUrl,
  'shellscript': BashIconUrl
}
const xScrollVal = 20
const yScrollVal = 20

export default {
  name: "SnippetTabs",
  props: {
  },
  data() {
    return {
      tabs: [],
      tab_names: {},
      active_tab: '',
      // Touch
      touch_orig_x: undefined
    }
  },
  mounted: function () {
    this.setupTabs()
    this.selectFirstTab()
  },
  methods: {
    // Returns a universal tab ID for a given tab with a given lang
    getTabId: function(sp) {
        return sp['data-name'] + '__' + sp['data-lang']
    },
    setupTabs: function() {
        let self = this
        this.tabs = this.$slots.default().map(slotEl => {
            return self.getTabId(slotEl.props)
        });
        this.tab_names = Object.assign(
            {}, ...this.$slots.default().map((slotEl) => {
                const tabKey = self.getTabId(slotEl.props)
                return ({
                    [tabKey]: slotEl.props['data-name']
                })
            })
        );
        this.tab_icons = Object.assign(
            {}, ...this.$slots.default().map((slotEl) => {
                const tabKey = self.getTabId(slotEl.props)
                const tabLang = slotEl.props['data-lang'].toLowerCase()
                return ({
                    [tabKey]: langIconURLs[tabLang]
                })
            })
        );
    },
    changeTab: function(tabName) {
        let self = this
        // Cache DOM slots, containing the code snippets / 
        // tab contents
        const slots = this.$slots.default()
        // Change an active tab marker
        this.active_tab = tabName;
        // Hide all open tabs
        slots.map(slotEl => {
            slotEl.el.classList.remove('active');
        });
        // Change an active tab content
        for (let slotId = 0; slotId < slots.length; slotId++) {
            const slotEl = slots[slotId];
            if (tabName == self.getTabId(slotEl.props)) slotEl.el.classList.add('active');
        }
    },
    selectFirstTab: function() {
        this.changeTab(this.tabs[0])
    },
    handleMousewheel: function(e) {
        let scrollVal = 0;
        if (e.deltaX) {
            if (e.deltaX > 0) scrollVal = xScrollVal
            else scrollVal = -xScrollVal
        }
        else if (e.deltaY) {
            if (e.deltaY > 0) scrollVal = yScrollVal
            else scrollVal = -yScrollVal
        }
        this.$refs.tabs.scrollBy(scrollVal, 0);
    },
    handleTouchmove: function(e) {
        if (this.touch_orig_x === undefined) {}
        else {
            let delta = this.touch_orig_x - e.touches[0].pageX
            this.$refs.tabs.scrollBy(delta, 0);
        }
        this.touch_orig_x = e.touches[0].pageX
    }
  }
}
</script>

<template>
  <div
    class="snippet_container"
    @wheel.stop="function() {}"
  >
    <!-- Tabs -->
    <div
      ref="tabs"
      class="tabs"
      @wheel.prevent="handleMousewheel"
    >
      <div
        v-for="tab in tabs"
        :key="tab"
        :class="{ active: tab==active_tab, tab_pill: true }"
        @wheel.prevent="handleMousewheel"
        @touchmove="handleTouchmove"
        @click="changeTab(tab)"
      >
        <img
          :src="tab_icons[tab]"
          class="tab-icon"
        >
        <span v-text="tab_names[tab]" />
      </div>
    </div>
    <!-- Highlighted code -->
    <div class="snippets">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
$max-code-height: 20em;
$tab-font-height: 16px;

$common-bg: #f6f8fa;

$tabs-bg: #e4e4e7;
$tab-bg-hover: #dcdce0;
$tab-bg-active: #d4d4d8;

$tab-text-color: #121212;

$border-radius-common: 6px;

.snippet_container {
    // An outward style of the tab container
    background: $common-bg;
    padding: 0;
    border-radius: $border-radius-common;

    pre {
      position: relative;
      z-index: 2;
      margin: 0;
    
      max-height: $max-code-height;
      
      width: auto;
      overflow: auto;
      word-wrap: normal;
    
      padding: 1em;
    }

    .snippets pre code {
        text-indent: 0;
        padding: 0;
    }

    // Display only an active tab
    .tab_content:not(.active) {
        display: none;
    }

    // Tab container styling
    div.tabs {
        border-radius: $border-radius-common $border-radius-common calc($border-radius-common / 3) calc($border-radius-common / 3);
        position: relative;
        z-index: 1;
        white-space: nowrap;
        overflow: hidden;
        padding: 5px 4px 0px 4px;
        background: $tabs-bg;
    }

    div.tabs > {
        .tab_pill {
            padding: 0.25em 0.5em;
            line-height: 1.5em;
            user-select: none;
            background: $tabs-bg;
            display: inline-block;
            font-weight: 500;
            border-radius: $border-radius-common;
            margin: 4px 2px;
            // Cut the tab text on overflow
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            max-width: 24em;
            // Limit a tab width when not hovered
            max-width: 14em;
        }

        .tab_pill:hover {
            max-width: auto;
            background: $tab-bg-hover;
            color: $tab-text-color;
        }

        .tab_pill.active {
            background: $tab-bg-active;
        }

        .tab_pill > {
            span {
                margin-left: 0.5em;
            }
            
            img.tab-icon {
                height: calc($tab-font-height + 4px);
                vertical-align: -3.5px;
                display: inline-block;
            }
        }
    }
}
</style>
