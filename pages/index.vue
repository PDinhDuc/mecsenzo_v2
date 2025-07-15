<template>
  <div
    :class="`flex-1 flex justify-center items-center ml-0 md:ml-4 text-gray-500 bg-white shadow-2xl rounded-[20px] 
    p-[36px]  md:pl-[36px] overflow-x-hidden dark:bg-dark_bg_light pl-[100px]`"
  >
    Chưa có cuộc trò chuyện hiện tại
    <div
      :class="`noSelect cursor-pointer absolute w-[50px] 
      h-[50px] top-[30%] left-[0] flex sm:hidden
      justify-center items-center bg-white rounded-full 
      text-dark_primary shadow-xl hover:bg-dark_primary hover:text-white
      transition-all
      translate-x-[70px]`"
      @click="handleToggleSidebarMobile"
    >
      <fa v-if="!getShowSidebarConversation" icon="angles-right" class="ml-3" />
      <fa v-else icon="angles-left" class="ml-3" />
    </div>
  </div>
</template>

<script>

export default {
  name: 'IndexPage',
  layout: 'chat',
  data(){
    return {
      getShowSidebarConversation: true
    }
  },

  head() {
    return {
      title: 'Mecsenzo',
    }
  },

  methods: {
    handleToggleSidebarMobile() {
      console.log('toggle');
      
    },
  },
}
</script>
