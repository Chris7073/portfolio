    <script setup lang="ts">
    interface TextBlockData {
      id: string | number;
      block_name: 'text';
      block_title?: string;
      block_content?: string;
    }

    defineProps<{
      blockData: TextBlockData; // o genericamente Object se la struttura varia molto
    }>();
</script>
<template>
  <section class="bg-white dark:bg-slate-900 py-20 sm:py-28 lg:py-32 px-6 sm:px-8">
    <div class="max-w-3xl mx-auto text-center">


      <h1 v-if="blockData.block_title"
        class="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-5 sm:mb-6 leading-tight">
        {{ blockData.block_title }}
      </h1>

      <div class="mb-8 sm:mb-10">
        <hr class="w-40 h-1 mx-auto border-0 bg-slate-200 dark:bg-slate-700" />
      </div>
      <div v-if="blockData.block_content"
        class="prose prose-lg lg:prose-xl text-slate-700 dark:text-slate-300 mx-auto text-balance leading-relaxed"
        v-html="blockData.block_content">
      </div>
      <div v-else class="text-slate-500 dark:text-slate-400 mt-8">
        <p>Contenuto non disponibile al momento.</p>
      </div>

    </div>
  </section>
</template>
