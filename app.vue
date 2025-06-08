<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
import { SpeedInsights } from "@vercel/speed-insights/nuxt"
import { useTheme } from './composables/useTheme';

// 1. Usa il nostro nuovo composable
const { appliedTheme } = useTheme();

// 2. Usa `useHead` per applicare la classe all'elemento <html> in modo reattivo e SSR-safe
useHead({
  htmlAttrs: {
    // La classe sarà 'dark' o 'light' in base allo stato di `appliedTheme`
    class: () => appliedTheme.value
  }
})
</script>

<template>
  <DialogsGlobalDialog />
  <Toaster />

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>