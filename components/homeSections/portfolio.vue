<script setup lang="ts">
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

const { data: portfolioCatsInfo } = useFetch('/api/portfolio-categories');
const { data: PortfolioPostsInfo, pending } = useFetch('/api/portfolio-posts');

function getCategoryName(catId: string) {
    const cat = portfolioCatsInfo.value?.find(c => c.cat_id === catId);
    return cat ? cat.cat_name : 'No category'
}

function getRandomBg() {
    const backgrounds = ['bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-red-500', 'bg-pink-500']
    const randomIndex = Math.floor(Math.random() * backgrounds.length);
    return backgrounds[randomIndex];
}

const selectedCatId = ref('0');
const filteredPostsCatId = computed(() => {
    return selectedCatId.value === '0'
        ? PortfolioPostsInfo.value?.filter(post => post.post_active === true)
        : PortfolioPostsInfo.value?.filter(
            post => post.post_cat === selectedCatId.value
        )
})
</script>
<template>
    <section id="portfolio" class="relative z-20 bg-white dark:bg-slate-900 py-16 lg:py-24 px-4">
        <div class="container mx-auto">

            <div class="text-center mb-8 lg:mb-12">
                <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 dark:text-white mb-4">
                    Il Mio Portfolio
                </h2>
                <p class="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                    Esplora una selezione dei miei lavori e progetti. Utilizza il filtro per navigare tra le categorie.
                </p>
            </div>

            <div class="flex justify-center  mb-8 lg:mb-12 px-4 sm:px-0">
                <div class="w-full sm:w-64 md:w-72">
                    <Select v-model="selectedCatId">
                        <SelectTrigger>
                            <SelectValue placeholder="Filtra per Categoria" />
                        </SelectTrigger>
                        <SelectContent class="w-[var(--reka-popper-anchor-width)] z-[1000]">
                            <SelectGroup>
                                <SelectLabel>Categorie Progetti</SelectLabel>
                                <SelectItem v-for="cat in portfolioCatsInfo" :key="cat.cat_id" :value="cat.cat_id">
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
                <div v-if="filteredPostsCatId?.some(item => item.post_active)"
                    class="grid gap-6 p-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    <div v-for="item of filteredPostsCatId" :key="item.post_id">
                        <NuxtLink v-if="item.post_active" :to="'/projects/' + item.post_id"
                            class="group block h-full transform transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl">
                            <div class="relative h-full overflow-hidden rounded-lg text-white shadow-md"
                                :class="item.post_image ? 'bg-auto bg-center bg-no-repeat' : getRandomBg()"
                                :style="item.post_image ? { backgroundImage: 'url(' + item.post_image + ')' } : null">
                                <div
                                    class="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent">
                                </div>

                                <div
                                    class="absolute inset-0 bg-black opacity-0 transition-opacity duration-500 group-hover:opacity-20">
                                </div>

                                <div class="relative flex h-100 flex-col justify-end p-6">
                                    <div class="rounded-md bg-gray-950/80 p-4 backdrop-blur-sm">
                                        <div class="flex items-start justify-between">
                                            <div class="pr-4">
                                                <h3 class="mb-1 text-xl font-bold uppercase tracking-wide text-white">{{
                                                    item.post_name }}</h3>
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

                <div v-else class="text-center py-16">
                    <Icon name="uil:file-search-alt" class="text-6xl text-slate-400 dark:text-slate-500 mb-4" />
                    <p class="text-xl font-semibold text-slate-600 dark:text-slate-400">Nessun Progetto da Mostrare</p>
                    <p class="text-slate-500 dark:text-slate-300 mt-2">
                        Prova a selezionare una categoria diversa o controlla più tardi.
                    </p>
                </div>
            </div>
        </div>
    </section>
</template>