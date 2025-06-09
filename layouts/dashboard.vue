<script setup lang="ts">
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
</script>
<template>
  <div class="flex h-screen overflow-hidden">
    <SidebarProvider>
      <!-- Sidebar -->
      <DashSidebar />

      <!-- Contenuto principale -->
      <main class="flex-1 flex flex-col overflow-auto bg-slate-100 dark:bg-slate-800">

        <div class="bg-gray-50/80 w-full p-4 backdrop-blur-sm border-b border-gray-200/60 dark:bg-slate-900/80 dark:border-slate-500/60 shadow-sm">
          <div class="flex flex-row justify-between w-full">
            <SidebarTrigger />
            <ThemeSwitcher />
          </div>
        </div>
        <div class="flex-1 overflow-auto px-4 pt-4">
          <NuxtPage />
        </div>
      </main>
    </SidebarProvider>
  </div>
</template>