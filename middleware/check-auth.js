export default defineNuxtRouteMiddleware(async () => {
  const accountStore = useAccountStore()

  // Nếu đang chạy trên server, có thể truy cập request
  if (process.server) {
    const req = useRequestEvent()?.node?.req
    await accountStore.initAuth(req)
  } else {
    // Trên client, có thể dùng cookie hoặc localStorage nếu cần
    await accountStore.initAuth()
  }
})