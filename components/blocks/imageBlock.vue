// components/blocks/ImageBlock.vue
<script setup lang="ts">
// 1. Definisci un'interfaccia che corrisponde ai dati REALI del blocco
interface ImageBlockProps {
  block_id: number;
  block_name: 'image';
  block_title?: string;
  block_content?: string;
  hover_effect?: boolean;
  image_url?: string;
  altText?: string;
  didascalia?: string;
}

// 2. Ricevi la prop 'blockData' che ora viene passata correttamente
const props = defineProps<{
  blockData: ImageBlockProps;
}>();
</script>

<template>
  <div v-if="props.blockData.image_url" class="p-8 bg-slate-50 dark:bg-slate-800 text-center">
    <h1 v-if="blockData.block_title"
      class="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-5 sm:mb-6 leading-tight">
      {{ blockData.block_title }}
    </h1>

    <div v-if="blockData.block_title" class="mb-8 sm:mb-10">
      <hr class="w-40 h-1 mx-auto border-0 bg-slate-200 dark:bg-slate-700" />
    </div>
    
    <div v-if="blockData.block_content"
      class="pb-4 prose prose-lg lg:prose-xl text-slate-700 dark:text-slate-300 mx-auto text-balance leading-relaxed"
      v-html="blockData.block_content">
    </div>

    <div class="group relative h-[40vh] sm:h-[50vh] lg:h-[60vh] overflow-hidden rounded-lg">
      <img class="w-full h-full block object-cover object-center transition-transform duration-300 ease-in-out"
        :class="props.blockData.hover_effect ? 'group-hover:scale-105' : ''" :src="props.blockData.image_url"
        :alt="props.blockData.altText || 'Immagine del blocco'">
      
      <div v-if="props.blockData.hover_effect"
        class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
        aria-hidden="true">
      </div>
      <div v-if="props.blockData.didascalia && props.blockData.hover_effect"
        class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
        <p class="text-white bg-black/60 text-sm md:text-base text-center px-4 py-2 rounded-md">
          {{ props.blockData.didascalia }}
        </p>
      </div>
    </div>
  </div>

  <div v-else class="text-center p-16 bg-slate-50 dark:bg-slate-900">
    <p class="text-slate-500 dark:text-slate-400">Immagine non configurata o non disponibile.</p>
  </div>
</template>