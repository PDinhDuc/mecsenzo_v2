import Cookies from 'js-cookie'
import { defineStore } from 'pinia'

const firebaseAPIKey = 'AIzaSyCilhC7lUYvFJlxlO3wnkCl_KpvYckRomI'

export const useAccountStore = defineStore('account', {
  state: () => ({
    account: null,
    token: null
  }),
  
  actions: {
    async authenticateUser(payload) {
      try {
        let urlApi = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseAPIKey}`
        if (payload.isLogin) {
          urlApi = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseAPIKey}`
        }

        const result = await $fetch(urlApi, {
          method: 'POST',
          body: {
            email: payload.email,
            password: payload.password,
            returnSecureToken: true
          }
        })

        const token = result.idToken
        const tokenExpiration = new Date().getTime() + result.expiresIn * 1000
        const email = result.email

        if(process.client){
          localStorage.setItem('token', token)
          localStorage.setItem('tokenExpiration', tokenExpiration)
          localStorage.setItem('email', email)
        }

        Cookies.set('token', token)
        Cookies.set('tokenExpiration', tokenExpiration)
        Cookies.set('email', email)

        this.token = token
        this.account = email
        this.logoutTimer(result.expiresIn * 1000)
      
        return { success: true }

      } catch (e) {
        console.log(e);
        
        const message = e?.data?.error?.message || e.message || 'Đăng nhập thất bại'
        throw new Error(message)
      }
    },

    logoutTimer(duration) {
      setTimeout(() => {
        this.token = null
      }, duration)
    },

    initAuth(req) {
      let token, tokenExpiration, email

      if (req) {
        if (!req.headers.cookie) return false

        const cookieSplit = req.headers.cookie.split(';')

        const tokenKey = cookieSplit.find((c) => c.trim().startsWith('token='))
        const tokenExpirationKey = cookieSplit.find((c) =>
          c.trim().startsWith('tokenExpiration=')
        )
        const emailKey = cookieSplit.find((c) => c.trim().startsWith('email='))

        if (!tokenKey || !tokenExpirationKey) return false

        token = tokenKey.split('=')[1]
        tokenExpiration = tokenExpirationKey.split('=')[1]
        email = emailKey.split('=')[1]
      } else {
        token = localStorage.getItem('token')
        tokenExpiration = localStorage.getItem('tokenExpiration')
        email = localStorage.getItem('email')
      }

      if (new Date().getTime() > tokenExpiration || !token) return false

      this.logoutTimer(tokenExpiration - new Date().getTime())
      this.token = token
      this.account = email
    },

    clearAccount(context) {
      this.token = null
      this.account = null
      localStorage.removeItem('token')
      localStorage.removeItem('email')
      localStorage.removeItem('tokenExpiration')
      Cookies.remove('token')
      Cookies.remove('email')
      Cookies.remove('tokenExpiration')
    }
  },
  
  getters: {
    getAccount: (state) => state.account,
    getToken: (state) => state.token
  }
})