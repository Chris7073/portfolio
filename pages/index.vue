<script lang="ts" setup>
const { pending:isLoadingLanding } = useFetch('/api/landing-settings');
const { pending:isLoadingPortfolio } = useFetch('/api/portfolio-posts');

const isLoading = computed(()=>{
    if(isLoadingLanding && isLoadingPortfolio) return true;
    return false;
})
</script>
<template>
    <div v-if="!isLoading" class="h-dvh bg-gray-200">
    <div class="flex items-center justify-center h-full w-full">
      <div class="flex flex-col gap-2">
        <Skeleton class="w-50 bg-gray-300 h-5" />
        <Skeleton class="w-50 bg-gray-300 h-2" />
        <Skeleton class="w-50 bg-gray-400/80 h-10 mt-4" />
      </div>
    </div>
    </div>
    <div v-else>
    <Hero/>
    <Navbar  />
    <Portfolio/>
    </div>
</template>