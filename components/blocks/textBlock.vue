    <script setup lang="ts">
    interface TextBlockData {
      id: string | number;
      block_name: 'text'; 
      block_content?: string;
    }

    defineProps < {
      blockData: TextBlockData; // o genericamente Object se la struttura varia molto
    } > ();
</script>
<template>
  <div class="text-block">
    <div v-if="blockData.block_content" v-html="blockData.block_content"></div>
    <p v-else>Testo non disponibile.</p>
  </div>
</template>
