import tailwindcss from '@tailwindcss/vite'
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css', '~/assets/css/custom.css'],
  runtimeConfig: {
    MONGO_URI: process.env.MONGO_URI
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
ssr:false,
  modules: ['shadcn-nuxt', '@nuxt/icon', 'nuxt-auth-utils'],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },
  app:{
    baseURL:'/portfolio/',
    buildAssetsDir:'/_nuxt/'
  }
})