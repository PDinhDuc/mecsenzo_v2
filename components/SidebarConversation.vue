<template>
  <div
    :class="[
      'relative container-sidebar w-[30%] h-full py-[36px] px-[20px] bg-white shadow-lg sm:shadow-2xl rounded-[20px] z-[50] dark:bg-dark_bg_light',
      getShowSidebarConversation ? 'translate-x-0' : 'translate-x-[-100px] sm:translate-x-0',
    ]"
  >
    <div class="relative w-full h-[48px]">
      <input
        type="text"
        class="appearance-none outline-none w-full h-full p-[20px] rounded-full bg-gray-200 focus:bg-white focus:shadow-lg transition-all duration-150 ease-in-out opacity-0 group-hover:opacity-100 text-[0.9rem] md:text-[1rem]"
        :placeholder="t('sidebarConversation.inputPlaceholder')"
        @input="handleChangeSearchKey"
      />
      <button class="absolute top-0 right-0 h-full w-[48px] flex justify-center items-center rounded-full bg-slate-200 md:bg-transparent transition-all">
        <fa icon="magnifying-glass" />
      </button>
    </div>

    <!-- Danh sách cuộc trò chuyện cá nhân -->
    <div
      class="container-conversation relative h-[36%] my-5 overflow-y-auto overflow-x-hidden"
      @scroll="(e) => handleScroll(e, handleLoadMoreIndividual)"
    >
      <div v-if="conversationIndividual">
        <NuxtLink
          v-for="conversation in conversationIndividual"
          :key="conversation.id"
          :to="{ path: '/', params: { id: conversation.id }, name: `id___${locale}` }"
          :class="[
            'h-[54px] mb-3 flex items-center cursor-pointer hover:bg-slate-200 hover:bg-[rgba(255,255,255,0.1)]',
            getClassBgCurrentConversation(conversation.id),
          ]"
          @click.native="() => handleSeenConversation(conversation)"
        >
          <div class="relative">
            <Avatar
              :is-have-avatar="!!conversation.partnerUser.avatar"
              :src-image="conversation.partnerUser.avatar"
              :first-char="conversation.partnerUser.fullName.charAt(0)"
            />
            <div
              :class="[
                'absolute w-[12px] h-[12px] rounded-full bottom-0 right-0',
                getClassIsOnline(conversation.partnerUser),
              ]"
            ></div>
          </div>
          <div class="conversation-content ml-4">
            <p
              :class="[
                'select-none truncate text-ellipsis max-w-[180px] md:max-w-[120px] lg:max-w-[180px] h-[1.4rem] dark:text-dark_text_strong',
                getClassNameNotSeen(conversation),
              ]"
            >
              {{ conversation.partnerUser.fullName }}
            </p>
            <p
              :class="[
                'select-none truncate text-ellipsis text-[0.9rem] max-w-[180px] md:max-w-[120px] lg:max-w-[180px] h-[1.4rem] dark:text-dark_text_light',
                getClassNewMsgNotSeen(conversation),
              ]"
            >
              <span v-if="getLastMessage(conversation).type === 'text'">
                {{ getLastMessage(conversation).content }}
              </span>
              <span v-else-if="getLastMessage(conversation).type === 'audio'">
                {{ t('sidebarConversation.lastMsgAudio') }}
              </span>
              <span v-else-if="getLastMessage(conversation).type === 'image'">
                {{ t('sidebarConversation.lastMsgImage') }}
              </span>
              <span v-else-if="getLastMessage(conversation).type === 'videoCall'">
                {{ t('sidebarConversation.lastMsgVideoCall') }}
              </span>
            </p>
          </div>
        </NuxtLink>
      </div>

      <div
        v-if="isShowLoaderIndividualConversation"
        class="h-[100px] w-full bg-transparent absolute top-0 left-0 flex justify-center items-center"
      >
        <LoaderSideConversation />
      </div>
    </div>
    <Separation />
    <div
      class="w-full h-[20px] flex justify-between items-center px-3"
    >
      <p class="heading-space text-[1.1rem] hidden dark:text-white">
        {{ t('sidebarConversation.spaces') }}
      </p>
      <button
        class="btn-add-space w-[36px] h-[36px] text-[1.1rem] text-success rounded-full bg-slate-200 md:bg-transparent hover:bg-slate-200 transition-colors"
        @click="emit('open-modal-add-space')"
      >
        <fa icon="plus" />
      </button>
    </div>

    <div
      class="container-conversation relative h-[36%] my-5 overflow-y-auto overflow-x-hidden"
      @scroll="(e) => handleScroll(e, handleLoadMoreSpaces)"
    >
      <NuxtLink
        v-for="conversation in conversationSpace"
        :key="conversation.id"
        :to="{ path: '/', params: { id: conversation.id }, name: `id___${locale}` }"
        :class="[
          'h-[54px] mb-3 flex items-center cursor-pointer hover:bg-slate-200 hover:bg-[rgba(255,255,255,0.1)]',
          getClassBgCurrentConversation(conversation.id),
        ]"
        @click.native="() => handleSeenConversation(conversation)"
      >
        <Avatar
          :is-have-avatar="!!conversation.thumb"
          :src-image="conversation.thumb"
          :first-char="conversation.name.charAt(0)"
        />
        <div class="conversation-content ml-4">
          <p
            :class="[
              'select-none truncate text-ellipsis max-w-[180px] md:max-w-[120px] lg:max-w-[180px] h-[1.4rem] dark:text-dark_text_strong',
              getClassNameNotSeen(conversation),
            ]"
          >
            {{ conversation.name }}
          </p>
          <p
            v-if="getLastMessage(conversation)"
            :class="[
              'select-none truncate text-ellipsis text-[0.9rem] max-w-[180px] md:max-w-[120px] lg:max-w-[180px] h-[1.4rem] dark:text-dark_text_light',
              getClassNewMsgNotSeen(conversation),
            ]"
          >
            <span v-if="getLastMessage(conversation).type === 'text'">
              {{ getLastMessage(conversation).content }}
            </span>
            <span v-else-if="getLastMessage(conversation).type === 'audio'">
              {{ t('sidebarConversation.lastMsgAudio') }}
            </span>
            <span v-else-if="getLastMessage(conversation).type === 'image'">
              {{ t('sidebarConversation.lastMsgImage') }}
            </span>
          </p>
        </div>
      </NuxtLink>

      <div
        v-if="isShowLoaderGroupConversation"
        class="h-[100px] w-full bg-transparent absolute top-0 left-0 flex justify-center items-center"
      >
        <LoaderSideConversation />
      </div>
    </div>
    <KeepAlive>
      <AsyncResultSearchConversation v-show="getKeySearch" />
    </KeepAlive>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { defineAsyncComponent, useAttrs } from 'vue'
