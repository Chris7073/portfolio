<script type="ts" setup>
const { data: landingInfo, pending } = useFetch('/api/landing-settings')
watchEffect(() => {
  console.log('hero loaded status:', pending)
})
const backgroundColor = computed(() => {

  if (!landingInfo.value) return 'background-color: #CCCCCC';

  const bg = landingInfo.value.hero_bg[0];
  if (!bg) return 'background-color: #CCCCCC';

  if (bg.bg_type === "solid") {
    return `background-color: ${bg.bg_color_1}`;
  } else {
    return `background: ${bg.bg_type}-gradient(${bg.bg_color_1},${bg.bg_color_2});`;

  }
}
);
</script>
<template>
  <div v-if="pending" class="h-dvh bg-gray-200">
    <div class="flex items-center justify-center h-full w-full">
      <div class="flex flex-col gap-2">
        <Skeleton class="w-50 bg-gray-300 h-5" />
        <Skeleton class="w-50 bg-gray-300 h-2" />
        <Skeleton class="w-50 bg-gray-400/80 h-10 mt-4" />
      </div>
    </div>
  </div>
  <div v-else>
    <div v-if="landingInfo?.hero" class="grid h-dvh " :style="backgroundColor">
      <div class="content-center text-center h-full" :style="'color:' + landingInfo.hero_bg[0].bg_text_color">
        <Icon name="uil:user" class="text-5xl" />
        <div class="text-4xl">{{ landingInfo.hero_title }}</div>
        <div class="pb-6 opacity-80">{{ landingInfo.hero_desc }}</div>
        <div v-if="landingInfo.hero_button[0].active">
          <NuxtLink :to="landingInfo.hero_button[0].link">
            <Button
              class="text-xl p-8 rounded-full bg-white/50 text-black/80 hover:bg-white cursor-pointer shadow-md">{{
                landingInfo.hero_button[0].text }}</Button>
          </NuxtLink>
        </div>

      </div>
    </div>
  </div>
</template>