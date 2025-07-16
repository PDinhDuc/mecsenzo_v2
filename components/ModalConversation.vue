<template>
  <div class="fixed top-0 left-0 bottom-0 right-0 overflow-hidden">
    <div class="w-full h-full bg-[rgba(0,0,0,0.5)]" @click="closeModal"></div>
    <div
      class="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[380px] min-h-[560px] sm:w-[480px] bg-white shadow-xl rounded-[25px] p-[32px] py-5 px-10"
    >
      <div class="py-2 border-b-2 border-b-[#212332]">
        <h3 class="text-[1.6rem] font-bold">
          {{ getHeadingModal }}
        </h3>
      </div>
      <Form v-slot="{ handleSubmit }" as="form" @submit="handleSubmit(handleSubmitForm)">
        <div>
          <div v-if="conversationBinding.type === 'group'">
            <FormField
              name="name"
              :label-field="$t('conversationModal.roomName')"
              :value-field="conversationBinding.name"
              :rules="{ required: true, max: 30 }"
              @onChangeField="handleChangeFiled"
            />
          </div>
          <div class="flex justify-between items-center w-full mt-4">
            <div class="flex items-center">
              <p class="text-[1.2rem] font-semibold text-dark_primary">
                {{ $t('conversationModal.color') }}
              </p>
              <div class="relative">
                <div
                  ref="btnColorConversation"
                  class="w-[26px] h-[26px] rounded-full cursor-pointer ml-[68px]"
                  :style="{ backgroundColor: conversationBinding.colorChat }"
                  @click="toggleChooseColor"
                ></div>
                <div
                  v-if="isShowChooseColor"
                  class="absolute grid grid-cols-5 gap-3 w-[200px] h-[100px] bg-white rounded-[20px] shadow-xl top-[100%] left-[100%] p-4"
                >
                  <button
                    v-for="(value, key) in colorsConversation"
                    ref="btnChooseColorItem"
                    :key="key"
                    :value="value"
                    class="btn-choose-color-item w-[26px] h-[26px] rounded-full cursor-pointer"
                    :style="{ backgroundColor: value }"
                    @click="selectColorConversation"
                  ></button>
                </div>
              </div>
            </div>
          </div>
          <div v-if="conversationBinding.type === 'group'" class="mt-[54px]">
            <FormField
              :label-field="$t('profileModal.avatar')"
              type-input="file"
              :value-field="avatar"
              @onChangeFile="handleChangeAvatar"
            />
            <div class="flex items-center justify-center">
              <Avatar
                :is-have-avatar="!!avatar"
                :src-image="
                  avatar ||
                  'https://vnn-imgs-a1.vgcloud.vn/image1.ictnews.vn/_Files/2020/03/17/trend-avatar-1.jpg'
                "
                :first-char="
                  conversationBinding && conversationBinding.name.charAt(0)
                "
                size="large"
              />
            </div>
          </div>
        </div>
        <div class="w-full flex justify-center">
          <div
            class="absolute bottom-[60px] mt-8 w-[350px] flex justify-between items-end h-[50px]"
          >
            <Button
              color="#ff7200"
              size="large"
              type="submit"
              :name-button="
                conversation ? $t('profileModal.edit') : $t('conversationModal.create')
              "
            />
            <Button
              color="#ff7200"
              variant="outline"
              size="large"
              :handle-click="closeModal"
            >
              {{ $t('profileModal.close') }}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
// import { useStore, useNuxtApp } from '#app'
import { Form } from 'vee-validate'
import FormField from '~/components/FormField.vue'
import Avatar from '~/components/Avatar.vue'
import Button from '~/components/Button.vue'
import { colorConversation } from '~/constants/colorConversation'
import { uploadImage } from '~/helper/FirebaseHelper'
import { createConversation, updateConversation } from '~/api/conversation'
import { useAccountStore } from '~/stores/account'
// Nuxt app context for i18n
const { $t } = useNuxtApp()

// Props
const props = defineProps({
  conversation: {
    type: Object,
    default: () => null,
  },
})

// Emits
const emit = defineEmits(['closeModal', 'clear-percent-upload', 'set-percent-upload'])

// Reactive state
const fileAvatar = ref(null)
const avatar = ref(null)
const isShowChooseColor = ref(false)
const colorsConversation = ref(colorConversation)
const conversationBinding = ref(null)
const btnColorConversation = ref(null)
const btnChooseColorItem = ref([])

// Computed properties
const currentEmail = computed(() => useAccountStore().getAccount)

const getHeadingModal = computed(() => {
  return props.conversation
    ? $t('conversationModal.headingEdit')
    : $t('conversationModal.headingCreate')
})

// Lifecycle hook
onMounted(() => {
  if (!props.conversation) {
    conversationBinding.value = {
      type: 'group',
      member: [],
      seen: [],
      isTyping: [],
      colorChat: '#0084ff',
      messages: [],
      thumb: null,
      name: '',
      accountHost: null,
    }
  } else {
    conversationBinding.value = { ...props.conversation }
    avatar.value = props.conversation.thumb
  }

  if (btnColorConversation.value) {
    btnColorConversation.value.style.backgroundColor = conversationBinding.value.colorChat
  }
})

// Methods
const closeModal = () => {
  emit('closeModal')
}

const handleChangeFiled = (newValue) => {
  const [fieldChange, value] = newValue
  conversationBinding.value[fieldChange] = value
}

const toggleChooseColor = () => {
  isShowChooseColor.value = !isShowChooseColor.value
  if (isShowChooseColor.value) {
    btnChooseColorItem.value.forEach((btn) => {
      btn.style.backgroundColor = btn.value
    })
  }
}

const closeChooseColor = () => {
  isShowChooseColor.value = false
}

const selectColorConversation = (e) => {
  conversationBinding.value.colorChat = e.target.value
  btnColorConversation.value.style.backgroundColor = conversationBinding.value.colorChat
  closeChooseColor()
}

const handleChangeAvatar = (fileImage) => {
  avatar.value = fileImage.preview
  fileAvatar.value = fileImage
}

const handleCreateConversation = () => {
  conversationBinding.value.accountHost = currentEmail.value
  conversationBinding.value.member = [currentEmail.value]
  createConversation(conversationBinding.value)
}

const handleUpdateConversation = () => {
  updateConversation(conversationBinding.value)
}

const handleImageUpdateCompleteCreateRoom = (urlAvatar) => {
  conversationBinding.value.thumb = urlAvatar
  handleCreateConversation()
  closeModal()
  clearPercentUploadAvatar()
}

const handleImageUpdateCompleteUpdateRoom = (urlAvatar) => {
  conversationBinding.value.thumb = urlAvatar
  handleUpdateConversation()
  closeModal()
  clearPercentUploadAvatar()
}

const handleSubmitForm = () => {
  if (fileAvatar.value) {
    if (!props.conversation) {
      uploadImage(
        `room-chat-thumb`,
        fileAvatar.value,
        handleImageUpdateCompleteCreateRoom,
        setPercentUploadAvatar
      )
    } else {
      uploadImage(
        `room-chat-thumb`,
        fileAvatar.value,
        handleImageUpdateCompleteUpdateRoom
      )
    }
  } else if (!props.conversation) {
    handleCreateConversation()
    closeModal()
  } else {
    handleUpdateConversation()
    closeModal()
  }
}

const setPercentUploadAvatar = (percent) => {
  emit('set-percent-upload', percent)
}

const clearPercentUploadAvatar = () => {
  emit('clear-percent-upload')
}
</script>