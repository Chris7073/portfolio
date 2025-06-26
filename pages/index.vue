<script setup lang="ts">

definePageMeta({
  middleware: 'web-maintenance'
})

const { data: websiteInfo } = await useFetch('/api/web-settings', {
  default: () => ({
    name: 'Christian Cicciarella',
    desc: 'My work is driven by a passion for clean aesthetics and creative problem-solving.'
  })
});

// --- SEO / META TAGS ---
// Questa parte è già corretta. `useHead` ora popola i tag sul server
// in modo ottimale per la SEO, senza errori.

const requestURL = useRequestURL();

useHead(() => ({
  title: `${websiteInfo.value.name} - my Tiny Portfolio`,
  meta: [
    {
      name: 'description',
      content: websiteInfo.value.desc
    },
    {
      name: 'keywords',
      content: 'web design, graphic design, portfolio, creative developer, ui, ux, nuxtjs, vuejs, figma, chris, christian cicciarella'
    },
    // --- OPEN GRAPH (Facebook, LinkedIn, etc.) ---
    { property: 'og:title', content: websiteInfo.value.name },
    { property: 'og:description', content: websiteInfo.value.desc },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: requestURL.origin },
    { property: 'og:site_name', content: `${websiteInfo.value.name} - my Tiny Portfolio` },
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
    <main>
      <HomeSectionsHero />
    
    <div class="relative z-20 bg-slate-100 dark:bg-slate-900">
      <Navbar />
      <HomeSectionsMyStory />
      <HomeSectionsMyStats />
      <HomeSectionsPortfolio />
    </div>
    </main>
    <Footer />
  </div>
</template>
