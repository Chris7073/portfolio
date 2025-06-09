// components/blocks/TextImageBlock.vue
<script setup lang="ts">
// 1. CORREGGIAMO L'INTERFACCIA: rimuoviamo l'array 'info' e usiamo proprietà dirette.
interface ImageTextBlockData {
    id: string | number;
    block_name: 'image-text';
    block_title?: string;
    block_content?: string;
    // Queste sono le proprietà reali che arrivano dall'API
    hover_effect?: boolean;
    image_url?: string;
    altText?: string;
    didascalia?: string;
}

defineProps<{
    blockData: ImageTextBlockData;
}>();
</script>

<template>
    <section v-if="blockData.block_content && blockData.image_url">
        <div class="grid grid-cols-1 lg:grid-cols-2">
            <div class="group relative min-h-[300px] md:min-h-[500px] lg:h-auto overflow-hidden">
                <img class="object-cover object-center w-full h-full block transition-transform duration-300 ease-in-out"
                    :class="blockData.hover_effect ? 'group-hover:scale-105' : ''" :src="blockData.image_url"
                    :alt="blockData.altText || 'Immagine del blocco'">
                <div v-if="blockData.hover_effect"
                    class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
                    aria-hidden="true">
                </div>
                <div v-if="blockData.didascalia && blockData.hover_effect"
                    class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                    <p class="text-white bg-black/60 text-sm md:text-base text-center px-4 py-2 rounded-md">
                        {{ blockData.didascalia }}
                    </p>
                </div>
            </div>
            <div class="bg-slate-50 dark:bg-slate-900 py-20 sm:py-28 lg:py-32 px-6 sm:px-8 flex items-center">
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
        </div>
    </section>
    <div v-else class="text-center py-10">
        <p>Blocco immagine-testo non configurato correttamente (mancano testo o immagine).</p>
    </div>
</template>