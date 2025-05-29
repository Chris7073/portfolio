<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
</script>
<template>
  <ClientOnly>
    <DialogsGlobalDialog></DialogsGlobalDialog>
    <Toaster/>
  </ClientOnly>

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

</template>