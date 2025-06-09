<script setup lang="ts">

import { ChevronsUpDown, ChevronUp } from 'lucide-vue-next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
}
  from "@/components/ui/sidebar"
import UserDialog from './dialogs/userDialog.vue';

const { user } = useUserSession();
const route = useRoute()
const router = useRouter()
const activeItem = ref<string | null>(null)

const toggleItem = (title: string) => {
  activeItem.value = activeItem.value === title ? null : title
}

const items = [
  { title: "Home", url: "/dashboard/", icon: 'home' },
  {
    title: "Projects", url: "", icon: 'archive',
    child: [
      {
        title: "Projects List", url: "/dashboard/projects"
      },
      {
        title: " Categories", url: "/dashboard/projects/categories"
      },
    ]
  },
  {
    title: "Settings", url: "", icon: 'setting', child: [
      { title: "Website settings", url: "/dashboard/settings/website" },
      { title: "Landing settings", url: "/dashboard/settings/landing" },
      { title: "Navbar settings", url: "/dashboard/settings/navbar" }
    ]
  }
]

async function logoutUser() {
  try {
    await fetch('/api/auth/logout', { method: 'POST' })
    const { clear } = useUserSession()
    await clear()
    showToast("Logout effettuato con successo", "success")
    await navigateTo('/dashboard/login')
  } catch (error) {
    console.error("Errore durante il logout:", error)
    showToast("Errore durante il logout", "error")
  }
}

const dialog = useDialog();
function showUserModal() {
  dialog.open({
    body: UserDialog,
    title: user.value?.name,
    description: 'Here you can set-up your user'
  })
}
</script>

<template>
  <Sidebar side="left" variant="sidebar" class="bg-gray-50 dark:bg-slate-950 border-r dark:border-slate-800">

    <div
      class="flex justify-between items-center bg-gray-50/80 w-full p-4 backdrop-blur-sm border-b border-gray-200/60 dark:bg-slate-900/80 dark:border-slate-500/60 shadow-sm">
      <NuxtLink to="/dashboard">
        <span class="font-bold text-lg text-slate-800 dark:text-slate-100 tracking-wide">
          Dashboard
        </span>
      </NuxtLink>
      <NuxtLink to="/" target="_blank">
        <Button variant="ghost" size="icon" class="dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer">
          <Icon name="lucide:external-link" />
        </Button>
      </NuxtLink>
    </div>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in items" :key="item.title">

              <NuxtLink v-if="!item.child" :to="item.url">
                <SidebarMenuButton
                  :class="route.path === item.url
                    ? 'bg-blue-600/90 text-white hover:bg-blue-500 hover:text-white dark:bg-sky-600 dark:hover:bg-sky-500 dark:text-white'
                    : 'bg-gray-100 text-slate-700 hover:bg-gray-200 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800'">
                  <Icon :name="'uil:' + item.icon" />
                  <span>{{ item.title }}</span>
                </SidebarMenuButton>
              </NuxtLink>

              <div v-else>
                <SidebarMenuButton @click="toggleItem(item.title)"
                  class="flex justify-between items-center w-full bg-gray-100 hover:bg-gray-200/80 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800">
                  <div class="flex items-center gap-2">
                    <Icon :name="'uil:' + item.icon" />
                    <span>{{ item.title }}</span>
                  </div>
                  <ChevronsUpDown class="h-4 w-4" />
                </SidebarMenuButton>

                <div v-if="activeItem === item.title" class="ml-4 mt-1">
                  <SidebarMenuSub v-for="child_item in item.child" :key="child_item.title">
                    <SidebarMenuSubItem>
                      <NuxtLink :to="child_item.url">
                        <SidebarMenuSubButton
                          :class="route.path === child_item.url
                            ? 'bg-gray-200 text-slate-800 hover:bg-gray-300/80 dark:bg-slate-700 dark:text-white'
                            : 'bg-transparent text-slate-600 hover:bg-gray-200/80 dark:bg-transparent dark:text-slate-400 dark:hover:bg-slate-800'">
                          <Icon :name="`uil:${item.icon}`" />
                          {{ child_item.title }}
                        </SidebarMenuSubButton>
                      </NuxtLink>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </div>
              </div>

            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter class="border-t dark:border-slate-800 p-3">
      <SidebarMenu v-if="user" class="w-full">
        <SidebarMenuItem
          class="flex justify-between items-center gap-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-800 p-2">

          <div class="flex items-center gap-2 flex-grow min-w-0">
            <Avatar @click="showUserModal" shape="circle" size="sm" class="cursor-pointer bg-primary text-primary-foreground font-semibold">
              {{ user.name.charAt(0).toUpperCase() }}
            </Avatar>
            <div class="flex flex-col min-w-0">
              <span class="truncate text-sm font-semibold dark:text-slate-200">{{ user.name }}</span>
              <span class="truncate text-xs text-muted-foreground dark:text-slate-400">{{ user.mail }}</span>
            </div>
          </div>

          <Popover>
            <PopoverTrigger as-child>
              <Button size="icon"
                class="rounded-full cursor-pointer h-8 w-8 dark:text-slate-400 dark:hover:bg-slate-700" variant="ghost">
                <Icon name="uil:exit" class="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-[230px] p-3 bg-white dark:bg-slate-950 dark:border-slate-800" align="center"
              side="right">
              <div class="space-y-3">
                <p class="text-sm font-medium text-center dark:text-slate-200">Sei sicuro di voler uscire?</p>
                <Button @click="logoutUser" variant="destructive" class="w-full">
                  Logout
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </SidebarMenuItem>
      </SidebarMenu>
      <div class="pt-4 pb-2 text-center text-muted-foreground text-xs dark:text-slate-500">
        Chris 2025
      </div>
    </SidebarFooter>
  </Sidebar>
</template>