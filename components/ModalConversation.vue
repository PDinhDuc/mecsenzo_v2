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
        <form @submit.prevent="handleSubmitForm">
          <div>
            <div v-if="conversationBinding.type === 'group'">
              <FormField
                name="name"
                :label-field="$t('conversationModal.roomName')"
                :value-field="conversationBinding.name"
                rule="required|maximumLen:30"
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
                  (conversation && $t('profileModal.edit')) ||
                  $t('conversationModal.create')
                "
              ></Button>
              <Button
                color="#ff7200"
                variant="outline"
                size="large"
                :handle-click="closeModal"
                >{{ $t('profileModal.close') }}</Button
              >
            </div>
          </div>
        </form>
    </div>
  </div>
</template>

<script>
import FormField from './FormField.vue'
import Avatar from './Avatar.vue'
import Button from './Button.vue'
export default {
  components: { FormField, Avatar, Button },

  props: {
    conversation: {
      type: Object,
      default: () => null,
    },
  },

  emits: ['closeModal', 'clear-percent-upload', 'set-percent-upload'],

  data() {
    return {
      fileAvatar: null,
      avatar: null,
      isShowChooseColor: false,
      colorsConversation: "#ebebeb",
      conversationBinding: null,
    }
  }
}
</script>
