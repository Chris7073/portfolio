<script setup lang="ts">
definePageMeta({
    middleware: 'auth-dashboard'
})
const { data: portfolioProjects } = useFetch('/api/portfolio-posts');
const route = useRoute();
const currentProjectObject = computed(() => {
    if (!portfolioProjects.value) {
        return null;
    }
    const paramId = route.params.id as string;
    return portfolioProjects.value.find(p => p.post_id === paramId);
});


</script>

<template>
    <div class="bg-gray-100 p-4 flex justify-between">
        <div class="content-center"> {{ currentProjectObject?.post_name }} </div>
        <div>
            <Button variant="outline">a</Button>
            <Button class="bg-blue-500 hover:bg-blue-400">a</Button>
        </div>
    </div>
    {{ currentProjectObject?.post_name }}
</template>