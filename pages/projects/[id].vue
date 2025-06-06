<script setup lang="ts">

import { computed, defineAsyncComponent, type Component } from 'vue';
import type { TPortfolioPosts } from '~/server/schema/PortfolioPostsSchema';

// BLOCCHI
const TextBlock = defineAsyncComponent(() => import('~/components/blocks/TextBlock.vue')); // block_name: 'text'
const ImageBlock = defineAsyncComponent(() => import('~/components/blocks/ImageBlock.vue')); // block_name: 'image'
const ImageTextBlock = defineAsyncComponent(() => import('~/components/blocks/TextImageBlock.vue')); // block_name: 'text-image'

// 1. CREA UNA MAPPA DEI COMPONENTI
// Associa il 'block_name' dal tuo DB al componente Vue corrispondente.
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

const isCurrentPostActive = computed(() => {
  if (!currentPost.value) {
    return false;
  }
  return currentPost.value.post_active === true;
});

useHead({
  title:currentPost.value?.post_name
})
</script>

<template>
  <div>
    <div v-if="isCurrentPostActive && currentPost">
      <div v-if="currentPost.blocks && currentPost.blocks.length > 0">
        <div v-for="block in currentPost.blocks" :key="block.block_id">
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