<template>
  <ChatSide />
</template>

<script setup>
import ChatSide from '~/components/ChatSide.vue'

// Define layout and middleware
definePageMeta({
  layout: 'default',
  middleware: ['check-auth', 'auth-required'],
})
</script>