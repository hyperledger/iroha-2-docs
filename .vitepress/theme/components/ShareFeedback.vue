<script setup lang="ts">
import { SButton, SModal } from '@soramitsu-ui/ui'
import { ref } from 'vue'
import { usePromise, wheneverFulfilled, wheneverRejected } from '@vue-kakuyaku/core'
import { mande } from 'mande'
import IconClose from './icons/IconClose.vue'
import IconFeedback from './icons/IconFeedback.vue'
import IconCheck from './icons/IconCheck.vue'

const props = defineProps<{
  feedbackUrl: string
}>()

const openModal = ref(false)

type FeedbackKind = (typeof KINDS)[number]

const KINDS = ['bug', 'suggestion', 'other'] as const
const KINDS_LABELS: Record<FeedbackKind, string> = {
  suggestion: 'Suggestion ✨',
  bug: 'Bug 🐞',
  other: 'Other',
}

const feedbackKind = ref<null | FeedbackKind>(null)
const feedbackText = ref('')
const contact = ref('')

const action = usePromise()
const success = ref(false)

wheneverFulfilled(action.state, () => {
  success.value = true
  feedbackText.value = contact.value = ''
})

wheneverRejected(action.state, (reason) => {
  console.error('Feedback rejection reason:', reason)
})

function onAfterClose() {
  success.value = false
}

function doSubmit() {
  const data = {
    kind: feedbackKind.value,
    feedback: feedbackText.value,
    contact: contact.value,
    location: window.location,
  }
  const api = mande(props.feedbackUrl)
  action.set(api.post(data))
}
</script>

<template>
  <SButton
    type="primary"
    size="sm"
    @click="openModal = true"
  >
    <template #icon>
      <IconFeedback class="-mb-2px" />
    </template>
    Share feedback
  </SButton>

  <SModal
    v-slot="api"
    v-model:show="openModal"
    described-by="share-feedback-description"
    @after-close="onAfterClose"
  >
    <div class="feedback-card shadow-lg flex flex-col">
      <div class="feedback-card_header flex items-center">
        <div
          :id="api.labelledBy"
          class="feedback-card_title flex-1"
        >
          Share feedback
        </div>

        <SButton
          size="sm"
          type="action"
          @click="api.close()"
        >
          <template #icon>
            <IconClose />
          </template>
        </SButton>
      </div>

      <template v-if="success">
        <div class="p-4 flex items-center space-x-4">
          <IconCheck class="text-3xl feedback-card_check" />
          <div>Thank you for sharing your feedback!</div>
        </div>

        <div class="flex flex-row-reverse p-4">
          <SButton @click="api.close()">
            Close
          </SButton>
        </div>
      </template>

      <div
        v-else
        class="flex-1 overflow-y-scroll"
        tabindex="-1"
      >
        <div class="p-4 space-y-4">
          <p
            id="share-feedback-description"
            class="text-sm"
          >
            Please take a moment to help us improve the Iroha 2 Documentation. We take your input very seriously.
          </p>

          <div>
            <fieldset class="space-y-1">
              <legend class="field-label">
                What kind of feedback?*
              </legend>

              <div
                v-for="value of KINDS"
                :key="value"
                class="flex space-x-2 items-center"
              >
                <input
                  :id="`feedback-kind-${value}`"
                  v-model="feedbackKind"
                  class="max-w-min"
                  :value="value"
                  type="radio"
                  name="feedback-kind"
                >
                <label
                  :for="`feedback-kind-${value}`"
                  class="flex-1 text-sm"
                >{{ KINDS_LABELS[value] }}</label>
              </div>
            </fieldset>
          </div>

          <div>
            <label
              for="feedback-input-text"
              class="field-label"
            >Feedback*</label>

            <textarea
              id="feedback-input-text"
              v-model="feedbackText"
              placeholder="What can we do to improve the overall documentation browsing experience?"
              rows="5"
            />
          </div>

          <div>
            <label
              for="feedback-input-contact"
              class="field-label"
            >
              <i>(optional)</i> Email address or any other way to contact you (Discord, Telegram)
            </label>

            <input
              id="feedback-input-contact"
              v-model="contact"
              placeholder="Contact information"
            >
          </div>
        </div>

        <div
          v-if="action.state.rejected"
          class="px-4 text-xs"
        >
          Unable to send feedback
        </div>

        <div class="flex p-4 items-center space-x-2">
          <div class="flex-1" />
          <SButton @click="api.close()">
            Cancel
          </SButton>
          <SButton
            type="primary"
            :disabled="!feedbackText || !feedbackKind"
            :loading="action.state.pending"
            @click="doSubmit"
          >
            Submit
          </SButton>
        </div>
      </div>
    </div>
  </SModal>
</template>

<style lang="scss" scoped>
.feedback-card {
  background: var(--vp-c-bg);
  border-radius: 8px;
  width: calc(100vw - 32px);
  max-width: 420px;
  max-height: calc(100vh - 32px);
  border: 1px solid var(--vp-c-border);

  &_header {
    border-bottom: 1px solid var(--vp-c-border);
    padding: 16px;
  }

  &_title {
    font-size: 16px;
    font-weight: bolder;
  }

  &_check {
    color: var(--vp-custom-block-tip-text);
  }
}

textarea,
input {
  font-family: var(--vp-font-family-base);
  background: var(--vp-c-bg-soft);
  font-size: 14px;
  border-radius: 4px;
  padding: 16px;
  width: 100%;

  &::placeholder {
    color: var(--vp-c-text-2) !important;
    opacity: 1;
  }
}

#share-feedback-description {
  color: var(--vp-c-text-2);
}

.field-label {
  font-size: 12px;
  font-weight: bolder;
  display: block;
  margin-bottom: 8px;
}
</style>
