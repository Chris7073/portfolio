<script lang="ts" setup>
definePageMeta({
    middleware: 'web-maintenance'
})

const { data: landingSettings } = await useFetch('/api/landing-settings');
const { data: portfolioPosts } = await useFetch('/api/portfolio-posts');
const { data: websiteInfo } = await useFetch('/api/web-settings');
useHead({
    title: () => `${websiteInfo.value?.name} - ${websiteInfo.value?.desc}`
})

</script>
<template>
    <Suspense>
        <template #default>
            <div>
                <HomeSectionsHero />
                <Navbar />
                <HomeSectionsMyStory />
                <HomeSectionsPortfolio />
                <Footer />
            </div>
        </template>
        
        <template #fallback>
            <LoadingPage />
        </template>
    </Suspense>
</template>
