// components/blocks/TextImageBlock.vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface TextImageBlockData {
    id: string | number;
    block_name: 'text-image';
    block_title?: string;
    block_content?: string;
    hover_effect?: boolean;
    image_url?: string;
    altText?: string;
    didascalia?: string;
    imagePosition?: 'left' | 'right';
}

const props = withDefaults(defineProps<{
    blockData: TextImageBlockData;
}>(), {
    blockData: () => ({
        imagePosition: 'right',
    } as any),
});

const blockRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);

let observer: IntersectionObserver;

onMounted(() => {
    if (!blockRef.value) return;

    observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    isVisible.value = true;
                    observer.unobserve(blockRef.value!);
                }
            });
        },
        {
            threshold: 0.2,
        }
    );

    observer.observe(blockRef.value);
});

onUnmounted(() => {
    if (observer) {
        observer.disconnect();
    }
});
</script>

<template>
    <section v-if="blockData.block_content && blockData.image_url" ref="blockRef"
        class="group bg-slate-50 dark:bg-slate-900" :class="{ 'is-visible': isVisible }">
        <div class="grid grid-cols-1 lg:grid-cols-2 p-8 gap-4 ">
            <div class="group/image relative aspect-video lg:aspect-auto overflow-hidden transition-all duration-1000 ease-out delay-200 group-[.is-visible]:opacity-100 group-[.is-visible]:scale-100"
                :class="['opacity-0 scale-95']">
                <div class="relative h-full w-full rounded-lg overflow-hidden isolation-isolate">
                    <img class="block h-full w-full object-cover object-center transition-transform duration-500 ease-in-out"
                        :class="blockData.hover_effect ? 'group-hover/image:scale-105' : ''" :src="blockData.image_url"
                        :alt="blockData.altText || 'Immagine del blocco'">

                    <div v-if="blockData.hover_effect"
                        class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover/image:opacity-100"
                        aria-hidden="true">
                    </div>
                    <div v-if="blockData.didascalia && blockData.hover_effect"
                        class="absolute inset-0 flex items-end justify-center p-6 opacity-0 transition-all duration-300 group-hover/image:opacity-100">
                        <p class="rounded-md bg-black/60 px-4 py-2 text-center text-sm text-white md:text-base">
                            {{ blockData.didascalia }}
                        </p>
                    </div>
                </div>
            </div>
            <div class="flex items-center  sm:px-10 md:py-24 lg:px-12 lg:py-32"
                :class="{ 'lg:order-last': blockData.imagePosition === 'left' }">
                <div class="mx-auto max-w-xl transition-all duration-1000 ease-out group-[.is-visible]:opacity-100 group-[.is-visible]:translate-x-0"
                    :class="[
                        blockData.imagePosition === 'left'
                            ? 'opacity-0 translate-x-8'
                            : 'opacity-0 -translate-x-8'
                    ]">
                    <h1 v-if="blockData.block_title"
                        class="text-balance text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl mb-6">
                        {{ blockData.block_title }}
                    </h1>
                    <div v-if="blockData.block_content"
                        class="prose prose-lg max-w-none text-slate-700 dark:text-slate-300"
                        v-html="blockData.block_content">
                    </div>
                </div>
            </div>
        </div>
    </section>

    <div v-else class="text-center py-10">
        <p>Blocco non configurato.</p>
    </div>
</template>