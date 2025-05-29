<script setup lang="ts">
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
</script>
<template>
  <div class="flex h-screen overflow-hidden">
    <SidebarProvider>
      <!-- Sidebar -->
      <DashSidebar />

      <!-- Contenuto principale -->
      <main class="flex-1 flex flex-col overflow-auto bg-gray-50/40">
        <SidebarTrigger />
        <div class="flex-1 overflow-auto px-4">
          <NuxtPage />
        </div>
      </main>
    </SidebarProvider>
  </div>
</template>