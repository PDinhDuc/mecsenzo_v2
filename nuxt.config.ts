import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  modules: [
    '@vesp/nuxt-fontawesome',
    '@pinia/nuxt'
  ],
  fontawesome: {
    component: 'fa',
    icons: {
      solid: ['bell','earth-asia','pen-to-square','eye','angles-right','angles-left'],
      brands: ['twitter'],
    },
  },
})