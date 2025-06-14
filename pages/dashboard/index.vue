<script setup>
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth-dashboard'
})
useHead({
  title:'Admin Panel',
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


//LITLYX
const selectedPeriod = ref('7d');

// Oggetti per creare i bottoni più facilmente
const periods = [
  { key: '7d', label: '7 days' },
  { key: '28d', label: '28 days' },
  { key: 'all', label: 'All time' },
];

// --- 2. Rendi il "body" della richiesta reattivo ---
// 'fetchBody' è una proprietà 'computed'. Cambia automaticamente quando 'selectedPeriod' cambia.
const fetchBody = computed(() => {
  const toDate = new Date();
  let fromDate = new Date();

  switch (selectedPeriod.value) {
    case '28d':
      fromDate.setDate(toDate.getDate() - 28);
      break;
    case 'all':
      fromDate = new Date('2020-01-01T00:00:00.000Z');
      break;
    case '7d':
    default:
      fromDate.setDate(toDate.getDate() - 7);
      break;
  }

  return {
    rows: ["session"],
    limit: 500, // Aumenta il limite se ti aspetti molti dati
    from: fromDate.toISOString(),
    to: toDate.toISOString(),
  };
});

const { data, pending, error, refresh } = useFetch('https://api.litlyx.com/api/v1/visits/', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer lit_f6a9b2aa9e1e',
    'Content-Type': 'application/json'
  },
  body: fetchBody,
  watch: [fetchBody]
});
const visitCount = computed(() => {
  if (pending.value) return '...';
  if (error.value) return 'Error';
  if (data.value && Array.isArray(data.value.data)) {
    return data.value.data.length;
  }

  return 0; 
});


</script>

<template>
  <Card class="w-full dark:bg-slate-900 dark:border-slate-800">
    <CardHeader class="pb-4">
      <CardTitle class="dark:text-slate-100">
        <Icon name="uil:apps" /> Dashboard
      </CardTitle>
      <CardDescription class="dark:text-slate-400">Overview of your recent activities and key statistics.</CardDescription>
    </CardHeader>
    <CardContent class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

      <Card class="dark:bg-slate-950 dark:border-slate-800">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">
            <NuxtLink to="/dashboard/projects">
              <Button variant="link" class="p-0 dark:text-slate-50">Projects</Button>
            </NuxtLink>
          </CardTitle>
          <Icon name="uil:file-check-alt" class="text-2xl text-green-500" />
        </CardHeader>
        <CardContent>
          <div class="text-4xl font-bold dark:text-slate-50">{{ activeProjects.length }}</div>
          <p class="text-xs text-muted-foreground dark:text-slate-400">
            {{ disabledProjects.length }} Unpublished
          </p>
        </CardContent>
      </Card>

      <Card class="dark:bg-slate-950 dark:border-slate-800">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">
            <NuxtLink to="/dashboard/projects/categories">
              <Button variant="link" class="p-0 dark:text-slate-50">Categories</Button>
            </NuxtLink>
          </CardTitle>
          <Icon name="uil:list-ul" class="text-2xl text-orange-500" />
        </CardHeader>
        <CardContent>
          <div class="text-4xl font-bold dark:text-slate-50">{{ portfolioCategories.length }}</div>
          <p class="text-xs text-muted-foreground dark:text-slate-400">
            {{ emptyCategories.length }} Not used
          </p>
        </CardContent>
      </Card>

      <Card class="dark:bg-slate-950 dark:border-slate-800">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium dark:text-slate-400">
            Portfolio Visits
          </CardTitle>
          
          <Select v-model="selectedPeriod">
            <SelectTrigger class="w-[180px] bg-slate-100 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300">
              <Icon name="uil:graph-bar" class="text-violet-500" /> 
              <SelectValue placeholder="Seleziona periodo" />
            </SelectTrigger>
            <SelectContent class="dark:bg-slate-950 dark:border-slate-800">
              <SelectGroup>
                <SelectItem 
                  v-for="period in periods" 
                  :key="period.key" 
                  :value="period.key" 
                  class="dark:text-slate-200 dark:focus:bg-slate-800">
                  {{ period.label }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div class="text-4xl font-bold dark:text-slate-50">{{ visitCount }}</div>
          <p class="text-xs text-muted-foreground dark:text-slate-400">
            Total visits on selected period
          </p>
        </CardContent>
      </Card>

    </CardContent>
  </Card>
</template>