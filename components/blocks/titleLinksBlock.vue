<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface Link {
    c_id: number;
    c_title: string;
    c_desc: string;
    c_icon: string;
    c_url: string;
}

interface TitleLinksBlock {
    id: string | number;
    block_name: 'links';
    block_title?: string;
    block_content?: string;
    links: Link[];
}

defineProps<{
    blockData: TitleLinksBlock;
}>();

// --- LOGICA PER L'ANIMAZIONE ON-SCROLL (la stessa che abbiamo perfezionato) ---
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
        { threshold: 0.2 }
    );
    observer.observe(blockRef.value);
});

onUnmounted(() => {
    if (observer) observer.disconnect();
});
</script>

<template>
    <section ref="blockRef" class="group bg-slate-100 dark:bg-slate-900 py-20 sm:py-28 lg:py-32 px-6 sm:px-8"
        :class="{ 'is-visible': isVisible }">
        <div
            class="max-w-5xl mx-auto text-center transition-all duration-1000 ease-out opacity-0 -translate-y-4 group-[.is-visible]:opacity-100 group-[.is-visible]:translate-y-0">
            <h1 v-if="blockData.block_title"
                class="text-balance text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl">
                {{ blockData.block_title }}
            </h1>

            <div v-if="blockData.block_title" class="my-8">
                <hr class="w-24 h-0.5 mx-auto border-0 rounded-full bg-slate-300 dark:bg-slate-700" />
            </div>

            <div v-if="blockData.block_content"
                class="prose prose-lg max-w-3xl text-slate-700 dark:text-slate-300 mx-auto text-balance leading-relaxed mb-12 lg:mb-16"
                v-html="blockData.block_content">
            </div>
        </div>

        <div v-if="blockData.links && blockData.links.length > 0" class="max-w-7xl mx-auto">
            <div class="flex flex-col md:flex-row justify-center gap-4">
                <NuxtLink v-for="(card, index) in blockData.links" :to="card.c_url" target="_blank">
                    <div :key="card.c_id"
                        class="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg hover:shadow-2xl border border-transparent hover:border-sky-500/50 transition-all duration-300 ease-in-out hover:-translate-y-2 opacity-0 translate-y-4 group-[.is-visible]:opacity-100 group-[.is-visible]:translate-y-0"
                        :style="{ transitionDelay: `${index * 100}ms` }">
                        <div class="flex flex-row gap-4 items-start text-left h-full">
                            <div>
                                <span
                                    class="inline-flex justify-center items-center w-14 h-14 rounded-full bg-sky-100 dark:bg-sky-900/50">
                                    <Icon :name="card.c_icon" class="text-3xl text-sky-600 dark:text-sky-400" />
                                </span>
                            </div>
                            <div class="flex flex-col gap-2">
                            <h3 class="text-xl font-semibold text-slate-800 dark:text-slate-100">
                                {{ card.c_title }}
                            </h3>
                            <p class="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                                {{ card.c_desc }}
                            </p></div>
                        </div>
                    </div>
                </NuxtLink>
            </div>
        </div>

        <div v-else class="text-slate-500 dark:text-slate-400 mt-8 text-center">
            <p>Nessuna card da visualizzare.</p>
        </div>
    </section>
</template>