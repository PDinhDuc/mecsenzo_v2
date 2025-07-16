<template>
  <div
    class="relative m-auto mt-[100px] w-[400px] md:w-[500px] shadow-xl p-10 rounded-[25px] bg-white animate-[fadeUp_0.5s]"
  >
    <div class="flex justify-center mb-4">
      <h3
        class="text-dark_primary text-[1.6rem] md:text-[1.5rem] font-bold tracking-wider uppercase select-none"
      >
        {{ t('auth.register') }}
      </h3>
    </div>
    <Form @submit="onSubmit" v-slot="{ errors }">
      <div class="flex justify-center my-3">
        <p ref="errorMsg" class="text-red-500 text-[1rem] hidden">Error</p>
      </div>
      <div class="mb-6">
        <Field
          name="fullName"
          type="text"
          rules="required|max:30"
          v-model="fullName"
          class="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border-b-[2px] border-solid border-gray-300 transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark_primary focus:outline-none"
          :placeholder="t('auth.fullNamePlaceholder')"
        />
        <p class="text-red-500 text-[0.9rem] italic ml-4">
          {{ errors.fullName }}
        </p>
      </div>
      <div class="mb-6">
        <Field
          name="email"
          type="text"
          rules="required|emailRule"
          v-model="email"
          class="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border-b-[2px] border-solid border-gray-300 transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark_primary focus:outline-none"
          placeholder="Email"
        />
        <p class="text-red-500 text-[0.9rem] italic ml-4">
          {{ errors.email }}
        </p>
      </div>
      <div class="mb-6">
        <Field
          name="password"
          type="password"
          rules="required"
          v-model="password"
          class="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border-b-[2px] border-solid border-gray-300 transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark_primary focus:outline-none"
          :placeholder="t('auth.password')"
        />
        <p class="text-red-500 text-[0.9rem] italic ml-4">
          {{ errors.password }}
        </p>
      </div>
      <div class="mb-6">
        <Field
          name="rePassword"
          type="password"
          :rules="{ required: true, confirmed: '@password' }"
          v-model="rePassword"
          class="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border-b-[2px] border-solid border-gray-300 transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-dark_primary focus:outline-none"
          :placeholder="t('auth.rePasswordPlaceholder')"
        />
        <p class="text-red-500 text-[0.9rem] italic ml-4">
          {{ errors.rePassword }}
        </p>
      </div>
      <div class="text-center lg:text-left">
        <button
          type="submit"
          class="w-full inline-block px-7 py-3 bg-dark_primary text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:opacity-75 hover:shadow-lg focus:opacity-75 focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out"
        >
          {{ t('auth.register') }}
        </button>
        <p class="text-sm font-semibold mt-2 pt-1 mb-0">
          {{ t('auth.haveAccount') }}
          <NuxtLink
            :to="localePath({ name: 'login' })"
            class="text-blue-600 hover:text-blue-700 focus:text-blue-700 transition duration-200 ease-in-out"
          >
            {{ t('auth.login') }}
          </NuxtLink>
        </p>
      </div>
    </Form>
  </div>
</template>

<script setup>
import { Form, Field, defineRule } from 'vee-validate'
import { required, email as emailRule, max } from '@vee-validate/rules'
import { createUser, getUserByEmail, setActiveUser } from '~/api/user'

defineRule('required', required)
defineRule('emailRule', emailRule)
defineRule('max', max)
defineRule('confirmed', (value, [target]) => {
  return value === target ? true : 'Passwords do not match'
})

definePageMeta({
  layout: 'auth',
  middleware: 'auth-forbidden',
})

const email = ref('')
const password = ref('')
const rePassword = ref('')
const fullName = ref('')


import { useI18n } from 'vue-i18n'
import { useLocalePath } from '#i18n'

const { t } = useI18n()
const localePath = useLocalePath()

// Nuxt utilities
const router = useRouter()
// const { $t, localePath } = useI18n()
const userStore = useState('user', () => null)
const accountStore = useState('account', () => null)

// Submit handler
const onSubmit = async () => {
  try {
    // Authenticate user (adapt to your API endpoint)
    await $fetch('/api/authenticate', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
        isLogin: false,
      },
    })

    // Create user
    await createUser({
      fullName: fullName.value,
      email: email.value,
      avatar: null,
      address: null,
      age: null,
      isActive: true,
    })

    // Get user data
    const user = await getUserByEmail(email.value)

    // Safely handle localStorage in browser environment
    if (process.client) {
      localStorage.setItem('user', JSON.stringify(user))
    }

    // Update state
    userStore.value = user
    accountStore.value = email.value
    await setActiveUser(true)

    // Navigate to home page
    router.push(localePath({ name: 'index' }))
  } catch (e) {
    if (errorMsg.value) {
      errorMsg.value.classList.remove('hidden')
      errorMsg.value.textContent = e.data?.error?.message || 'An error occurred'
    }
  }
}
</script>