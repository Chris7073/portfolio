<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { PanelLeft } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useSidebar } from './utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const { toggleSidebar, state } = useSidebar()
</script>

<template>
  <Button data-sidebar="trigger" data-slot="sidebar-trigger" variant="ghost" size="icon"
    class="bg-transparent rounded-full text-slate-500 hover:text-blue-600 hover:bg-blue-100/50 dark:text-slate-400 dark:hover:text-sky-400 dark:hover:bg-slate-800 transition-colors duration-300 text-xl"
    @click="toggleSidebar">
    <Icon :name="state === 'collapsed' ? 'lucide:panel-left-open' : 'lucide:panel-left-close'" />
    <span class="sr-only">Toggle Sidebar</span>
  </Button>
</template>
