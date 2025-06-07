<script setup>
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

const { data: portfolioProjects } = await useFetch('/api/portfolio-posts');
const { data: portfolioCategories } = await useFetch('/api/portfolio-categories');

const activeProjects = computed(() => {
  return portfolioProjects.value?.filter(p => p.post_active === true) ?? [];
});

const disabledProjects = computed(() => {
  return portfolioProjects.value?.filter(p => p.post_active === false) ?? [];
});

const emptyCategories = computed(() => {
  if (!portfolioProjects.value || !portfolioCategories.value) {
    return [];
  }
  const usedCategoryIds = new Set(portfolioProjects.value.map(p => p.post_cat));
  return portfolioCategories.value.filter(category => !usedCategoryIds.has(category.cat_id));
});

</script>

<template>
  <Card class="w-full">
    <CardHeader class="pb-4">
      <CardTitle >
        <Icon name="uil:apps" /> Dashboard
      </CardTitle>
      <CardDescription>Panoramica delle tue attività recenti e statistiche chiave.</CardDescription>
    </CardHeader>
    <CardContent class="grid sm:grid-cols-1 md:grid-cols-2 gap-4">

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">
            Projects
          </CardTitle>
          <Icon name="uil:file-check-alt" class="h-5 w-5 text-green-500" />
        </CardHeader>
        <CardContent>
          <div class="text-4xl font-bold">{{activeProjects.length}}</div>
          <p class="text-xs text-muted-foreground">
            {{disabledProjects.length}} Unpublished
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">
           Categories
          </CardTitle>
          <Icon name="uil:list-ul" class="h-5 w-5 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div class="text-4xl font-bold">{{portfolioCategories.length}}</div>
          <p class="text-xs text-muted-foreground">
            {{ emptyCategories.length }} Not used
          </p>
        </CardContent>
      </Card>

    </CardContent>
    </Card>
</template>