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
    body: Avatar,
    title: user.value?.name,
    description: 'Here you can set-up your user'
  })
}
</script>

<template>
  <Sidebar side="left" variant="sidebar">
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in items" :key="item.title">
              <NuxtLink v-if="!item.child" :to="item.url">
                <SidebarMenuButton
                  :class="route.path === item.url ? 'bg-blue-500/90 text-white hover:bg-blue-500 hover:text-white' : 'bg-gray-100 hover:bg-gray-200'">
                  <Icon :name="'uil:' + item.icon" />
                  <span>{{ item.title }}</span>
                </SidebarMenuButton>
              </NuxtLink>
              <div v-else>
                <SidebarMenuButton @click="toggleItem(item.title)"
                  class="flex justify-between items-center w-full bg-gray-100 hover:bg-gray-200">
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
                          :class="route.path === child_item.url ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-100 hover:bg-gray-200'">
                          <Icon :name="'uil:' + item.icon" />
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
    <SidebarFooter>

      <SidebarMenu v-if="user">
        <SidebarMenuItem
          class="p-4 flex justify-between gap-2 bg-gray-200 rounded-lg inset-shadow-sm inset-shadow-gray-300">
          <div @click="showUserModal" class="flex flex-row cursor-pointer gap-1.5">
            <Avatar shape="circle" class="bg-blue-500 text-white font-semibold">
              {{ user.name.charAt(0).toUpperCase() }}</Avatar>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-semibold">{{ user.name }}</span>
              <span class="truncate text-xs">{{ user.mail }}</span>
            </div>
          </div>


          <Popover>
            <PopoverTrigger>
              <Button size="icon" class="rounded-full" variant="outline">
                <Icon name="uil:exit" />
              </Button>
            </PopoverTrigger>
            <PopoverContent class="flex flex-col gap-2" align="end">
              <Label>Are you sure?</Label>
              <Button @click="logoutUser">
                Logout
              </Button>
            </PopoverContent>
          </Popover>
        </SidebarMenuItem>
      </SidebarMenu>
      <div class="text-center text-black/60 font-thin text-xs">Chris 2025</div>
    </SidebarFooter>
  </Sidebar>
</template>
