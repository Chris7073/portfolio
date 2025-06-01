<script setup lang="ts">
interface textImageBlockData {
    id: string | number;
    block_name: 'text-image';
    block_title?:string;
    block_content: string;
    info?: {
        hover_effect?:boolean,
        image_url?:string;
        altText?: string;
        didascalia?: string;
    }

    // altre proprietà specifiche per ImageBlock
}

defineProps<{
    blockData: textImageBlockData;
}>();
</script>

<template>
    <section v-if="blockData.block_content && blockData.info">
        <div class="grid grid-cols-1 lg:grid-cols-2">
            <div class="bg-slate-50 dark:bg-slate-900 py-20 sm:py-28 lg:py-32 px-6 sm:px-8">
    <div class="max-w-3xl mx-auto">


      <h1 v-if="blockData.block_title"
        class="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-5 sm:mb-6 leading-tight">
        {{ blockData.block_title }}
      </h1>
      <div v-if="blockData.block_content"
        class="prose prose-lg lg:prose-xl text-slate-700 dark:text-slate-300 mx-auto text-balance leading-relaxed"
        v-html="blockData.block_content">
      </div>
      <div v-else class="text-slate-500 dark:text-slate-400 mt-8">
        <p>Contenuto non disponibile al momento.</p>
      </div>

    </div>
</div>
        <div class="group relative h-100 md:h-dvh overflow-hidden">
            <img class="object-cover object-center lg:object-center-bottom w-full h-full block transition-transform duration-300 ease-in-out"
            :class="blockData.info?.hover_effect ? 'group-hover:scale-105':''"
                :src="blockData.info?.image_url" :alt="blockData.info?.altText || 'Immagine del blocco'">
            <div v-if="blockData.info?.hover_effect" class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
                aria-hidden="true">
            </div>

            <div v-if="blockData.info?.didascalia && blockData.info?.hover_effect"
                class="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"
                >
                <p class="text-white text-sm md:text-base"> {{ blockData.info.didascalia }}
                </p>
            </div>

        </div>
        </div>
    </section>
    <p v-else>Immagine non disponibile.</p>
</template>