<script lang="ts" setup>
import type { TPortfolioPosts } from '~/server/schema/PortfolioPostsSchema';

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
const currentCat = ref('0')
watch(currentCat, (newCat) => {
    currentData.value.post_cat = newCat;
})

const currentData = ref<Pick<TPortfolioPosts, "post_name" | "post_desc" | "post_active" | "post_cat">>({
    post_name: '',
    post_desc: '',
    post_cat: currentCat.value,
    post_active: false,
})

const { close } = useDialog();
const emits = defineEmits<{
    (event: 'confirm', data: Pick<TPortfolioPosts, "post_name" | "post_desc" | "post_active" | "post_cat">): void
}>()


const checkInputs = computed(() => {
    if (currentData.value.post_name === '' || currentData.value.post_desc === '') {
        return true;
    }
    return false;
});
</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="flex flex-col gap-2">

            <div>
                <Label>Project Name</Label>
                <Input v-model="currentData.post_name" placeholder="Project Name" />
            </div>
            <div>
                <Label>Category</Label>

                <Select v-model="currentCat" class="w-full">
                    <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent class="z-[1000]">
                        <SelectGroup v-for="cat in portfolioCatsInfo">
                            <SelectItem :value="cat.cat_id" :key="cat.cat_id">
                                {{ cat.cat_name }}
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label>Project Description</Label>
                <Textarea v-model="currentData.post_desc" placeholder="Project Description" />
            </div>

        </div>
        <div class="flex justify-between gap-4">
            <Button variant="ghost" @click="close">
                Cancel
            </Button>
            <Button :disabled="checkInputs" @click="emits('confirm', currentData)">
                Create
            </Button>
        </div>

    </div>
</template>