import Avatar from './Avatar.vue'
import Separation from './Separation.vue'
import LoaderSideConversation from './LoaderSideConversation.vue'
import {
  getConversationsIndividual,
  getConversationsSpace,
  updateConversation,
} from '~/api/conversation'
import { mergeUseIndividualConversation } from '~/helper/conversation'
import { useAccountStore } from '~/stores/account'
import { useConversationStore } from '~/stores/conversation'
import { useSidebarConversationStore } from '~/stores/sidebarConversation'
import { useSearchSidebarConversationStore } from '~/stores/searchSidebarConversation'

const emit = defineEmits(['open-modal-add-space'])

// const store = useStore()
const { locale, t } = useI18n()

const getShowSidebarConversation = computed(() => useSidebarConversationStore().getIsShow )
const getKeySearch = computed(() => useSearchSidebarConversationStore().getKeySearch )
const getCurrentEmail = computed(() => useAccountStore().getAccount )

const conversationSpace = ref(null)
const conversationIndividual = ref(null)
const lastDocConversationsSpace = ref(null)
const lastDocConversationIndividual = ref(null)
const isShowLoaderIndividualConversation = ref(true)
const isShowLoaderGroupConversation = ref(true)

const getLastMessage = computed(()=>{
  return (conversation)=> conversation.lastMessage ? conversation.lastMessage : ''
})
const getClassNameNotSeen = computed(()=>{
  return (conversation)=>conversation.seen.includes(getCurrentEmail.value) ? '' : 'font-medium'
})
const getClassNewMsgNotSeen = computed(()=>{
  return (conversation)=>conversation.seen.includes(getCurrentEmail.value)
          ? 'text-gray-400'
          : 'text-dark_primary font-medium'
})
const getClassIsOnline = computed(()=>{
  return (partnerUser)=>partnerUser.isActive ? 'bg-success' : 'bg-gray-300'
})
const getCurrentConversationId = computed(()=>{
  const currentConversation = useConversationStore.getCurrentConversation
  return currentConversation ? currentConversation.id : null
})
const getClassBgCurrentConversation = computed(()=>{
  return (idConversation)=>idConversation === getCurrentConversationId.value
          ? 'bg-[#eaf3ff]'
          : ''
})

const AsyncResultSearchConversation = defineAsyncComponent(() =>
  import('@/components/ResultSearchConversation.vue')
)

const showModalAddSpace = ()=>{
  this.$emit('open-modal-add-space')
}

const compileDocsToConversation = (conversationSpaceDocs)=> {
  return conversationSpaceDocs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }))
}

const setConversationSpace = (conversationSpaceDocs)=> {
  const conversationSpacetmp = compileDocsToConversation(conversationSpaceDocs)
  conversationSpace.value = conversationSpacetmp
  const lengthDocs = conversationSpaceDocs.length
  lastDocConversationsSpace.value = conversationSpaceDocs[lengthDocs - 1]
  isShowLoaderGroupConversation.value = false
}

