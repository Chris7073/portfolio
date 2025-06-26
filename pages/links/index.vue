<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

// --- I tuoi Fetch dei Dati (invariati) ---
const { data: socialLinks } = useFetch('/api/social-links-settings');
const { data: webSettings } = useFetch('/api/web-settings', {
  default: () => ({
    name: 'Christian Cicciarella',
    desc: 'My work is driven by a passion for clean aesthetics and creative problem-solving.'
  })

});
const { data: landingInfo } = await useFetch('/api/landing-settings');

// --- Le tue Computed Properties e Funzioni (invariate) ---
const backgroundColor = computed(() => {
    const bg = landingInfo.value?.hero_bg?.[0];
    if (!bg || !bg.bg_color_1) return 'background-color: #CCCCCC;';
    if (bg.bg_type === "solid") return `background-color: ${bg.bg_color_1}`;
    if ((bg.bg_type === 'linear') && bg.bg_color_1 && bg.bg_color_2) return `background-image: linear-gradient(to bottom, ${bg.bg_color_1}, ${bg.bg_color_2});`;
    if (bg.bg_type === 'radial') return `background-image: radial-gradient(circle, ${bg.bg_color_1}, ${bg.bg_color_2});`;
    return `background-color: ${bg.bg_color_1}`;
});
const backgroundImageStyle = computed(() => {
    const imageUrl = landingInfo.value?.hero_bg?.[0]?.bg_image;
    if (imageUrl) return { backgroundImage: `url(${imageUrl})`, backgroundRepeat: 'repeat', backgroundPosition: 'center', backgroundSize: '80px', opacity: 0.02 };
    return {};
});
const { icons } = useSocialIcons();
function getIconName(iconId: number) {
    const found = icons.find(icon => icon.id === iconId);
    return found ? found.icon : 'uil:globe';
}
const mainLinks = [
    { title: 'Il Mio Portfolio', url: '#', icon: 'lucide:briefcase' },
    { title: 'Contattami', url: 'mailto:tua-email@example.com', icon: 'lucide:mail' },
    { title: 'Leggi i miei Articoli', url: '#', icon: 'lucide:pencil-line' },
]

// --- Logica Animazioni Corretta con Timer Sincronizzato ---
const cardVisible = ref(false);
const typingDone = ref(false);
const { themePreference } = useTheme();
onMounted(() => {
    themePreference.value = 'dark';
    // FASE 1: Apparizione Card
    setTimeout(() => {
        cardVisible.value = true;
    }, 100);

    // FASE 2: Contenuto Principale.
    // Il timer è calcolato precisamente dal CSS:
    // animation-delay (0.8s) + animation-duration (1.5s) = 2.3s
    setTimeout(() => {
        typingDone.value = true;
    }, 2000); // 800ms di delay + 1500ms di durata = 2300ms
});

const requestURL = useRequestURL();

useHead(() => ({
  title: `${webSettings?.value.name} - my Tiny Portfolio`,
  meta: [
    {
      name: 'description',
      content: webSettings?.value.desc
    },
    {
      name: 'keywords',
      content: 'web design, graphic design, portfolio, creative developer, ui, ux, nuxtjs, vuejs, figma, chris, christian cicciarella'
    },
    // --- OPEN GRAPH (Facebook, LinkedIn, etc.) ---
    { property: 'og:title', content: webSettings?.value.name },
    { property: 'og:description', content: webSettings?.value.desc },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: requestURL.origin },
    { property: 'og:site_name', content: `${webSettings?.value.name} - my Tiny Portfolio` },
    { property: 'og:locale', content: 'it_IT' },
    { property: 'og:image', content: `${requestURL.origin}/assets/me.jpg` }, // Assicurati che questa immagine esista nella cartella /public
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: `Immagine di anteprima per ${webSettings?.value.name}` },

    // --- TWITTER CARDS ---
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: webSettings?.value.name },
    { name: 'twitter:description', content: webSettings?.value.desc },
    { name: 'twitter:image', content: `${requestURL.origin}/assets/me.jpg` }, // Assicurati che questa immagine esista nella cartella /public
    { name: 'twitter:image:alt', content: `Immagine di anteprima di ${webSettings?.value.name}` },
  ],
}))
</script>

