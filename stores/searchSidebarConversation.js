import {defineStore} from 'pinia'

export const useSearchSidebarConversationStore = defineStore('searchSidebarConversation',{

  state: ()=>({
    keySearch: '',
  }),

  actions: {
    setKeySearch(keySearch){
      this.keySearch = keySearch
    }
  },

  getters: {
    getKeySearch: (state)=> state.keySearch
  }
})
