<script setup lang="ts">
import { computed, defineAsyncComponent, type Component } from 'vue';
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

const { data: allPostsData } = await useFetch<TPortfolioPosts[]>('/api/portfolio-posts');

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
</script>

<template>
  <div>
    <div v-if="isCurrentPostActive && currentPost">
      
      <div v-if="sortedBlocks.length > 0">
        <div v-for="block in sortedBlocks" :key="block.block_id">
          <component
            :is="blockComponents[block.block_name]"
            v-if="blockComponents[block.block_name]"
            :blockData="block"
          />
          <div v-else class="text-red-500">
            Attenzione: tipo di blocco '{{ block.block_name }}' non riconosciuto.
          </div>
        </div>
      </div>

      <div v-else>
        <p>Nessun blocco trovato per questa pagina.</p>
      </div>
    </div>
    <Error v-else />
  </div>
</template>