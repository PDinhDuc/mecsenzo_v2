import { useAccountStore } from '~/stores/account'

export default defineNuxtRouteMiddleware((to, from) => {
  const store = useAccountStore()

  if (store.token) {
    return navigateTo('/')
  }
})