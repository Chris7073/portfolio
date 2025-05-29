<script setup lang="ts">
interface ImageBlockData {
    id: string | number;
    block_name: 'image';
    block_content: string;
    info: {
        altText?: string;
        didascalia?: string;
    }

    // altre proprietà specifiche per ImageBlock
}

defineProps<{
    blockData: ImageBlockData;
}>();
</script>

<template>
    <div v-if="blockData.block_content">
        <div class="group relative rounded-xl overflow-hidden">
            <img class="w-full h-auto block transition-transform duration-300 ease-in-out group-hover:scale-105"
                :src="blockData.block_content" :alt="blockData.info.altText || 'Immagine del blocco'">
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
                aria-hidden="true">
            </div>

            <div v-if="blockData.info.didascalia"
                class="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"
                >
                <p class="text-white text-sm md:text-base"> {{ blockData.info.didascalia }}
                </p>
            </div>

        </div>





    </div>
    <p v-else>Immagine non disponibile.</p>
</template>