<script setup lang="ts">
import { Lit } from "litlyx-js"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

// I tuoi useFetch con il default, che sono corretti
const { data: portfolioCatsInfo } = useFetch('/api/portfolio-categories', { default: () => [] });
const { data: PortfolioPostsInfo, pending } = useFetch('/api/portfolio-posts', { default: () => [] });

function getCategoryName(catId: string) {
  const cat = portfolioCatsInfo.value?.find(c => c.cat_id === catId);
  return cat ? cat.cat_name : 'No category'
}

// LA TUA LOGICA PER GLI SFONDI CASUALI VIENE MANTENUTA INTATTA
function getRandomBg() {
  const backgrounds = ['bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-red-500', 'bg-pink-500']
  const randomIndex = Math.floor(Math.random() * backgrounds.length);
  return backgrounds[randomIndex];
}

const randomBgClasses = ref<{ [key: string]: string }>({});

onMounted(() => {
  if (filteredPostsCatId.value) {
    filteredPostsCatId.value.forEach(post => {
      if (!post.post_image) {
        randomBgClasses.value[post.post_id] = getRandomBg();
      }
    });
  }
});

const selectedCatId = ref('0');
const filteredPostsCatId = computed(() => {
  // Ho aggiunto un controllo per assicurarsi che PortfolioPostsInfo.value esista prima di filtrare
  if (!PortfolioPostsInfo.value) return [];
  return selectedCatId.value === '0'
    ? PortfolioPostsInfo.value?.filter(post => post.post_active === true)
    : PortfolioPostsInfo.value?.filter(
      post => post.post_cat === selectedCatId.value
    )
})

function clickPortfolio(id: number, name: string) {
  Lit.event('click_portfolio_url', {
    metadata: {
      'post_id': id,
      'post_name': name,
    }
  });
}
</script>

<template>
  <section id="portfolio" class="bg-white dark:bg-slate-800 py-16 lg:py-24 px-4">
    <div v-animate-on-scroll
      class="container group mx-auto px-4 opacity-0 transition-opacity duration-500 ease-out [&.is-visible]:opacity-100">

      <div class="text-center mb-8 lg:mb-12 opacity-0 -translate-y-8 transition-all duration-1000 ease-out group-[.is-visible]:opacity-100 group-[.is-visible]:translate-y-0">
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 dark:text-white mb-4">
          Il Mio Portfolio
        </h2>
        <p class="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Esplora una selezione dei miei lavori e progetti. Utilizza il filtro per navigare tra le categorie.
        </p>
      </div>
      <div class="flex justify-center mb-8 lg:mb-12 px-4 sm:px-0 opacity-0 -translate-x-8 transition-all duration-1500 ease-out group-[.is-visible]:opacity-100 group-[.is-visible]:translate-x-0">
        <div class="w-full sm:w-64 md:w-72">
          <Select v-model="selectedCatId">
            <SelectTrigger class="bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">
              <SelectValue placeholder="Filtra per Categoria" />
            </SelectTrigger>
            <SelectContent class="w-[var(--reka-popper-anchor-width)] z-[1000] dark:bg-slate-950 dark:border-slate-800">
              <SelectGroup>
                <SelectLabel class="dark:text-slate-400">Categorie Progetti</SelectLabel>
                <SelectItem value="0" class="dark:text-slate-200 dark:focus:bg-slate-800">Tutti i Progetti</SelectItem>
                <SelectItem v-for="cat in portfolioCatsInfo" :key="cat.cat_id" :value="cat.cat_id" class="dark:text-slate-200 dark:focus:bg-slate-800">
                  {{ cat.cat_name }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div v-if="pending" class="text-center py-10">
        <Loader />
      </div>
      <div v-else>
        <div class="grid gap-6 p-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="(item, index) in filteredPostsCatId" :key="item.post_id"
               class="h-96 transition-all duration-600 ease-in-out transform hover:-translate-y-1
                      opacity-0 -translate-y-8
                      group-[.is-visible]:opacity-100 group-[.is-visible]:translate-y-0"
               :style="{ 'transition-delay': `${600 + index * 100}ms` }"> 
            
            <NuxtLink v-if="item.post_active" :to="`/projects/${item.post_id}`"
              :title="`View portfolio post named ${item.post_name}`"
              @click="clickPortfolio(item.post_id, item.post_name)"
              class="group/card block h-full transform transition-all duration-300 ease-in-out hover:-translate-y-2">
                
                <div class="relative h-full overflow-hidden rounded-lg text-white shadow-md" 
                     :class="[ item.post_image ? 'bg-cover bg-center bg-no-repeat' : randomBgClasses[item.post_id] || 'bg-gray-500' ]" 
                     :style="item.post_image ? { backgroundImage: `url('${item.post_image}')` } : null">
                  
                  <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent"></div>
                  <div class="absolute inset-0 bg-black opacity-0 transition-opacity duration-500 group-hover/card:opacity-20"></div>

                  <div class="relative flex h-full flex-col justify-end p-6">
                    <div class="rounded-md bg-gray-950/80 p-4 backdrop-blur-sm">
                      <div class="flex items-start justify-between">
                        <div class="pr-4">
                          <h3 class="mb-1 text-xl font-bold uppercase tracking-wide text-white">{{ item.post_name }}</h3>
                          <p class="text-sm text-gray-300">{{ item.post_desc }}</p>
                        </div>
                        <Badge variant="secondary">{{ getCategoryName(item.post_cat) }}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
            </NuxtLink>
          </div>
        </div>

        <div v-if="!pending && filteredPostsCatId?.length === 0" class="text-center py-16">
          <Icon name="uil:file-search-alt" class="text-6xl text-slate-400 dark:text-slate-500 mb-4" />
          <p class="text-xl font-semibold text-slate-600 dark:text-slate-400">Nessun Progetto Trovato</p>
          <p class="text-slate-500 dark:text-slate-300 mt-2">
            Prova a selezionare una categoria diversa.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>