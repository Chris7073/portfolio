<script lang="ts" setup>
import { Lit } from "litlyx-js"
import { DialogsContatti } from '#components';
import ThemeSwitcher from "./themeSwitcher.vue";
const { data: websiteInfo } = useFetch('/api/web-settings')
const { data: socialLinks } = useFetch('/api/social-links-settings');

const { icons } = useSocialIcons();

function getIconName(iconId: number) {
  const found = icons.find(icon => icon.id === iconId);
  return found ? found.icon : 'uil:globe'; // oppure 'default-icon'
}

</script>

<template>
  <header
    class="bg-gray-50/80 w-full p-4 sticky top-0 backdrop-blur-sm border-b border-gray-200/60 dark:bg-slate-900/80 dark:border-slate-500/60 shadow-sm z-[1000]">
    <div class="container mx-auto flex justify-between items-center">

      <NuxtLink :title="websiteInfo?.name" to="/">
        <span class="uppercase font-semibold text-slate-800 dark:text-slate-200 tracking-wider">
            {{ websiteInfo?.name?.split(' ')[0] }}
        </span>
      </NuxtLink>

      <div class="flex gap-2 items-center">
        <div v-for="social of socialLinks" :key="social.id">
          <NuxtLink v-if="social.active" :to="social.link" title="Visit my social" target="_blank">
            <Button @click="Lit.event(`click-${getIconName(social.icon).split(':')[1]}`)" size="icon"
              class="bg-transparent rounded-full text-slate-500 hover:text-blue-600 hover:bg-blue-100/50 dark:text-slate-400 dark:hover:text-sky-400 dark:hover:bg-slate-800 transition-colors duration-300">
              <Icon :name="getIconName(social.icon)" class="text-xl" />
            </Button>
          </NuxtLink>
        </div>
        <ThemeSwitcher />

      </div>

    </div>
  </header>
</template>