// nuxt.config.ts
// Non è più necessario importare 'tailwindcss' da '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  /**
   * CSS: Ho rimosso 'tailwind.css'. Il modulo @nuxtjs/tailwindcss lo gestisce automaticamente.
   * Il tuo file custom.css rimane giustamente qui.
   */
  css: ['~/assets/css/custom.css'],

  runtimeConfig: {
    MONGO_URI: process.env.MONGO_URI
  },

  /**
   * IL BLOCCO 'vite' È STATO RIMOSSO.
   * Non serve più per la configurazione di Tailwind quando si usa il modulo ufficiale.
   */

  ssr: true,

  /**
   * MODULES: Ho aggiunto '@nuxtjs/tailwindcss'.
   * L'ordine è importante: i moduli che dipendono da Tailwind (come shadcn) dovrebbero venire dopo.
   */
  modules: [
    '@nuxtjs/tailwindcss', // <-- Aggiunto e messo per primo
    'shadcn-nuxt',
    '@nuxt/icon',
    'nuxt-auth-utils',
  ],

  /**
   * TAILWINDCSS: Aggiunta la configurazione per abilitare il viewer.
   */
  /*   tailwindcss: {
      viewer: true,
    }, */

  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },

  app: {
    baseURL: '/',
    buildAssetsDir: '/_nuxt/'
  },
})