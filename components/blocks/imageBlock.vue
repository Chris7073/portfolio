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

// --- LOGICA DI ANIMAZIONE OTTIMIZZATA ---

const imageRef = ref<HTMLElement | null>(null);
const animationProgress = ref(0);
let ticking = false;

const calculateAndUpdate = () => {
  if (!imageRef.value) return;
  const rect = imageRef.value.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const startPoint = viewportHeight;
  const endPoint = 150;
  const animationDistance = startPoint - endPoint;
  const currentPositionInZone = startPoint - rect.top;
  let progress = currentPositionInZone / animationDistance;
  progress = Math.max(0, Math.min(1, progress));
  animationProgress.value = progress;
};

const onScroll = () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      calculateAndUpdate();
      ticking = false;
    });
    ticking = true;
  }
};

// --- Stili Ottimizzati ---

// MODIFICA CRUCIALE: Aggiungiamo una traslazione verticale all'immagine.
const imageContainerStyle = computed(() => {
  const progress = animationProgress.value;
  const scale = 1 - (0.25 * progress);
  const borderRadius = 12 * progress;
  // L'immagine si sposterà verso l'alto di 32px alla fine dell'animazione.
  // Il valore negativo sposta l'elemento verso l'alto.
  // Modifica -32 per aumentare o diminuire lo spazio finale.
  const translateY = -20 * progress; 

  return {
    transform: `scale(${scale}) translateY(${translateY}px) translateZ(0)`,
    borderRadius: `${borderRadius}px`,
  };
});

const textContainerStyle = computed(() => {
  const progress = animationProgress.value;
  return {
    opacity: progress,
    transform: `translateY(${(1 - progress) * 20}px) translateZ(0)`,
  };
});

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
});
</script>

<template>
<div v-if="props.blockData.image_url" class="bg-slate-50 dark:bg-slate-800 pt-12 sm:pt-16 lg:pt-20">    
  <div class="mx-auto max-w-3xl text-center">
      <div 
        :style="textContainerStyle"
      >
        <h1 
          v-if="blockData.block_title"
          class="text-balance text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl"
        >
          {{ blockData.block_title }}
        </h1>
        <div v-if="blockData.block_title" class="my-8">
          <hr class="mx-auto h-0.5 w-24 rounded-full border-0 bg-slate-300 dark:bg-slate-700" />
        </div>
        <div 
          v-if="blockData.block_content"
          class="prose prose-lg max-w-none text-slate-700 dark:text-slate-300"
          v-html="blockData.block_content"
        >
        </div>
      </div>
    </div>
    
    <div 
      ref="imageRef"
      class="group relative aspect-video overflow-hidden bg-slate-200 dark:bg-slate-800"
      :style="imageContainerStyle"
    >
      <img 
        class="absolute inset-0 h-full w-full object-cover object-center"
        :class="blockData.hover_effect ? 'group-hover:scale-105 transition-transform duration-500 ease-in-out' : ''"
        :src="props.blockData.image_url"
        :alt="props.blockData.altText || 'Immagine del blocco'"
      >
      <div 
          v-if="props.blockData.hover_effect"
          class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
          aria-hidden="true">
        </div>
        <div 
          v-if="props.blockData.didascalia && props.blockData.hover_effect"
          class="absolute inset-0 flex items-end justify-center p-6 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"
        >
          <p class="rounded-md bg-black/60 px-4 py-2 text-center text-sm text-white md:text-base">
            {{ props.blockData.didascalia }}
          </p>
        </div>
    </div>
  </div>
</template>