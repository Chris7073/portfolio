<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
import { SpeedInsights } from "@vercel/speed-insights/nuxt"
import { Lit } from "litlyx-js"
const { data: websiteInfo } = await useFetch('/api/web-settings');

onMounted(() => {
  if (!websiteInfo.value) return
  Lit.init(websiteInfo.value.analytics);
})
</script>
<template>
  <!-- <SpeedInsights/> -->
  <ClientOnly>
    <DialogsGlobalDialog></DialogsGlobalDialog>
    <Toaster />
  </ClientOnly>

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

</template>