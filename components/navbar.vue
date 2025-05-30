<script lang="ts" setup>
import { DialogsContatti } from '#components';
const { data: websiteInfo } = useFetch('/api/web-settings')
const { data: socialLinks, refresh } = useFetch('/api/social-links-settings');

const { icons } = useSocialIcons();

function getIconName(iconId: number) {
  const found = icons.find(icon => icon.id === iconId);
  return found ? found.icon : 'uil:globe'; // oppure 'default-icon'
}

const dialog = useDialog();
function showContattiDialog() {
    dialog.open({
        body: DialogsContatti,
        title: "Contatti",
        description: "Descrizione",
    })
}
</script>

<template>
    <div class="bg-gray-50/80 w-full p-4 sticky top-0 backdrop-blur-sm shadow-md z-[1000]">
        <div class="flex justify-between">
            <NuxtLink to="/">
                <h1 class="uppercase font-thin grid h-full content-center">{{ websiteInfo?.name }}</h1>
            </NuxtLink>
            <div class="flex gap-4">
                <div class="flex gap-2">
                    <div v-for="social of socialLinks">
                        <NuxtLink v-if="social.active" :to="social.link">
                            <Button size="icon"
                                class="bg-white/80 text-blue-500 text-xl border-blue-500/50 hover:bg-blue-500 hover:text-white">
                                <Icon :name="getIconName(social.icon)" />
                            </Button>
                        </NuxtLink>
                    </div>

                </div>

                <Button @click="showContattiDialog()"
                    class="bg-linear-to-t from-indigo-500 to-sky-500 cursor-pointer">Contattami</Button>
            </div>
        </div>
    </div>

</template>