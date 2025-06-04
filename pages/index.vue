<script lang="ts" setup>
definePageMeta({
    middleware: 'web-maintenance'
})

const { pending: isLoadingLanding } = useFetch('/api/landing-settings');
const { pending: isLoadingPortfolio } = useFetch('/api/portfolio-posts');
const { data: websiteInfo, pending: isLoadingInfo } = await useFetch('/api/web-settings');
useHead({
    title: computed(() => isLoadingInfo ? `${websiteInfo.value?.name} - ${websiteInfo.value?.desc}` : 'Caricamento...')
})
const isLoading = computed(() => {
    return isLoadingLanding.value || isLoadingPortfolio.value;
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
