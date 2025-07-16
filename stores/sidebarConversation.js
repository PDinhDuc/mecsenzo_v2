import { defineStore } from "pinia"

export const useSidebarConversationStore = defineStore('sidebarConversation', {

  state: ()=>({
    isShow: false
  }),

  actions: {
    closeSidebar() {
      this.isShow = false
    },

    toggleSidebar(context) {
      this.isShow != state.isShow
    },
  },

  getters: {
    getIsShow: (state)=>state.isShow
  }
})