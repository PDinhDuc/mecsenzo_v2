<template>
  <div v-if="message">
    <div
      :id="message.id"
      :class="`flex items-end mt-3 
      ${isMyMessage(message) ? 'flex-row-reverse justify-start' : ''}`"
    >
      <Avatar
        v-if="!isMyMessage(message)"
        :is-have-avatar="!!message.user.avatar"
        :src-image="message.user.avatar"
        :first-char="message.user && message.user.fullName.charAt(0)"
        size="small"
        v-tooltip.top-start="{
          content: message.user && message.user.fullName,
          classes: 'tooltip tooltip--left',
        }"
      />
      <div
        :class="`max-w-[80%] md:max-w-[45%] rounded-[10px] peer flex flex-col 
        ${isMyMessage(message) ? 'items-end' : 'items-start'}`"
      >
        <a
          v-if="message.reply !== null"
          :href="`#${message.reply.id}`"
          :class="`ml-2 rounded-[10px] max-w-full 
                ${
                  message.reply.type === 'image'
                    ? 'flex'
                    : 'bg-[#f6f9fa] dark:bg-[rgba(255,255,255,0.1)]'
                }
                ${isMyMessage(message) ? 'flex justify-end' : ''}`"
        >
          <div v-if="message.reply.type === 'text'" class="p-2">
            <p
              class="text-[1rem] text-gray-500 max-w-full truncate dark:text-dark_text_light"
            >
              {{ message.reply.content }}
            </p>
          </div>
          <div v-else-if="message.reply.type === 'audio'" class="p-2">
            <p class="text-[1rem] text-gray-500 max-w-full truncate">
              {{ $t('chatSide.replyAudio') }}
            </p>
          </div>
          <div
            v-else-if="message.reply.type === 'image'"
            :class="`relative max-w-[50%]`"
          >
            <img
              :src="message.reply.content"
              alt="image message"
              class="rounded-[10px] cursor-pointer select-none noSelect"
            />
            <div
              class="absolute w-full h-full top-0 left-0 rounded-[10px] bg-[rgba(255,255,255,0.4)]"
            ></div>
          </div>
        </a>
        <div
          :class="`ml-2 rounded-[10px] max-w-full bg-[#e4e6eb] ${
            isMyMessage(message) ? getBgMessage : 'dark:bg-dark_bg_message'
          }`"
          v-tooltip.top-start="{
            content: getTooltipContent(message.timestamp),
            classes: 'tooltip tooltip--left',
          }"
        >
          <div v-if="message.type === 'text'" class="p-2">
            <p
              :class="`text-[1.1rem] truncate max-w-full ${
                isMyMessage(message)
                  ? 'text-white'
                  : 'text-[#333] dark:text-white'
              }`"
            >
              {{ message.content }}
            </p>
          </div>
          <div v-else-if="message.type === 'image'">
            <img
              :src="message.content"
              alt="image message"
              class="max-w-full rounded-[10px] cursor-pointer select-none noSelect"
              @click="handleShowImageDetail(message.content)"
            />
          </div>
          <div
            v-else-if="message.type === 'audio'"
            class="relative p-2 flex items-center"
          >
            <AudioDisplay
              v-if="!isMyMessage(message)"
              :url="message.content"
              class="!left-0 !top-0"
            />
            <AudioDisplay
              v-else
              :url="message.content"
              class="!left-0 !top-0"
              :is-color-white="true"
            />
          </div>
          <div v-if="message.type === 'videoCall'" class="p-2">
            <div
              class="w-full h-full flex flex-col justify-center items-center"
            >
              <p
                :class="`text-[1rem] truncate max-w-full font-semibold ${
                  isMyMessage(message) ? 'text-white' : 'text-[#333] dark:text-white'
                }`"
              >
                {{ $t('chatSide.videoCall') }}
              </p>
              <p
                v-if="message.status === 'cancel'"
                :class="`text-[1rem] truncate max-w-full ${
                  isMyMessage(message)
                    ? 'text-white'
                    : 'text-[#333] dark:text-white'
                }`"
              >
                {{ $t('chatSide.cancelVideo') }}
              </p>
              <div v-if="message.status === 'end'">
                <p
                  :class="`text-[1rem] truncate max-w-full ${
                    isMyMessage(message)
                      ? 'text-white'
                      : 'text-[#333] dark:text-white'
                  }`"
                >
                  <span class="hidden sm:inline-block md:hidden xl:inline-block"
                    >{{ $t('chatSide.endVideo') }} :</span
                  >
                  <span>{{ getTimeVideoCall(message) }}</span>
                </p>
              </div>
              <div
                v-if="
                  message.status === 'pending' && conversation.type === 'group'
                "
              >
                <button
                  class="bg-success px-2 py-3 text-white border-[20px] mt-1 mb-1"
                  @click="handleJoinVideoCall(message)"
                >
                  {{ $t('chatSide.joinVideoCall') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        :class="`relative hidden peer-hover:block before:content-['']
        before:absolute before:w-[14px] before:h-full hover:block 
        before:bg-transparent 
        ${
          isMyMessage(message)
            ? 'right-2 before:left-[100%]'
            : 'left-2 before:right-[100%]'
        }`"
      >
        <button
          class="h-[32px] w-[32px] rounded-full flex items-center justify-center hover:bg-slate-200 dark:hover:bg-[rgba(255,255,255,0.1)]"
          @click="handleSetReplyMessage(message)"
        >
          <fa icon="reply" class="dark:text-dark_text_light" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore, useRouter, useNuxtApp } from '#app'
import { serverTimestamp } from '@firebase/firestore'
import { updateMessageVideoCall } from '~/api/message.api'
import { calcDurationVideoCall, formatDateForMessage } from '~/helper/date'
import Avatar from '~/components/Avatar.vue'
import AudioDisplay from '~/components/AudioDisplay.vue'

// Nuxt app context for i18n and router
const { $t } = useNuxtApp()
const store = useStore()
const router = useRouter()

// Props
const props = defineProps({
  message: {
    type: Object,
    default: () => null,
  },
  conversation: {
    type: Object,
    default: () => null,
  },
})

// Emits
const emit = defineEmits(['set-reply', 'show-image-detail'])

// Computed properties
const currentEmail = computed(() => store.getters['account/getAccount'])

const isMyMessage = (message) => {
  return message.user.email === currentEmail.value
}

const getTooltipContent = (timestamp) => {
  return formatDateForMessage(timestamp)
}

const getBgMessage = computed(() => {
  return props.conversation
    ? `!bg-[${props.conversation.colorChat}]`
    : '!bg-[#0084ff]'
})

const getTimeVideoCall = (message) => {
  return calcDurationVideoCall(message.timeStart, message.timeEnd)
}

// Methods
const handleSetReplyMessage = (message) => {
  emit('set-reply', message)
}

const handleShowImageDetail = (srcImage) => {
  emit('show-image-detail', srcImage)
}

const handleJoinVideoCall = async (message) => {
  const newLastMessage = {
    ...props.message,
    emailJoin: [...props.message.emailJoin, currentEmail.value],
    timeStart: serverTimestamp(),
  }

  await updateMessageVideoCall(newLastMessage)

  router.push({
    name: `video-chat-id___${$t('locale')}`,
    params: { id: props.message.id },
  })
}
</script>