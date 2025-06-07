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
  // 1. Controlla se i dati sono stati caricati. Se no, restituisci un array vuoto.
  if (!portfolioProjects.value || !portfolioCategories.value) {
    return [];
  }

  // 2. Estrai un elenco di tutti gli ID di categoria (post_cat) usati nei progetti.
  // Usiamo Set per avere automaticamente solo valori unici.
  const usedCategoryIds = new Set(portfolioProjects.value.map(p => p.post_cat));

  // 3. Filtra l'array delle categorie totali.
  // Mantieni solo le categorie il cui 'cat_id' NON è presente
  // nell'elenco degli ID usati.
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
    <CardContent class="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

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

      <!-- <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">
            Visualizzazioni Totali
          </CardTitle>
          <Icon name="uil:eye" class="h-5 w-5 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div class="text-4xl font-bold">78.4K</div>
          <p class="text-xs text-muted-foreground">
            +20.1% rispetto al mese scorso
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">
            Nuovi Commenti
          </CardTitle>
          <Icon name="uil:comment-dots" class="h-5 w-5 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div class="text-4xl font-bold">+23</div>
          <p class="text-xs text-muted-foreground">
            Nelle ultime 24 ore
          </p>
        </CardContent>
        <CardFooter v-if="false"> <p class="text-xs text-muted-foreground">Dettagli</p>
        </CardFooter>
      </Card> -->

    </CardContent>
    </Card>
</template>