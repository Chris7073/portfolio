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