const loadMoreConversationSpace = (conversationSpaceDocs)=> {
  const conversationSpaceNew = compileDocsToConversation(conversationSpaceDocs)
  const lastDoc = conversationSpaceDocs[conversationSpaceDocs.length - 1]  
  if (lastDoc && lastDoc.id !== lastDocConversationsSpace?.value?.id) {
    lastDocConversationsSpace.value = lastDoc
    conversationSpace.value = [
      ...conversationSpace.value,
      ...conversationSpaceNew,
    ]
  }
}

const unsubscribeLoadMoreSpaces = getConversationsSpace(
  getCurrentEmail.value,
  loadMoreConversationSpace,
  lastDocConversationsSpace.value
)

const handleLoadMoreSpaces = ()=> {
  unsubscribeLoadMoreSpaces = getConversationsSpace(
  getCurrentEmail.value,
  loadMoreConversationSpace,
  lastDocConversationsSpace.value
  )
}

const handleScroll = (e, handleLoadMore)=> {
  if (
    Math.ceil(e.target.scrollTop) + e.target.clientHeight >=
    e.target.scrollHeight
  ) {
    handleLoadMore()
  }
}

const setConversationIndividual = async (conversationSpaceDocs) => {
  const conversationIndividualtmp = compileDocsToConversation(conversationSpaceDocs)

  await mergeUseIndividualConversation(
    conversationIndividualtmp,
    getCurrentEmail.value
  )

  conversationIndividual.value = conversationIndividual
  lastDocConversationIndividual.value = conversationSpaceDocs[conversationSpaceDocs.length - 1]
  isShowLoaderIndividualConversation.value = false
}

const unsubscribeGetIndividual = getConversationsIndividual(
  getCurrentEmail.value,
  setConversationIndividual,
  lastDocConversationIndividual.value
)
const unsubscribeGetSpaces = getConversationsSpace(
  getCurrentEmail.value,
  setConversationSpace,
  lastDocConversationsSpace.value
)

const loadMoreConversationIndividual = async (conversationIndividualDocs)=> {
  const conversationIndividualNew = compileDocsToConversation(conversationIndividualDocs)

  await mergeUseIndividualConversation(
    conversationIndividualNew,
    getCurrentEmail.value
  )

  const lastDoc =
    conversationIndividualDocs[conversationIndividualDocs.length - 1]

  if (lastDoc && lastDoc.id !== lastDocConversationIndividual.value.id) {
    lastDocConversationIndividual.value = lastDoc
    conversationIndividual.value = [
      ...conversationIndividual.value,
      ...conversationIndividualNew,
    ]
  }
}

const unsubscribeLoadMoreIndividual = getConversationsIndividual(
  getCurrentEmail.value,
  loadMoreConversationIndividual,
  lastDocConversationIndividual.value
)

const handleLoadMoreIndividual= ()=> {
  unsubscribeLoadMoreIndividual = getConversationsIndividual(
    getCurrentEmail.value,
    loadMoreConversationIndividual,
    lastDocConversationIndividual.value
  )
}

const handleChangeSearchKey = (e)=> {
  useSearchSidebarConversationStore().setKeySearch(e.target.value)
}

const handleSeenConversation = async (conversation)=> {
  const seenOfConversation = conversation?.seen
  const newSeenOfConversation = seenOfConversation.includes(getCurrentEmail.value)
    ? seenOfConversation
    : [...seenOfConversation, getCurrentEmail.value]

  await updateConversation({
    ...conversation,
    seen: newSeenOfConversation,
  })
}


onMounted(() => {
  unsubscribeGetIndividual()
  unsubscribeGetSpaces()
})

onBeforeUnmount(() => {
  unsubscribeGetSpaces()
  unsubscribeGetIndividual()
  unsubscribeLoadMoreSpaces()
  unsubscribeLoadMoreIndividual()
})


</script>

<style scoped>
.container-conversation > :last-child {
  margin-bottom: 0;
}

@media screen and (max-width: 767px) {
  .container-sidebar {
    position: absolute;
    width: 90px;
    height: 80vh;
    border-radius: 5px;
  }
  .container-sidebar:hover {
    width: 300px;
  }
  .container-sidebar:hover input {
    opacity: 1;
  }
  .container-sidebar:hover .heading-space {
    display: block;
  }
  .btn-add-space {
    position: absolute;
    left: 25px;
  }
  .container-sidebar:hover .btn-add-space {
    position: relative;
    left: 0;
  }
  .container-conversation {
    overflow-y: hidden;
  }
  .container-sidebar:hover .container-conversation {
    overflow-y: auto;
  }
  .conversation-content {
    display: none;
    max-width: 180px !important;
  }
  .container-sidebar:hover .conversation-content {
    display: block;
  }
}

@media screen and (min-width: 767px) {
  .container-sidebar input {
    opacity: 1;
  }

  .heading-space {
    display: block;
  }
}
</style>
