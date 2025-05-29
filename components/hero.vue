<script type="ts" setup>
const { data: landingInfo } = useFetch('/api/landing-settings')
watchEffect(() => {
  console.log('landingInfo:', landingInfo)
})
const backgroundColor = computed(() => {

  if (!landingInfo.value) return 'background-color: #CCCCCC';

  const bg = landingInfo.value.hero_bg[0];
  if (!bg) return 'background-color: #CCCCCC';

  if (bg.bg_type==="solid") {
    return `background-color: ${bg.bg_color_1}`;
  } else{
    return `background: ${bg.bg_type}-gradient(${bg.bg_color_1},${bg.bg_color_2});`;

  }
  }
);
</script>
<template>
  <div v-if="landingInfo?.hero" class="grid h-dvh " :style="backgroundColor">
    <div class="content-center text-center h-full":style="'color:'+landingInfo.hero_bg[0].bg_text_color">
      <Icon name="uil:user" class="text-5xl" />
      <div class="text-4xl" >{{ landingInfo.hero_title }}</div>
      <div class="pb-6 opacity-80">{{ landingInfo.hero_desc }}</div>
      <div v-if="landingInfo.hero_button[0].active">
        <NuxtLink :to="landingInfo.hero_button[0].link">
          <Button
            class="text-xl p-8 rounded-full bg-white/50 text-black/80 hover:bg-white cursor-pointer shadow-md">{{ landingInfo.hero_button[0].text }}</Button>
        </NuxtLink>
      </div>

    </div>
  </div>
</template>