<template>
    <main
        class="min-h-screen text-foreground flex items-center justify-center p-4 transition-colors duration-300 overflow-hidden flex-col gap-2"
        :style="backgroundColor">
        <div class="absolute inset-0 z-0" :style="backgroundImageStyle"></div>

        <div v-if="cardVisible"
            class="w-full max-w-md mx-auto flex flex-col gap-y-5 
                   bg-white/60 dark:bg-slate-900/40 border border-slate-900/10 dark:border-slate-50/20 backdrop-blur-xl p-6 rounded-2xl animate-card-in">

            <section class="flex flex-col items-center text-center">
                <Avatar class="h-24 w-24 border-2 border-slate-900/10 dark:border-slate-50/20 animate-avatar-in"
                    :style="`background-color:${landingInfo?.hero_bg[0].bg_color_1}`">
                    <AvatarImage src="/assets/chris.png" alt="@christiancicciarella"
                        class="hover:rotate-6 transition-all duration-400" />
                    <AvatarFallback>CC</AvatarFallback>
                </Avatar>
                <h1 ref="headingRef" class="text-2xl font-semibold mt-4 text-slate-900 dark:text-slate-50"
                    :class="{ 'animate-typing-cursor': !typingDone }">
                    {{ webSettings?.name }}
                </h1>
            </section>

            <div class="flex flex-col gap-y-4">
                <p class="text-center text-slate-700 dark:text-slate-400 transition-all duration-500"
                    :class="typingDone ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'"
                    :style="{ 'transition-delay': '0ms' }">
                    {{ webSettings?.desc }}
                </p>

                <NuxtLink to="https://www.christiancicciarella.it" target="_blank">
                    <Button variant="outline"
                        class="w-full h-14 text-base sm:text-lg 
                           bg-white/50 dark:bg-violet-700/20 
                           border-slate-900/10 dark:border-violet-500/20 
                           hover:bg-white/95 dark:hover:bg-violet-700/60
                           text-slate-800 dark:text-slate-100 transition-all duration-200 ease-out hover:scale-[1.03] active:scale-[0.98]"
                        :class="typingDone ? 'opacity-100 translate-y-0 duration-800' : 'opacity-0 translate-y-8'">

                        <div class="flex items-center justify-center w-full">
                            <Icon name="uil:link-alt" class="h-5 w-5 mr-3" />
                            <span>Portfolio</span>
                        </div>
                    </Button>
                </NuxtLink>

                <NuxtLink v-for="(social, index) of socialLinks" :to="social.link" target="_blank">
                    <Button variant="outline"
                        class="w-full h-14 text-base sm:text-lg 
                           bg-white/50 dark:bg-black/20 
                           border-slate-900/10 dark:border-white/20 
                           hover:bg-white/95 dark:hover:bg-black/40
                           text-slate-800 dark:text-slate-100 transition-all duration-200 ease-out hover:scale-[1.03] active:scale-[0.98]"
                        :class="typingDone ? 'opacity-100 translate-y-0 duration-800' : 'opacity-0 translate-y-8'"
                        :style="{ 'transition-delay': `${50 + index * 20}ms` }">
                        <div class="flex items-center justify-center w-full">
                            <Icon :name="getIconName(social.icon)" class="h-5 w-5 mr-3" />
                            <span>{{ social.link.split('.')[1] }}</span>
                        </div>
                    </Button>
                </NuxtLink>


            </div>

        </div>
        <h6 class="text-xs text-gray-300"
            :class="typingDone ? 'opacity-100 translate-y-0 duration-300' : 'opacity-0 -translate-y-4'">
            {{ webSettings?.name }}</h6>
    </main>
</template>

<style>
/* Animazioni Originali (invariate) */
@keyframes card-in {
    from {
        opacity: 0;
        transform: scale(0.95);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

.animate-card-in {
    animation: card-in 0.6s cubic-bezier(0.2, 1, 0.3, 1) forwards;
}

@keyframes avatar-in {
    from {
        opacity: 0;
        transform: translateY(-20px) scale(0.9);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.animate-avatar-in {
    animation: avatar-in 0.5s ease-out 0.4s forwards;
    opacity: 0;
}

@keyframes typing {
    from {
        width: 0;
    }

    to {
        width: 100%;
    }
}

@keyframes blink-caret {

    from,
    to {
        border-color: transparent;
    }

    50% {
        border-color: currentColor;
    }
}

.animate-typing-cursor {
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    border-right: 3px solid transparent;
    width: 0;
    animation:
        typing 1.5s steps(30, end) forwards,
        blink-caret .75s step-end infinite;
    animation-delay: 0.8s;
}
</style>