<script lang="ts" setup>
import type { TPortfolioCats } from '~/server/schema/PortfolioCategoriesSchema';

const currentData = ref<Pick<TPortfolioCats, "cat_name" | "cat_desc">>({
    cat_name: '',
    cat_desc: '',
})

const { close } = useDialog();
const emits = defineEmits<{
    (event: 'confirm', data: Pick<TPortfolioCats, "cat_name"| "cat_desc">): void
}>()


const checkInputs = computed(() => {
    if (currentData.value.cat_name === '') {
        return true;
    }
    return false;
});
</script>

<template>
    <div class="flex flex-col gap-6">
        <div class="flex flex-col gap-4">

            <div>
                <Label>Category Name</Label>
                <Input v-model="currentData.cat_name" placeholder="Category Name" />
            </div>
            <div>
                <Label>Category Description</Label>
                <Textarea v-model="currentData.cat_desc" placeholder="Project Description" />
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