<script lang="ts" setup>
import { computed } from 'vue';

definePageMeta({
    middleware: 'web-maintenance'
})

// Chiamate `useFetch` non bloccanti con l'opzione `lazy`
const { data: landingSettings, pending: landing } = useFetch('/api/landing-settings', { lazy: true });
const { data: portfolioPosts, pending: posts } = useFetch('/api/portfolio-posts', { lazy: true });
const { data: websiteInfo, pending: website } = useFetch('/api/web-settings', { lazy: true });

// Titolo difensivo che gestisce il caso in cui `websiteInfo` non è ancora caricato
useHead({
    title: () => websiteInfo.value
        ? `${websiteInfo.value.name} - ${websiteInfo.value.desc}`
        : 'Caricamento...'
})

useHead(() =>({
  title: () => websiteInfo.value
        ? `${websiteInfo.value.name} - ${websiteInfo.value.desc}`
        : 'Caricamento...',
  meta: [
      // --- 2. OPEN GRAPH (Facebook, LinkedIn, WhatsApp, etc.) ---
      { property: 'og:title', content: websiteInfo.value?.name },
      { property: 'og:description', content: websiteInfo.value?.desc },
      { property: 'og:type', content: 'website' }, // 'article' è più specifico di 'website' per un post/progetto
      { property: 'og:url', content: `${window.location.origin}` },
      { property: 'og:site_name', content: `${websiteInfo.value?.name} - ${websiteInfo.value?.desc}` }, // Nome del tuo sito
      { property: 'og:locale', content: 'it_IT' },
      
      // Immagine Open Graph
      { property: 'og:image', content: `${window.location.origin}/assets/me.jpg` },
      { property: 'og:image:width', content: '1200' }, // Larghezza raccomandata
      { property: 'og:image:height', content: '630' }, // Altezza raccomandata
      { property: 'og:image:alt', content: `Immagine di anteprima per ${websiteInfo.value?.name}` },

      // --- 3. TWITTER CARDS ---
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: websiteInfo.value?.name },
      { name: 'twitter:description', content: websiteInfo.value?.desc },
      { name: 'twitter:image', content: `${window.location.origin}/assets/me.jpg` },
      { name: 'twitter:image:alt', content: `Immagine di anteprima di ${websiteInfo.value?.name}` },
    ],
}))

// La nostra computed property per un controllo pulito nel template
const isLoading = computed(() => {
    return landing.value || posts.value || website.value;
});

</script>
<template>
    <div v-if="isLoading">
        <LoadingPage />
    </div>

    <div v-else>
        <HomeSectionsHero />
        <Navbar />
        <HomeSectionsMyStory />
        <HomeSectionsPortfolio />
        <Footer />
    </div>
</template>
