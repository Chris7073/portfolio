<script setup lang="ts">
import { computed, defineAsyncComponent, type Component } from 'vue';
import Navbar from '~/components/navbar.vue';
import type { TPortfolioPosts } from '~/server/schema/PortfolioPostsSchema';
import { Lit } from "litlyx-js"

// BLOCCHI
const TextBlock = defineAsyncComponent(() => import('~/components/blocks/textBlock.vue'));
const ImageBlock = defineAsyncComponent(() => import('~/components/blocks/imageBlock.vue'));
const TextImageBlock = defineAsyncComponent(() => import('~/components/blocks/textImageBlock.vue'));
const ImageTextBlock = defineAsyncComponent(() => import('~/components/blocks/imageTextBlock.vue'));
const TitleCardsBlock = defineAsyncComponent(() => import('~/components/blocks/titleCardsBlock.vue'));

// Mappa dei componenti
const blockComponents: Record<string, Component> = {
  'text': TextBlock,
  'image': ImageBlock,
  'text-image': TextImageBlock,
  'image-text': ImageTextBlock,
  'cards':TitleCardsBlock
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

const requestURL = useRequestURL();

useHead(() =>({
  title: currentPost.value?.post_name,
  meta: [
      // --- 2. OPEN GRAPH (Facebook, LinkedIn, WhatsApp, etc.) ---
      { property: 'og:title', content: currentPost.value?.post_name },
      { property: 'og:description', content: currentPost.value?.post_desc },
      { property: 'og:type', content: 'article' }, // 'article' è più specifico di 'website' per un post/progetto
      { property: 'og:url', content: `${requestURL.origin}/projects/${currentPost.value?.post_id}` },
      { property: 'og:site_name', content: 'Chris - My tiny Portfolio' }, // Nome del tuo sito
      { property: 'og:locale', content: 'it_IT' },
      
      // Immagine Open Graph
      { property: 'og:image', content: `${requestURL.origin}${currentPost.value?.post_image}` },
      { property: 'og:image:width', content: '1200' }, // Larghezza raccomandata
      { property: 'og:image:height', content: '630' }, // Altezza raccomandata
      { property: 'og:image:alt', content: `Immagine di anteprima per il progetto ${currentPost.value?.post_name}` },

      // --- 3. TWITTER CARDS ---
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: currentPost.value?.post_name },
      { name: 'twitter:description', content: currentPost.value?.post_desc },
      { name: 'twitter:image', content: `${requestURL.origin}${currentPost.value?.post_image}` },
      { name: 'twitter:image:alt', content: `Immagine di anteprima per il progetto ${currentPost.value?.post_name}` },
    ],
}))


</script>

<template>
  <div v-if="pending">
    <LoadingPage />
  </div>
  <div v-else>
    <div v-if="isCurrentPostActive && currentPost">
      <Navbar/>
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