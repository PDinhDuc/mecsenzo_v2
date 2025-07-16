<template>
  <div
    v-if="messageVideoCall && messageVideoCall.status !== 'end'"
    class="relative h-[100vh] overflow-hidden"
  >
    <div class="relative flex h-full overflow-hidden">
      <div
        ref="containerVideo"
        class="flex w-full h-full translate-x-[-100%]"
      ></div>
      <button
        ref="preBtn"
        class="w-[50px] h-[50px] absolute top-[50%] translate-y-[-50%] left-[4px] rounded-full border border-white text-white text-[1.2rem]"
        @click="handlePreVideo"
      >
        <fa icon="chevron-left" />
      </button>
      <button
        ref="nextBtn"
        class="w-[50px] h-[50px] absolute top-[50%] translate-y-[-50%] right-[4px] rounded-full border border-white text-white text-[1.2rem]"
        @click="handleNextVideo"
      >
        <fa icon="chevron-right" />
      </button>
    </div>
    <div
      ref="containerMyVideo"
      class="absolute bottom-[100px] right-[20px] w-[280px] h-[150px] border border-dark_primary rounded-[20px]"
    ></div>
    <div
      class="absolute bottom-[100px] right-0 w-full flex justify-center z-[10000]"
    >
      <button
        class="w-[68px] h-[68px] rounded-full bg-danger text-[1.2rem] text-white"
        @click="handleOutRoomVideoCall"
      >
        <fa icon="phone-slash" />
      </button>
    </div>
  </div>
  <div v-else class="relative h-[100vh] overflow-hidden">
    <div
      class="flex flex-col justify-center items-center h-full overflow-hidden"
    >
      <p class="text-[#888] text-[1.2rem] mt-4 font-light">
        {{ $t('modalCallVideo.videoCallEnd') }}
      </p>
      <button
        class="w-[68px] h-[68px] rounded-full bg-danger text-[1.2rem] text-white mt-4"
        @click="goBackHomePage"
      >
        <fa icon="phone-slash" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { serverTimestamp } from '@firebase/firestore'
import { getMessageRealtime, updateMessageVideoCall } from '~/=api/message.api'
import { getConversationById, updateConversation } from '~/api/conversation'
import { getUsersByEmails, updateUser } from '~/api/user.api'
import stringee from '~/api/stringee'

// Nuxt utilities
const { $t, localePath } = useI18n()
const router = useRouter()
const route = useRoute()

// Define layout and middleware
definePageMeta({
  layout: 'auth',
  middleware: ['check-auth', 'auth-required'],
})

// Reactive state
const messageVideoCall = ref(null)
const conversationOfMessage = ref(null)
const client = ref(null)
const userToken = ref(null)
const roomToken = ref(null)
const currentVideo = ref(0)
const containerVideo = ref(null)
const containerMyVideo = ref(null)
const preBtn = ref(null)
const nextBtn = ref(null)
const account = useState('account', () => null)

// Computed properties
const getCountVideoPartner = computed(() => {
  return containerVideo.value?.childElementCount || 0
})

// Watchers
watch(currentVideo, () => {
  displayVideoPartner()
  if (currentVideo.value === getCountVideoPartner.value - 1) {
    if (nextBtn.value) nextBtn.value.disabled = true
  } else if (currentVideo.value === 0) {
    if (preBtn.value) preBtn.value.disabled = true
  } else {
    if (nextBtn.value) nextBtn.value.disabled = false
    if (preBtn.value) preBtn.value.disabled = false
  }
})

watch(
  messageVideoCall,
  async (newValue) => {
    if (newValue) {
      conversationOfMessage.value = await getConversationById(newValue.conversation)
      roomToken.value = await stringee.getRoomToken(newValue.content.roomId)
      await login()
      await publishVideo()
      displayVideoPartner()
    }
  },
  { deep: true }
)

// Methods
const setMessageVideoCall = (message) => {
  messageVideoCall.value = message
}

const login = async () => {
  const userId = (Math.random() * 10000).toFixed(0)
  userToken.value = await stringee.getUserToken(userId)
  // eslint-disable-next-line no-undef
  client.value = new StringeeClient()
  client.value.connect(userToken.value)

  return new Promise((resolve) => {
    client.value.on('authen', (result) => resolve(result))
  })
}

