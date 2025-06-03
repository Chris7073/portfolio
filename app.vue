<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
import { SpeedInsights } from "@vercel/speed-insights/nuxt"
</script>
<template>
  <!-- <SpeedInsights/> -->
  <ClientOnly>
    <DialogsGlobalDialog></DialogsGlobalDialog>
    <Toaster/>
  </ClientOnly>

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

</template>