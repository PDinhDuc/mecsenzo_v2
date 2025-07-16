<template>
  <div class="max-w-[1200px] h-[calc(100vh-100px)] m-auto relative top-[100px]">
    <TabSide :tab-items="tabItems" />
  </div>
</template>

<script setup>
import TabSide from '~/components/TabSide.vue'
import Invitation from '~/components/Invitation.vue'
import SearchFriend from '~/components/SearchFriend.vue'

// Nuxt utilities
const { $t } = useI18n()

// Define middleware
definePageMeta({
  middleware: ['check-auth', 'auth-required'],
})

// Define page metadata
useHead({
  title: computed(() => $t('title.addFriend')),
})

// Reactive tab items
const tabItems = computed(() => [
  {
    title: $t('addFriendTab.invitation'),
    component: Invitation,
  },
  {
    title: $t('addFriendTab.search'),
    component: SearchFriend,
  },
])
</script>