<script lang="ts" setup>
import { Lit } from "litlyx-js"
import { DialogsContatti } from '#components';
const { data: websiteInfo } = useFetch('/api/web-settings')
const { data: socialLinks, refresh } = useFetch('/api/social-links-settings');

const { icons } = useSocialIcons();

function getIconName(iconId: number) {
  const found = icons.find(icon => icon.id === iconId);
  return found ? found.icon : 'uil:globe'; // oppure 'default-icon'
}

</script>

<template>
  <header class="bg-gray-50/80 w-full p-4 sticky top-0 backdrop-blur-sm border-b border-gray-200/60 shadow-sm z-[1000]">
    <div class="container mx-auto flex justify-between items-center">
      
      <NuxtLink to="/">
        <h1 class="uppercase font-semibold text-slate-800 tracking-wider">
          {{ websiteInfo?.name }}
        </h1>
      </NuxtLink>

      <div class="flex gap-2">
        <div v-for="social of socialLinks">
          <NuxtLink v-if="social.active" :to="social.link" target="_blank">
            <Button 
            @click="Lit.event(`click-${getIconName(social.icon).split(':')[1]}`)"
              size="icon"
              class="bg-transparent rounded-full text-slate-500 hover:text-blue-600 hover:bg-blue-100/50 transition-colors duration-300"
            >
              <Icon :name="getIconName(social.icon)" class="text-xl" />
            </Button>
          </NuxtLink>
        </div>
      </div>

    </div>
  </header>
</template>