const publishVideo = async () => {
  // eslint-disable-next-line no-undef
  const localTrack = await StringeeVideo.createLocalVideoTrack(client.value, {
    audio: true,
    video: true,
    videoDimensions: { width: 640, height: 360 },
  })

  const videoElement = localTrack.attach()
  if (containerMyVideo.value) {
    containerMyVideo.value.appendChild(videoElement)
  }

  // eslint-disable-next-line no-undef
  const roomData = await StringeeVideo.joinRoom(client.value, roomToken.value)
  const room = roomData.room
  room.clearAllOnMethos()

  room.on('addtrack', async (event) => {
    const trackInfo = event.info.track
    if (trackInfo.serverId === localTrack.serverId) return
    await subscribeTrack(trackInfo, room, containerVideo.value)
  })

  room.on('removetrack', async (event) => {
    if (!event.track) return
    const elements = event.track.detach()
    elements.forEach((e) => e.parentElement.remove())
    if (conversationOfMessage.value.type === 'individual') {
      await handleOutRoomVideoCall()
    }
  })

  const listUserPublishUnique = []
  const listTrackInfoUnique = []
  roomData.listTracksInfo.forEach((trackInfo) => {
    if (!listUserPublishUnique.includes(trackInfo.userPublish)) {
      listTrackInfoUnique.push(trackInfo)
      listUserPublishUnique.push(trackInfo.userPublish)
    }
  })

  roomData.listTracksInfo.forEach((trackInfo) =>
    subscribeTrack(trackInfo, room, containerVideo.value)
  )

  room.publish(localTrack)
}

const subscribeTrack = async (trackInfo, room, container) => {
  const track = await room.subscribe(trackInfo.serverId)
  track.on('ready', () => {
    const elVideo = track.attach()
    const newContainerVideoEl = document.createElement('div')
    newContainerVideoEl.classList.add('container-video-item')
    newContainerVideoEl.appendChild(elVideo)
    container.appendChild(newContainerVideoEl)
  })
}

const handleOutRoomVideoCall = async () => {
  const userOfConversation = await getUsersByEmails(conversationOfMessage.value.member)
  await Promise.all(
    userOfConversation.map((user) => updateUser({ ...user, isFreeVideoCall: true }))
  )

  if (conversationOfMessage.value.type === 'individual') {
    await updateMessageVideoCall({
      ...messageVideoCall.value,
      status: 'end',
      timeEnd: serverTimestamp(),
    })
    goBackHomePage()
  } else {
    let newMessageVideoCall
    if (messageVideoCall.value.emailJoin.length === 1) {
      newMessageVideoCall = {
        ...messageVideoCall.value,
        emailJoin: messageVideoCall.value.emailJoin.filter(
          (email) => email !== account.value
        ),
        timeEnd: serverTimestamp(),
        status: 'end',
      }
    } else {
      newMessageVideoCall = {
        ...messageVideoCall.value,
        emailJoin: messageVideoCall.value.emailJoin.filter(
          (email) => email !== account.value
        ),
      }
    }

    await updateMessageVideoCall(newMessageVideoCall)
    await updateConversation({
      ...conversationOfMessage.value,
      lastMessage: newMessageVideoCall,
      timeEnd: serverTimestamp(),
      seen: [account.value],
    })
    goBackHomePage()
  }
}

const goBackHomePage = () => {
  router.push(localePath({ name: 'index' }))
  if (process.client) {
    window.location.reload(true)
  }
}

const displayVideoPartner = () => {
  if (containerVideo.value) {
    containerVideo.value.style.transform = `translateX(-${currentVideo.value * 100}%)`
  }
}

const handlePreVideo = () => {
  currentVideo.value--
}

const handleNextVideo = () => {
  currentVideo.value++
}

// Fetch message on mount
onMounted(() => {
  getMessageRealtime(route.params.id, setMessageVideoCall)
})
</script>

<style scoped>
.container-video-item {
  flex: 0 0 100%;
  height: 100%;
}
</style>