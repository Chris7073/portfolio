<script setup lang="ts">
definePageMeta({
    layout: 'dashboard',
    middleware: 'auth-dashboard'
})

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

import CreateCategoryDialog from '~/components/dialogs/createCategoryDialog.vue'

import type { TPortfolioCats } from '~/server/schema/PortfolioCategoriesSchema';
const { data: portfolioCategories, refresh } = useFetch('/api/portfolio-categories');


const dialog = useDialog()
function addCategoryDialog() {
    dialog.open({
        body: CreateCategoryDialog,
        title: 'Add new category',
        onSuccess(data, close) {
            addCategory(data, close)
        },
    })
}

async function addCategory(data: Pick<TPortfolioCats, "cat_name" | "cat_desc">, close: () => any) {
    try {
        await $fetch(`/api/categories/create/`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: data
        })
        showToast('Category added succesfully!', 'success')
        close()
        refresh()
    } catch (e) {
        showToast('Error:' + e, 'error')
    }
}
const { data: portfolioPosts } = useFetch('/api/portfolio-posts');
function getNumberPostsPerCat(postId: string) {
    if (portfolioPosts.value) {
        const getData = portfolioPosts.value.filter(p => p.post_cat === postId);
        return getData.length;
    } else { return [] }
}

const confirmDelete = ref('');

async function deleteProject(id: string) {
    console.log('Delete cliccato')
    try {
        await $fetch(`/api/categories/${id}/categories/delete/`, {
            method: 'DELETE',
            headers: { 'content-type': 'application/json' },
            body: { category: id }
        });
        showToast('Categoria rimossa con successo', 'success');
        refresh();
    } catch (error) {
        console.log(error)
        showToast('Errore durante la rimozione della categoria', 'error');
    }
}
</script>
<template>

    <Card>
        <CardHeader class="flex flex-row justify-between">
            <div>
                <CardTitle class="content-middle flex">
                    <Icon name="uil:archive" class="text-lg mr-2" />
                    Categories
                </CardTitle>
                <CardDescription>Here you can see and delete your categories</CardDescription>
            </div>
            <Button class="bg-blue-500 hover:bg-blue-500/90" @click="addCategoryDialog">Add Category</Button>
        </CardHeader>
        <CardContent class="flex flex-col gap-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>id</TableHead>
                        <TableHead>Category Name</TableHead>
                        <TableHead>Posts</TableHead>
                        <TableHead class="text-right">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow v-for="cat in portfolioCategories">
                        <TableCell>{{ cat.cat_id }}</TableCell>
                        <TableCell>{{ cat.cat_name }}</TableCell>
                        <TableCell>{{ getNumberPostsPerCat(cat.cat_id) }}</TableCell>
                        <TableCell class="text-right">
                            <Popover>
                                <PopoverTrigger>
                                    <Button size="icon" variant="destructive" @click="console.log(cat.cat_id)">
                                        <Icon name="uil:trash" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent class="flex flex-col gap-2" side="bottom" align="end">
                                    <p>type <strong>DeleteCat/{{ cat.cat_name }}</strong></p>
                                    <Input v-model="confirmDelete" />
                                    <Button variant="destructive"
                                        :disabled="confirmDelete !== `DeleteCat/${cat.cat_name}` ? true : false"
                                        @click="deleteProject(cat.cat_id)">Delete</Button>
                                </PopoverContent>
                            </Popover>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </CardContent>
    </Card>
</template>