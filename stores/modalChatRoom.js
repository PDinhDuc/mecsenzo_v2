
import { defineStore } from "pinia"

export const useModalChatRoomStore = defineStore('modalChatRoom',{

  state: ()=>({
    isShow: false,
    conversation: null
  }),

  actions: {
    closeModal(){
      this.isShow = false
    },
    openModal(){
      this.isShow = true
    },
    setConversation(conversation){
      this.conversation = conversation
    }
  },

  getters: {
    getIsShow: (state)=>state.isShow,
    getConversation: (state)=>state.conversation
  }

})
