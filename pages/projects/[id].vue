<script setup lang="ts">
import { computed, defineAsyncComponent, type Component } from 'vue';
import Navbar from '~/components/navbar.vue';
import type { TPortfolioPosts } from '~/server/schema/PortfolioPostsSchema';

// BLOCCHI
const TextBlock = defineAsyncComponent(() => import('~/components/blocks/textBlock.vue'));
const ImageBlock = defineAsyncComponent(() => import('~/components/blocks/imageBlock.vue'));
const ImageTextBlock = defineAsyncComponent(() => import('~/components/blocks/textImageBlock.vue'));

// Mappa dei componenti
const blockComponents: Record<string, Component> = {
  'text': TextBlock,
  'image': ImageBlock,
  'text-image': ImageTextBlock
};

const route = useRoute();
const postIdFromRoute = computed(() => Number(route.params.id));

const { data: allPostsData, pending } = useFetch<TPortfolioPosts[]>('/api/portfolio-posts');

const currentPost = computed(() =>
  allPostsData.value?.find(post => post.post_id === postIdFromRoute.value)
);

// NUOVO: Computed property per ordinare i blocchi
// Questa funzione prende i blocchi dal post corrente e li ordina
// in base alla loro `block_position`.
const sortedBlocks = computed(() => {
  if (!currentPost.value || !currentPost.value.blocks) {
    return [];
  }
  // Usiamo [...array] per creare una copia e non mutare lo stato originale con .sort()
  return [...currentPost.value.blocks].sort((a, b) => a.block_position - b.block_position);
});

const isCurrentPostActive = computed(() => {
  if (!currentPost.value) {
    return false;
  }
  return currentPost.value.post_active === true;
});

useHead({
  title: currentPost.value?.post_name
})

console.log(isCurrentPostActive.value)
console.log(currentPost)
</script>

<template>
  <div v-if="pending">
    <LoadingPage />
  </div>
  <div v-else>
    <div v-if="isCurrentPostActive && currentPost">
      <Navbar />
      <div v-if="sortedBlocks.length > 0">
        <div v-for="block in sortedBlocks" :key="block.block_id">
          <component :is="blockComponents[block.block_name]" v-if="blockComponents[block.block_name]"
            :blockData="block" />
          <div v-else class="text-red-500">
            Attenzione: tipo di blocco '{{ block.block_name }}' non riconosciuto.
          </div>
        </div>
      </div>

          <div v-else class="flex min-h-screen items-center justify-center">

      <div class="text-center">
        <Icon name="uil:list-ul" class="text-6xl text-slate-400 dark:text-slate-500 mb-4" />
        <p class="text-xl font-semibold text-slate-600 dark:text-slate-400">
          This post has no blocks!
        </p>
        <p class="text-slate-500 dark:text-slate-300 mt-4">
          <NuxtLink to="/">
            <Button variant="outline">Return Home</Button>
          </NuxtLink>
        </p>
      </div>

    </div>
    </div>
    <div v-else class="flex min-h-screen items-center justify-center">

      <div class="text-center">
        <Icon name="uil:exclamation-triangle" class="text-6xl text-slate-400 dark:text-slate-500 mb-4" />
        <p class="text-xl font-semibold text-slate-600 dark:text-slate-400">
          This project doesn't exist!
        </p>
        <p class="text-slate-500 dark:text-slate-300 mt-4">
          <NuxtLink to="/">
            <Button variant="outline">Return Home</Button>
          </NuxtLink>
        </p>
      </div>

    </div>
  </div>
</template>