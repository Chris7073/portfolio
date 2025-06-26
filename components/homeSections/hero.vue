<script setup lang="ts">
// Nota: la sintassi corretta e standard è "lang='ts'" e "setup"
import { Lit } from "litlyx-js"

// ======================================================
// QUESTA PARTE È PERFETTA, NON VIENE TOCCATA
// ======================================================
const { data: landingInfo } = await useFetch('/api/landing-settings', {
  default: () => ({
    hero: false,
    hero_title: 'Benvenuto',
    hero_desc: '...',
    hero_tags: '...',
    hero_bg: [{
      bg_type: 'solid',
      bg_color_1: '#CCCCCC',
      bg_color_2: '#FFFFFF',
      bg_text_color: '#000000',
      bg_image: null
    }],
    hero_button: [{
      active: false,
      text: 'Scopri di più',
      link: '#'
    }]
  })
})

const backgroundColor = computed(() => {
  const bg = landingInfo.value?.hero_bg?.[0];
  if (!bg || !bg.bg_color_1) {
    return 'background-color: #CCCCCC;';
  }
  if (bg.bg_type === "solid") {
    return `background-color: ${bg.bg_color_1}`;
  }
  if ((bg.bg_type === 'linear') && bg.bg_color_1 && bg.bg_color_2) {
    return `background-image: ${bg.bg_type}-gradient(to bottom, ${bg.bg_color_1}, ${bg.bg_color_2});`;
  }
  else if (bg.bg_type === 'radial') {
    return `background-image: radial-gradient(circle, ${bg.bg_color_1}, ${bg.bg_color_2});`;
  }
  return `background-color: ${bg.bg_color_1}`;
});

const backgroundImageStyle = computed(() => {
  const imageUrl = landingInfo.value?.hero_bg?.[0]?.bg_image;
  if (imageUrl) {
    return {
      backgroundImage: `url(${imageUrl})`,
      backgroundRepeat: 'repeat',
      backgroundPosition: 'center',
      backgroundSize: '80px',
      opacity: 0.02
    };
  }
  return {};
});

// ======================================================
// MODIFICHE ALLA LOGICA CLIENT-SIDE
// ======================================================
const fixedHeaderElement = ref<HTMLElement | null>(null);
const isLoaded = ref(false);

if (process.client) {
  const maxBrightness = 1.0;
  const minBrightness = 0.4;
  let scrollEffectRange = 200;

  const handleScroll = () => {
    // La logica per il brightness rimane invariata e funzionerà perché il ref è collegato
    if (!fixedHeaderElement.value) return;

    const scrollY = window.scrollY;
    const progress = Math.max(0, Math.min(1, scrollY / scrollEffectRange));
    const currentBrightness = maxBrightness - (maxBrightness - minBrightness) * progress;
    fixedHeaderElement.value.style.filter = `brightness(${currentBrightness})`;
    
    // --- MODIFICA CHIAVE PER L'IMMAGINE ---
    // Invece di modificare 'transform' direttamente, aggiorniamo le variabili CSS
    const memoji = document.getElementById('memoji') // document.getElementById è ok qui
    if (memoji) {
        const rotationFactor = 0.01;
        const scaleFactor = 0.0002;
        const gradiDiRotazione = scrollY * rotationFactor;
        let valoreDiScala = 1 - (scrollY * scaleFactor); // Rimpicciolisce scendendo
        valoreDiScala = Math.max(0.7, valoreDiScala); // Limite

        window.requestAnimationFrame(() => {
            memoji.style.setProperty('--rotazione', `${gradiDiRotazione}deg`);
            memoji.style.setProperty('--scala', `${valoreDiScala}`);
        });
    }
  };

  onMounted(() => {
    if (fixedHeaderElement.value) {
      const headerHeight = fixedHeaderElement.value.offsetHeight;
      scrollEffectRange = headerHeight * 1.5;
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Chiamata iniziale
    setTimeout(() => {
      isLoaded.value = true;
    }, 100);
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });
}
</script>

<template class="relative">
  <section 
    ref="fixedHeaderElement"
    :class="{ 'is-loaded': isLoaded }" 
    class="group sticky top-0 z-1" 
    style="transform-origin: center top;"
  >
    <div v-if="landingInfo?.hero" class="grid h-dvh " :style="backgroundColor">
      <div class="absolute inset-0 z-0" :style="backgroundImageStyle"></div>
      <div class="content-center text-center h-full z-1 p-8" :style="'color:' + landingInfo.hero_bg[0].bg_text_color">

        <div class="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 md:gap-12">
          <div class="flex justify-center md:justify-center">
            <img id="memoji" src="/assets/chris.png"
                 class="size-60 md:size-96 block opacity-0 
                        transition-all duration-1000 ease-out 
                        group-[.is-loaded]:opacity-100
                        [--traslazione-y:-2rem] group-[.is-loaded]:[--traslazione-y:0rem]
                        [transform:rotate(var(--rotazione,0deg))_translateY(var(--traslazione-y,0rem))_scale(var(--scala,1))]" />
          </div>

          <div class="flex flex-col items-center md:items-start text-center md:text-left gap-4
                      opacity-0 translate-y-8
                      transition-all duration-1000 ease-out delay-200
                      group-[.is-loaded]:opacity-100 group-[.is-loaded]:translate-y-0">
            
            <h1 class="text-4xl font-bold">{{ landingInfo.hero_title }}</h1>
            <h6 class="text-lg opacity-80">{{ landingInfo.hero_desc }}</h6>
            <p class="text-sm font-mono opacity-60">{{ landingInfo.hero_tags }}</p>

            <NuxtLink v-if="landingInfo.hero_button[0].active" :to="landingInfo.hero_button[0].link"
                      :title="`click button to visit ${landingInfo.hero_button[0].text}`"
                      class="mt-4">
              <Button @click="Lit.event('click-hero-button')"
                      class="text-xl p-8 rounded-full z-2 bg-white/50 text-black/80 hover:bg-white cursor-pointer shadow-md">
                {{ landingInfo.hero_button[0].text }}
              </Button>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>