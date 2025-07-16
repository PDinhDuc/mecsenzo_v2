<template>
  <div
    v-if="listMessageData"
    id="container-msg"
    ref="containerMsg"
    class="flex-1 overflow-y-auto p-2 overflow-hidden scroll-smooth"
    @scroll="onScrollContainerMessage"
  >
    <div class="h-[90%] flex flex-col-reverse justify-end">
      <div v-if="!listMessageData.listMessage">
        <LoaderMessage />
      </div>
      <ListMessageFooter
        :footer-list-message-data="listMessageData.footerData"
      />
      <div
        v-for="(message, index) in listMessageData.listMessage"
        :key="index"
        class="flex flex-col-reverse"
      >
        <Message
          :message="message"
          :conversation="listMessageData.conversation"
          @set-reply="handleSetReplyMessage"
          @show-image-detail="handleShowImageDetail"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import LoaderMessage from '~/components/LoaderMessage.vue'
import ListMessageFooter from '~/components/ListMessageFooter.vue'
import Message from '~/components/Message.vue'

// Props
const props = defineProps({
  listMessageData: {
    type: Object,
    default: () => null,
  },
})

// Emits
const emit = defineEmits([
  'list-msg:load-more-message',
  'list-msg:set-reply',
  'list-msg:show-image-detail',
])

// Reactive state
const isScrollToBottom = ref(true)
const containerMsg = ref(null)

// Watch for listMessageData changes to scroll to bottom
watch(
  () => props.listMessageData?.listMessage,
  () => {
    if (isScrollToBottom.value && containerMsg.value) {
      containerMsg.value.scrollTo({
        top: containerMsg.value.scrollHeight,
        behavior: 'smooth',
      })
    }
  },
  { deep: true }
)

// Methods
const onScrollContainerMessage = (e) => {
  if (e.target.scrollTop === 0) {
    emit('list-msg:load-more-message')
    isScrollToBottom.value = false
  }
}

const handleSetReplyMessage = (replyMessage) => {
  emit('list-msg:set-reply', replyMessage)
}

const handleShowImageDetail = (srcImage) => {
  emit('list-msg:show-image-detail', srcImage)
}
</script>

<style></style>