<template>
  <div class="relative w-[100vw] h-[100vh] overflow-hidden">
    <Intro />
    <div
      class="relative m-auto mt-[150px] w-[400px] md:w-[500px] shadow-xl p-10 rounded-[25px] bg-white animate-[fadeUp_0.5s_1_2s]"
    >
      <div class="flex justify-center mb-4">
        <h3
          class="text-dark_primary text-[1.6rem] md:text-[1.5rem] font-bold tracking-wider uppercase select-none"
        >
          Đăng nhập
        </h3>
      </div>
      <div class="flex justify-center my-3">
        <p ref="errorMsg" class="text-red-500 text-[1rem] hidden">Error</p>
      </div>
      <form @submit.prevent="onSubmitLogin">
        <div class="mb-6">
            <input
              id="exampleFormControlInput2"
              v-model="email"
              type="text"
              class="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border-b-[2px] border-solid border-gray-300 transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark_primary focus:outline-none"
              placeholder="Email"
            />
        </div>

        <div class="mb-6">
            <input
              id="exampleFormControlInput2"
              v-model="password"
              type="password"
              class="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border-b-[2px] border-solid border-gray-300 transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark_primary focus:outline-none"
              placeholder="Mật khẩu"
            />
        </div>

        <div class="text-center lg:text-left">
          <button
            type="submit"
            class="w-full inline-block px-7 py-3 bg-dark_primary text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:opacity-75 hover:shadow-lg focus:opacity-75 focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out"
          >
            Đăng nhập
          </button>
          <p class="text-sm font-semibold mt-2 pt-1 mb-0">
            Bạn chưa cho tài khoản?
            <nuxt-link
              :to="{
                path: `/register`,
                name: `register`,
              }"
              class="text-blue-600 hover:text-blue-700 focus:text-blue-700 transition duration-200 ease-in-out"
            >
              Đăng ký
            </nuxt-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useAccountStore } from '@/stores/account'

  definePageMeta({
    layout: 'auth'
  })

  const account = useAccountStore()
  const email = ref('')
  const password = ref('')
  const isLogin = ref(true)

  const onSubmitLogin = async function(){
    try {
      const payload = {
        email: email.value,
        password: password.value,
        isLogin: isLogin.value
      }
      
      account.authenticateUser(payload)
    } catch (e) {
      console.log(e);
      // this.$refs.errorMsg.classList.remove('hidden')
      // this.$refs.errorMsg.textContent = e.data.error.message
    }
  }
</script>
