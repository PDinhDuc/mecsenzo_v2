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
    '@pinia/nuxt',
    '@nuxtjs/i18n'
  ],
  i18n: {
    langDir: '\locales',
    defaultLocale: 'vi',
    locales: [
      { code: 'en', file: 'en.js', name: 'English' },
      { code: 'vi', file: 'vi.js', name: 'Tiếng Việt' },
    ]
  },
  fontawesome: {
    component: 'fa',
    icons: {
      solid: ['bell','earth-asia','pen-to-square','eye','angles-right','angles-left'],
      brands: ['twitter'],
    },
  },
  ssr: false,
})