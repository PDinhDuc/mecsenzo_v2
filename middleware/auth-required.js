export default defineNuxtRouteMiddleware((to, from)=>{
  const store = useAccountStore()
  if(!store.getToken){
    return navigateTo('/login')
  }
})
