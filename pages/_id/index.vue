<template>
  <ChatSide />
</template>

<script setup>
import ChatSide from '~/components/ChatSide.vue'

// Define layout and middleware
definePageMeta({
  layout: 'chat',
  middleware: ['check-auth', 'auth-required'],
})
</script>