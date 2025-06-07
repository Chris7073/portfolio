<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
import { SpeedInsights } from "@vercel/speed-insights/nuxt"
import { Lit } from "litlyx-js"

onMounted(()=>{
  Lit.init("683f23017f61ebd3d8cdb16c");
})
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