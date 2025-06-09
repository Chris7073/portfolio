<script setup lang="ts">
// Nota: la sintassi corretta e standard è "lang='ts'" e "setup"
import { Lit } from "litlyx-js"

// 1. DATA FETCHING SICURO: Aggiunto un 'default' per prevenire che 'landingInfo' sia 'null'.
const { data: landingInfo, pending } = await useFetch('/api/landing-settings', {
  default: () => ({
    hero: false,
    hero_title: 'Benvenuto',
    hero_desc: '...',
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

// 2. COMPUTED PROPERTIES SICURE: Uso l'optional chaining (?.) per accedere
//    a proprietà annidate senza causare errori se la struttura non fosse completa.
const backgroundColor = computed(() => {
  // 1. Accesso sicuro ai dati usando l'optional chaining.
  const bg = landingInfo.value?.hero_bg?.[0];

  // 2. Se non ci sono dati per lo sfondo o manca il primo colore,
  //    ritorniamo uno stile di fallback semplice e sicuro.
  if (!bg || !bg.bg_color_1) {
    return 'background-color: #CCCCCC;';
  }

  // 3. Se il tipo è solido, usiamo semplicemente il primo colore.
  if (bg.bg_type === "solid") {
    return `background-color: ${bg.bg_color_1}`;
  }

  // 4. LA LOGICA CHIAVE: Tentiamo di creare un gradiente SOLO se
  //    abbiamo un tipo (linear o radial) E due colori validi.
  if ((bg.bg_type === 'linear') && bg.bg_color_1 && bg.bg_color_2) {
    // Usiamo `background-image` che è la proprietà più corretta per i gradienti
    // e aggiungiamo direzioni/forme per un risultato prevedibile.
    return `background-image: ${bg.bg_type}-gradient(to bottom, ${bg.bg_color_1}, ${bg.bg_color_2});`;
  }
  else if (bg.bg_type === 'radial') {
    // Aggiungiamo 'circle' per un effetto più prevedibile
    return  `background-image: radial-gradient(circle, ${bg.bg_color_1}, ${bg.bg_color_2});`;
  }

  // 5. FALLBACK FINALE: Se il tipo è 'linear' o 'radial' ma manca il secondo colore,
  //    evitiamo di creare un gradiente rotto e usiamo il primo colore come sfondo solido.
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

// 3. LOGICA CLIENT-SIDE ISOLATA:
//    Tutta la logica che usa 'window' e manipola il DOM deve essere eseguita
//    solo sul client per evitare errori durante il rendering sul server.
const fixedHeaderElement = ref<HTMLElement | null>(null);

if (process.client) {
  const maxBrightness = 1.0;
  const minBrightness = 0.4;
  let scrollEffectRange = 200;

  const handleScroll = () => {
    if (!fixedHeaderElement.value) return;

    const scrollY = window.scrollY;
    const progress = Math.max(0, Math.min(1, scrollY / scrollEffectRange));
    const currentBrightness = maxBrightness - (maxBrightness - minBrightness) * progress;

    window.requestAnimationFrame(() => {
      if (fixedHeaderElement.value) {
        fixedHeaderElement.value.style.filter = `brightness(${currentBrightness})`;
      }
    });
  };

  onMounted(() => {
    if (fixedHeaderElement.value) {
      const headerHeight = fixedHeaderElement.value.offsetHeight;
      scrollEffectRange = headerHeight * 1.5;
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });
}
</script>
<template class="relative">
  <div ref="fixedHeaderElement" class="sticky top-0 z-1" style="transform-origin: center top;">
    <div v-if="pending" class="h-dvh bg-gray-200">
      <div class="flex items-center justify-center h-full w-full">
        <div class="flex flex-col gap-2">
          <Skeleton class="w-50 bg-gray-300 h-5" />
          <Skeleton class="w-50 bg-gray-300 h-2" />
          <Skeleton class="w-50 bg-gray-400/80 h-10 mt-4" />
        </div>
      </div>
    </div>
    <div v-else>
      <div v-if="landingInfo?.hero" class="grid h-dvh " :style="backgroundColor">
        <div class="absolute inset-0 z-0" :style="backgroundImageStyle"></div>
        <div class="content-center text-center h-full" :style="'color:' + landingInfo.hero_bg[0].bg_text_color">
          <Icon name="uil:user" class="text-5xl" />
          <div class="text-4xl">{{ landingInfo.hero_title }}</div>
          <div class="pb-6 opacity-80">{{ landingInfo.hero_desc }}</div>
          <div v-if="landingInfo.hero_button[0].active" class="relative z-5">
            <NuxtLink :to="landingInfo.hero_button[0].link">
              <Button @click="Lit.event('click-hero-button')"
                class="text-xl p-8 rounded-full z-2 bg-white/50 text-black/80 hover:bg-white cursor-pointer shadow-md">{{
                  landingInfo.hero_button[0].text }}</Button>
            </NuxtLink>
          </div>

        </div>
      </div>
    </div>
  </div>

</template>