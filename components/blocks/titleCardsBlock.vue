    <script setup lang="ts">
    interface TitleCardsBlockData {
      id: string | number;
      block_name: 'cards';
      block_title?: string;
      block_content?: string;
      cards: [{
        c_id: number,
        c_title: string,
        c_desc: string,
        c_icon: string
      }]
    }

    defineProps<{
      blockData: TitleCardsBlockData; // o genericamente Object se la struttura varia molto
    }>();
</script>
<template>
  <section class="bg-slate-100 dark:bg-slate-900 py-20 sm:py-28 lg:py-32 px-6 sm:px-8">
    <div class="max-w-5xl mx-auto text-center">


      <h1 v-if="blockData.block_title"
        class="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-5 sm:mb-6 leading-tight">
        {{ blockData.block_title }}
      </h1>

      <div class="mb-8 sm:mb-10">
        <hr class="w-40 h-1 mx-auto border-0 bg-slate-200 dark:bg-slate-700" />
      </div>
      <div v-if="blockData.block_content"
        class="prose prose-lg lg:prose-xl text-slate-700 dark:text-slate-300 mx-auto text-balance leading-relaxed mb-8"
        v-html="blockData.block_content">
      </div>
      <div v-if="blockData.cards" class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

        <div v-for="card in blockData.cards" :key="card.c_title" class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-2xl
                    border border-transparent hover:border-sky-500/50
                    transition-all duration-300 ease-in-out transform hover:-translate-y-1">

          <div class="flex flex-col items-start h-full">
            <div class="flex items-center mb-4">
              <span
                class="inline-flex justify-center items-center w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-sky-100 dark:bg-sky-700 mr-4 flex-shrink-0">
                <Icon :name="card.c_icon" class="text-3xl lg:text-4xl text-sky-600 dark:text-sky-300" />
              </span>
              <h3 class="text-xl lg:text-2xl font-semibold text-sky-700 dark:text-sky-400 leading-tight">
                {{ card.c_title }}
              </h3>
            </div>

            <p class="text-slate-600 dark:text-slate-400 text-base leading-relaxed flex-grow">
              {{ card.c_desc }}
            </p>

          </div>
        </div>
      </div>
      <div v-else class="text-slate-500 dark:text-slate-400 mt-8">
        <p>Contenuto non disponibile al momento.</p>
      </div>

    </div>
  </section>
</template>
