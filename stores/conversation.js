import { getUsersByEmails } from '~/api/user'

import { defineStore } from 'pinia'

export const useConversationStore = defineStore('conversation',{
  state: ()=>({
    currentMembers: [],
    currentConversation: {}
  }),

  actions: {
    async setCurrentMembers(members){
      const currentMembers = await getUsersByEmails(members)
      this.currentMembers = currentMembers
    }
  },

  getters: {
    getCurrentMembers: (state)=> state.currentMembers,
    getCurrentConversation: (state) => state.currentConversation
  }
})
