<script setup lang="ts">
// L'import di 'computed' non è più strettamente necessario con questa logica,
// ma lo lasciamo nel caso servisse per altro.
import { computed } from 'vue';

// Il tuo middleware di pagina rimane invariato.
definePageMeta({
  middleware: 'web-maintenance'
})

// --- DATA FETCHING ---
// Le chiamate useFetch sono corrette: sono bloccanti sul server (senza `lazy: true`)
// e hanno un valore di `default` per garantire la sicurezza dei tipi.
// QUESTA PARTE È GIÀ CORRETTA E NON VA TOCCATA.

const { data: landingSettings } = await useFetch('/api/landing-settings', {
  default: () => ({
    hero: false,
    story: false,
    // ... includi altre proprietà con valori di default se necessario
  })
});

const { data: portfolioPosts } = await useFetch('/api/portfolio-posts', {
  default: () => []
});

const { data: websiteInfo } = await useFetch('/api/web-settings', {
  default: () => ({
    name: 'Nome del Sito',
    desc: 'Descrizione del sito.'
  })
});

// --- SEO / META TAGS ---
// Questa parte è già corretta. `useHead` ora popola i tag sul server
// in modo ottimale per la SEO, senza errori.

const requestURL = useRequestURL();

useHead(() => ({
  title: `${websiteInfo.value.name} - ${websiteInfo.value.desc}`,
  meta: [
    // --- OPEN GRAPH (Facebook, LinkedIn, etc.) ---
    { property: 'og:title', content: websiteInfo.value.name },
    { property: 'og:description', content: websiteInfo.value.desc },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: requestURL.origin },
    { property: 'og:site_name', content: `${websiteInfo.value.name} - ${websiteInfo.value.desc}` },
    { property: 'og:locale', content: 'it_IT' },
    { property: 'og:image', content: `${requestURL.origin}/assets/me.jpg` }, // Assicurati che questa immagine esista nella cartella /public
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: `Immagine di anteprima per ${websiteInfo.value.name}` },

    // --- TWITTER CARDS ---
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: websiteInfo.value.name },
    { name: 'twitter:description', content: websiteInfo.value.desc },
    { name: 'twitter:image', content: `${requestURL.origin}/assets/me.jpg` }, // Assicurati che questa immagine esista nella cartella /public
    { name: 'twitter:image:alt', content: `Immagine di anteprima di ${websiteInfo.value.name}` },
  ],
}))

</script>

<template>
  <div>
    <HomeSectionsHero />
    <div id="navbar-trigger"></div>
    <Navbar trigger-selector="#navbar-trigger"/>

    <HomeSectionsMyStory />
    
    <HomeSectionsPortfolio />
    <HomeSectionsMyStats/>
    <Footer />
  </div>
</template>