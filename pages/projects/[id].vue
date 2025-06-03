<script setup lang="ts">
import { computed, defineAsyncComponent, type Component, type DefineComponent } from 'vue';
import type { TPortfolioPosts } from '~/server/schema/PortfolioPostsSchema';
//BLOCCHI
const TextBlock = defineAsyncComponent(() => import('~/components/blocks/textBlock.vue'));
const ImageBlock = defineAsyncComponent(() => import('~/components/blocks/imageBlock.vue'));
const imageTextBlock = defineAsyncComponent(() => import('~/components/blocks/textImageBlock.vue'));

interface Blocco {
  id: string | number;
  block_position: string | number;
  block_name: string;
  block_content: string;
  [key: string]: any;
}

const route = useRoute();
const postIdFromRoute = computed(() => Number(route.params.id));

const { data: postBlocks } = await useFetch<any[]>('/api/post-blocks');
const { data: allPostsData } = await useFetch<TPortfolioPosts[]>('/api/portfolio-posts');

const isCurrentPostActive = computed(() => {
  if (!allPostsData.value || !postIdFromRoute.value) {
    return false; 
  }

  const currentPost = allPostsData.value.find(
    post => post.post_id === postIdFromRoute.value
  );
  if (currentPost) {
    return currentPost.post_active === true;
  }
  return false;
});


const blocchiCollegati = computed<Blocco[]>(() => {
  if (!postBlocks.value || !postIdFromRoute.value) {
    return [];
  }
  return postBlocks.value
    .filter(blocco => blocco.post_id === postIdFromRoute.value)
    .sort((a, b) => {
      const posA = a.block_position;
      const posB = b.block_position;
      if (posA === undefined || posA === null) {
        return 1;
      }
      if (posB === undefined || posB === null) {
        return -1;
      }
      return Number(posA) - Number(posB);
    });
});

console.log('Blocchi Collegati:', blocchiCollegati.value);
console.log('Lunghezza Blocchi Collegati:', blocchiCollegati.value?.length);

type BlockComponent = DefineComponent<{ blockData: Blocco }, {}, any> | Component;

const componentMap: Record<string, BlockComponent> = {
  'text': TextBlock,
  'image': ImageBlock,
  'text-image':imageTextBlock,
};

function getComponentForBlock(blockType: string) {
  return componentMap[blockType];
}
</script>
<template>
  <div>
    <div>
      <div v-if="isCurrentPostActive">
        <div v-if="blocchiCollegati.length > 0" class="bg-blue-200">
          <div v-for="blocco in blocchiCollegati" :key="blocco.id" class="blocco-bg-blue-400">
            <component :is="getComponentForBlock(blocco.block_name)" :blockData="blocco" />
          </div>
        </div>
        <div v-else>
          <p>Nessun blocco trovato per questa pagina.</p>
        </div>
      </div>
      <Error v-else/>
    </div>
  </div>
</template>
