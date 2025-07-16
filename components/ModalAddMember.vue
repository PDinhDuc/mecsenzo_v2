<template>
  <div class="fixed top-0 left-0 bottom-0 right-0 overflow-hidden z-[1000]">
    <div class="w-full h-full bg-[rgba(0,0,0,0.5)]" @click="closeModal"></div>
    <div
      class="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[380px] min-h-[560px] sm:w-[480px] bg-white shadow-xl rounded-[25px] p-[32px] py-5 px-10"
    >
      <div class="py-2 border-b-2 border-b-[#212332]">
        <h3 class="text-[1.6rem] font-bold">
          {{ $t('addMemberModal.heading') }}
        </h3>
      </div>
      <div>
        <form class="mt-[36px]" @submit.prevent="handleSearchUser">
          <div class="relative h-[43px] rounded-full">
            <input
              ref="inputSearchName"
              v-model="inputSearchKey"
              v-focus
              type="text"
              class="appearance-none outline-none pl-[20px] py-[8px] pr-[calc(120px+12px)] w-full h-full rounded-full text-[1.1rem] border border-[#ff7200] focus:shadow-md focus:shadow-[#f69443]"
              :placeholder="$t('addFriendTab.searchTab.inputPlaceholder')"
            />
            <Button
              type="submit"
              name-button="Search"
              class="absolute right-0 top-0"
            />
          </div>
        </form>
        <div class="max-h-[350px] overflow-auto px-3 mt-[40px]">
          <div
            v-for="(user, index) in usersSearch"
            :key="index"
            class="flex h-[50px] w-full justify-between items-center mb-[40px]"
          >
            <div class="flex items-center">
              <Avatar
                :is-have-avatar="user && !!user.avatar"
                :src-image="user && user.avatar"
                :first-char="user && user.fullName.charAt(0)"
              />
              <p class="select-none text-[1.2rem] font-medium ml-3">
                {{ user && user.fullName }}
              </p>
            </div>
            <div>
              <div
                v-if="checkIsInRoom(user.email)"
                class="w-[40px] h-[40px] rounded-full bg-[#33b5e7] flex justify-center items-center text-white"
              >
                <fa icon="check" />
              </div>
              <button
                v-else
                class="w-[40px] h-[40px] rounded-full bg-success flex justify-center items-center text-white hover:opacity-[0.8] cursor-pointer"
                @click="handleAddMember(user.email)"
              >
                <fa icon="plus" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore, useNuxtApp } from '#app'
import { updateConversation } from '~/api/conversation'
import { getAllFriendOfUser } from '~/api/user.api'
import { isRightSearch } from '~/helper/conversation'
import Avatar from '~/components/Avatar.vue'
import Button from '~/components/Button.vue'

// Nuxt app context for i18n
const { $t } = useNuxtApp()
const store = useStore()

// Props
const props = defineProps({
  conversation: {
    type: Object,
    default: () => ({}),
  },
})

// Emits
const emit = defineEmits(['closeModal'])

// Reactive state
const inputSearchKey = ref('')
const usersSearch = ref(null)
const friendOfCurrentUser = ref(null)
const inputSearchName = ref(null)

// Computed properties
const currentEmail = computed(() => store.getters['account/getAccount'])

const checkIsInRoom = (email) => {
  return props.conversation.member.includes(email)
}

// Lifecycle hook
onMounted(async () => {
  friendOfCurrentUser.value = await getAllFriendOfUser(currentEmail.value)
})

// Methods
const closeModal = () => {
  emit('closeModal')
}

const handleSearchUser = () => {
  usersSearch.value = friendOfCurrentUser.value.filter(
    (user) =>
      isRightSearch(user.fullName, inputSearchKey.value) ||
      isRightSearch(user.email, inputSearchKey.value)
  )
}

const handleAddMember = (emailNewMember) => {
  updateConversation({
    ...props.conversation,
    member: [...props.conversation.member, emailNewMember],
  })
}
</script>