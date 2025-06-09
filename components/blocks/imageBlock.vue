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
  <div v-if="props.blockData.image_url" class="p-8 dark:bg-slate-800">
    <div class="group relative h-[50dvh] md:h-100 overflow-hidden rounded-lg">
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
  <div v-else>
    <p>Immagine non configurata o non disponibile.</p>
  </div>
</template>