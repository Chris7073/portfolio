<script type="ts" setup>
import { Lit } from "litlyx-js"

const { data: landingInfo, pending } = useFetch('/api/landing-settings')
const backgroundColor = computed(() => {

  if (!landingInfo.value) return 'background-color: #CCCCCC';

  const bg = landingInfo.value.hero_bg[0];
  if (!bg) return 'background-color: #CCCCCC';

  if (bg.bg_type === "solid") {
    return `background-color: ${bg.bg_color_1}`;
  } else {
    return `background: ${bg.bg_type}-gradient(${bg.bg_color_1},${bg.bg_color_2});`;

  }
}
);

const backgroundImageStyle = computed(() => {
  const imageUrl = landingInfo.value?.hero_bg?.[0]?.bg_image;

  if (imageUrl) {
    return {
      backgroundImage: `url(${imageUrl})`,
      backgroundRepeat: 'repeat',
      backgroundPosition: 'center',
      backgroundSize: '80px', // Pattern con immagini piccole
      opacity: 0.02 // Opacità al minimo, applicata SOLO a questo livello!
    };
  }
  return {};
});

const fixedHeaderElement = ref(null);
const maxBrightness = 1.0;
const minBrightness = 0.4;

let scrollEffectRange = 200;

const handleScroll = () => {
  if (!fixedHeaderElement.value) {
    return;
  }

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
  handleScroll(); // Chiama subito per applicare lo stile iniziale (utile se la pagina carica già scrollata)
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
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
              <Button
              @click="Lit.event('click-hero-button')"
                class="text-xl p-8 rounded-full z-2 bg-white/50 text-black/80 hover:bg-white cursor-pointer shadow-md">{{
                  landingInfo.hero_button[0].text }}</Button>
            </NuxtLink>
          </div>

        </div>
      </div>
    </div>
  </div>

</template>