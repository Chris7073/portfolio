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
  <div v-if="props.blockData.image_url">
    <div class="group relative h-[50dvh] md:h-dvh overflow-hidden">
      <img
        class="w-full h-full block object-cover object-center transition-transform duration-300 ease-in-out"
        :class="props.blockData.hover_effect ? 'group-hover:scale-105' : ''"
        :src="props.blockData.image_url"
        :alt="props.blockData.altText || 'Immagine del blocco'"
      >
      <div
        v-if="props.blockData.hover_effect"
        class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
        aria-hidden="true">
      </div>
      <div
        v-if="props.blockData.didascalia && props.blockData.hover_effect"
        class="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"
      >
        <p class="text-white text-sm md:text-base">
          {{ props.blockData.didascalia }}
        </p>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Immagine non configurata o non disponibile.</p>
  </div>
</template>