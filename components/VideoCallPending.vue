<template>
  <div>
    <div
      v-if="lastMessageVideoCall"
      class="fixed top-0 left-0 bottom-0 right-0 overflow-hidden z-[1000]"
    >
      <div class="w-full h-full bg-[rgba(0,0,0,0.5)] flex justify-center items-center">
        <div v-if="infoVideoCall" class="w-[60%] h-[60%]">
          <div class="flex justify-center items-center h-[90%]">
            <div class="flex flex-col items-center">
              <div>
                <Avatar
                  :is-have-avatar="!!infoVideoCall.avatar"
                  :src-image="infoVideoCall.avatar"
                  :first-char="infoVideoCall.name && infoVideoCall.name.charAt(0)"
                  size="large"
                />
              </div>
              <div>
                <p class="select-none text-[1.2rem] text-white font-medium">
                  {{ infoVideoCall.name }}
                </p>
              </div>
            </div>
          </div>
          <div>
            <div class="m-auto w-[80%] md:w-[60%] flex justify-between">
              <button
                class="w-[68px] h-[68px] rounded-full bg-success text-[1.2rem] text-white"
                @click="acceptVideoCall"
              >
                <fa icon="phone" />
              </button>
              <button
                class="w-[68px] h-[68px] rounded-full bg-danger text-[1.2rem] text-white"
                @click="handleCancelVideoCall"
              >
                <fa icon="xmark" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { serverTimestamp } from '@firebase/firestore'
import {
  getConversationById,
  getConversationOfUserRealtime,
  updateConversation,
} from '~/api/conversation'
import { updateMessageVideoCall } from '../api/messeage.js'
import { getUserByEmail, getUserRealtimeByEmail, updateUser } from '~/api/user'
import { useAccountStore } from '~/stores/account.js'

const router = useRouter()

const currentUser = ref(null)
const allConversations = ref(null)
const lastMessageVideoCall = ref(null)
const infoVideoCall = ref(null)
let unsubGetUser = null
let unsubGetConversation = null

const getCurrentEmail = computed(() => useAccountStore().getAccount)

const setCurrentUser = (user) => {
  currentUser.value = user
}

const setAllConversations = (conversationsDoc) => {
  allConversations.value = conversationsDoc.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}

watch(allConversations, (newValue) => {
  if (newValue) {
    const lastMessages = newValue.map((c) => c.lastMessage)
    const exclude = JSON.parse(localStorage.getItem('excludeMessageVideoCall') || '[]')

    lastMessageVideoCall.value = lastMessages.find((msg) => {
      return (
        msg &&
        msg.type === 'videoCall' &&
        msg.status === 'pending' &&
        msg.user.email !== getCurrentEmail.value &&
        !exclude.includes(msg.id)
      )
    })
  }
})

watch(lastMessageVideoCall, async (msg) => {
  if (msg) {
    const conv = await getConversationById(msg.conversation)
    if (conv.type === 'individual') {
      const email = conv.member.find((e) => e !== getCurrentEmail.value)
      const user = await getUserByEmail(email)
      infoVideoCall.value = {
        name: user.fullName,
        avatar: user.avatar,
        conversation: conv,
      }
    } else {
      infoVideoCall.value = {
        name: conv.name,
        avatar: conv.thumb,
        conversation: conv,
      }
    }
  }
})

const updateConversationWhenSendMessage = async (message) => {
  const conv = await getConversationById(message.conversation)
  await updateConversation({
    ...conv,
    lastMessage: message,
    timeEnd: serverTimestamp(),
    seen: [getCurrentEmail.value],
  })
}

const handleCancelVideoCall = async () => {
  const user = await getUserByEmail(getCurrentEmail.value)
  await updateUser({ ...user, isFreeVideoCall: true })

  if (infoVideoCall.value.conversation.type === 'individual') {
    const newMsg = {
      ...lastMessageVideoCall.value,
      status: 'cancel',
    }
    await updateMessageVideoCall(newMsg)
    await updateConversationWhenSendMessage(newMsg)
  } else {
    const exclude = JSON.parse(localStorage.getItem('excludeMessageVideoCall') || '[]')
    localStorage.setItem(
      'excludeMessageVideoCall',
      JSON.stringify([...exclude, lastMessageVideoCall.value.id])
    )
    lastMessageVideoCall.value = null
  }
}

const acceptVideoCall = async () => {
  const isIndividual = infoVideoCall.value.conversation.type === 'individual'
  const newMsg = {
    ...lastMessageVideoCall.value,
    status: 'accept',
    timeStart: serverTimestamp(),
    emailJoin: [
      ...(lastMessageVideoCall.value.emailJoin || []),
      getCurrentEmail.value,
    ],
  }

  await updateMessageVideoCall(newMsg)
  await updateConversationWhenSendMessage(newMsg)

  router.push({
    path: '/video-chat',
    params: { id: lastMessageVideoCall.value.id },
  })
}

onMounted(async () => {
  unsubGetUser = await getUserRealtimeByEmail(getCurrentEmail.value, setCurrentUser)
  unsubGetConversation = getConversationOfUserRealtime(
    getCurrentEmail.value,
    setAllConversations,
    null
  )
})

onBeforeUnmount(() => {
  if (unsubGetUser) unsubGetUser()
  if (unsubGetConversation) unsubGetConversation()
})
</script>