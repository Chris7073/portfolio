<script lang='ts' setup>
useHead({
    title: 'Maintenance Mode',
    meta: [
        { name: 'robots', content: 'noindex, nofollow' }
    ]
})

const { data: socialLinks } = useFetch('/api/social-links-settings');
const { data: webSettings } = useFetch('/api/web-settings');

const { icons } = useSocialIcons();

function getIconName(iconId: number) {
    const found = icons.find(icon => icon.id === iconId);
    return found ? found.icon : 'uil:globe';
}
</script>
<template>
    <div
        class="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4 sm:p-6 lg:p-8">

        <div
            class="text-center bg-white rounded-xl shadow-2xl p-8 sm:p-10 md:p-12 max-w-lg w-full transform transition-all duration-300 hover:scale-101">

            <Icon name="pajamas:issue-type-maintenance" class="text-6xl mx-auto mb-8 text-indigo-500 animate-pulse" />

            <h1 class="text-3xl font-extrabold text-gray-800 mb-4 leading-tight">
                Maintenance mode
            </h1>

            <p class="text-md text-gray-600 mb-8 px-2">
                {{ webSettings ? webSettings.maintenance_desc : 'Work in progress..' }}
            </p>
            <Separator label="Stay Updated" class="my-4" />
            <div class="flex justify-center gap-2">
                <div v-for="social of socialLinks">
                    <NuxtLink v-if="social.active" :to="social.link" title="Visit my social" target="_blank">
                        <Button size="icon"
                            class="bg-white/80 text-blue-500 text-2xl border-blue-500/50 hover:bg-blue-500 hover:text-white">
                            <Icon :name="getIconName(social.icon)" />
                        </Button>
                    </NuxtLink>
                </div>

            </div>

        </div>
    </div>
</template>
