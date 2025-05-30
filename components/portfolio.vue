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
        ? PortfolioPostsInfo.value
        : PortfolioPostsInfo.value?.filter(
            post => post.post_cat === selectedCatId.value
        )
})
</script>
<template>
    <div class="flex justify-between p-4">
        <div class="content-center text-muted-foreground">Portfolio</div>
        <div class="w-50">
            <Select v-model="selectedCatId">
                <SelectTrigger>
                    <SelectValue placeholder="Categories" />
                </SelectTrigger>
                <SelectContent class="w-[var(--reka-popper-anchor-width)] z-[1000]">
                    <SelectGroup>
                        <SelectLabel>Category List</SelectLabel>
                        <SelectItem v-for="cat in portfolioCatsInfo" :key="cat.cat_id" :value="cat.cat_id">
                            {{ cat.cat_name }}
                        </SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    </div>

    <div id="portfolio">
        <div v-if="pending">
            <Loader />
        </div>
        <div v-else>
            <div v-if="filteredPostsCatId?.some(item => item.post_active)"
                class="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 p-4 gap-4">
                <div v-for="item of filteredPostsCatId">
                    <NuxtLink v-if="item.post_active" :to="'/projects/' + item.post_id">
                        <div class="cursor-pointer text-white bg-cover rounded-lg transition delay-0 duration-400 ease-in-out hover:-translate-y-1 hover:scale-101"
                            :style="item.post_image ? { backgroundImage: 'url(' + item.post_image + ')' } : null"
                            :class="item.post_image ? 'bt-transparent' : getRandomBg()">
                            <div
                                class="grid h-100 content-end bg-black/10 hover:bg-black/30 transition-colors rounded-lg">
                                <div class="bg-gray-950/80 p-4 rounded-lg m-2">
                                    <div class="flex justify-between">
                                        <div>
                                            <div class="text-lg uppercase">{{ item.post_name }}</div>
                                            <div class="text-white/80">{{ item.post_desc }}</div>
                                        </div>
                                        <div class="text-white/80 text-sm">
                                            {{ getCategoryName(item.post_cat) }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </NuxtLink>
                </div>
            </div>
            <div v-else>
                <span class="p-4">No Posts to show</span>
            </div>
        </div>
    </div>
</template>