<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware:'auth-dashboard'
})

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'


import { ref, watch } from 'vue'
const { data: landingInfo, refresh } = useFetch('/api/landing-settings')
const currentLandingInfo = ref({
  hero: null,
  hero_title: '',
  hero_desc: '',
  hero_button: [{
    active: false,
    text: '',
    link: ''
  }],
  hero_bg: [{
    bg_type: 'solid',
    bg_text_color: '',
    bg_color_1: '',
    bg_color_2: '',
    bg_image: '',
  }]
})

//HERO
const checkHeroChanges = computed(() => {
  if (!landingInfo.value) return;
  if (currentLandingInfo.value.hero !== landingInfo.value.hero) return true;
  if (currentLandingInfo.value.hero_title !== landingInfo.value.hero_title) return true;
  if (currentLandingInfo.value.hero_desc !== landingInfo.value.hero_desc) return true;

  if (currentLandingInfo.value.hero_button[0].active !== landingInfo.value.hero_button[0].active) return true;
  if (currentLandingInfo.value.hero_button[0].text !== landingInfo.value.hero_button[0].text) return true;
  if (currentLandingInfo.value.hero_button[0].link !== landingInfo.value.hero_button[0].link) return true;

  if (currentLandingInfo.value.hero_bg[0].bg_type !== landingInfo.value.hero_bg[0].bg_type) return true;
  if (currentLandingInfo.value.hero_bg[0].bg_text_color !== landingInfo.value.hero_bg[0].bg_text_color) return true;
  if (currentLandingInfo.value.hero_bg[0].bg_color_1 !== landingInfo.value.hero_bg[0].bg_color_1) return true;
  if (currentLandingInfo.value.hero_bg[0].bg_color_2 !== landingInfo.value.hero_bg[0].bg_color_2) return true;
  if (currentLandingInfo.value.hero_bg[0].bg_image !== landingInfo.value.hero_bg[0].bg_image) return true;

  return false;
});

watch(landingInfo, (newVal) => {
  if (!newVal) return;
  currentLandingInfo.value.hero = newVal.hero as any;
  currentLandingInfo.value.hero_title = newVal.hero_title;
  currentLandingInfo.value.hero_desc = newVal.hero_desc;

  currentLandingInfo.value.hero_button[0].active = newVal.hero_button[0].active;
  currentLandingInfo.value.hero_button[0].text = newVal.hero_button[0].text;
  currentLandingInfo.value.hero_button[0].link = newVal.hero_button[0].link;

  currentLandingInfo.value.hero_bg[0].bg_type = newVal.hero_bg[0].bg_type;
  currentLandingInfo.value.hero_bg[0].bg_text_color = newVal.hero_bg[0].bg_text_color;
  currentLandingInfo.value.hero_bg[0].bg_color_1 = newVal.hero_bg[0].bg_color_1;
  currentLandingInfo.value.hero_bg[0].bg_color_2 = newVal.hero_bg[0].bg_color_2;
  currentLandingInfo.value.hero_bg[0].bg_image = newVal.hero_bg[0].bg_image;

  console.log(currentLandingInfo.value)
});

async function updateHeroSettings() {
  try {
    await fetch('/api/websettings/update-landing-settings/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentLandingInfo.value),
    })
    showToast('Hero updated successfully', 'success')
    await refresh()
  } catch (error) {
    showToast('Failed to update Hero:' + error, 'error')
  }
}

const stylePreview = computed(() => {
  const hero = currentLandingInfo.value.hero_bg;
  const result: string[] = []
  result.push(`color:${currentLandingInfo.value.hero_bg[0].bg_text_color};`)
  result.push(hero[0].bg_type === 'solid' ? 'background-color:' + hero[0].bg_color_1 : `background: ${hero[0].bg_type}-gradient(${hero[0].bg_color_1},${hero[0].bg_color_2});`)
  return result.join('')
})

function invertColors() {
  const bgColor1 = ref(currentLandingInfo.value.hero_bg[0].bg_color_1)
  const bgColor2 = ref(currentLandingInfo.value.hero_bg[0].bg_color_2)
  const temp = bgColor1.value
  bgColor1.value = bgColor2.value
  bgColor2.value = temp

  // Aggiorna anche l’oggetto originale se necessario
  currentLandingInfo.value.hero_bg[0].bg_color_1 = bgColor1.value
  currentLandingInfo.value.hero_bg[0].bg_color_2 = bgColor2.value
  console.log([bgColor1.value, bgColor2.value])
}
</script>

<template>
  <div>
    <Card>
      <CardHeader>
        <CardTitle class="content-middle flex">
          <Icon name="uil:web-section" class="text-lg mr-2" />
          Landing Page Settings
        </CardTitle>
        <CardDescription>Here you can edit your landing page</CardDescription>

      </CardHeader>
      <CardContent class="grid gap-4">
        <Accordion type="single" collapsible class="bg-gray-100 border-2 border-gray-200 rounded-lg px-4">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <span>
                HERO
                <Badge class="ml-4" variant="outline"
                  :class="landingInfo?.hero ? 'bg-green-500/80 text-white' : 'bg-gray-200'">{{ landingInfo?.hero ?
                    'Enabled' : 'Disabled' }}</Badge>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent class="p-6">
                  <div class="flex gap-2">
                    <Checkbox v-model="currentLandingInfo.hero" />
                    <div class="grid gap-1.5 leading-none">
                      <Label for="terms1"
                        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Activate Hero
                      </Label>
                      <p class="text-sm text-muted-foreground">
                        This shows or hide the Hero on your landing page
                      </p>
                    </div>
                  </div>
                  <div v-if="currentLandingInfo.hero" class="pt-8 grid gap-4">
                    <div>
                      <Label for="hero_title">Title</Label>
                      <Input type="text" id="hero_title" v-model="currentLandingInfo.hero_title" />
                    </div>
                    <div>
                      <Label for="hero_desc">Description</Label>
                      <Input type="text" id="hero_desc" v-model="currentLandingInfo.hero_desc" />
                    </div>
                    <div>
                      <Label for="hero_text_color">Text Color</Label>
                      <Input class="h-16 w-20" type="color" id="hero_text_color"
                        v-model="currentLandingInfo.hero_bg[0].bg_text_color" />
                    </div>
                    <Separator class="my-4" label="Button" />
                    <div class="flex gap-2">
                      <Checkbox v-model="currentLandingInfo.hero_button[0].active" />
                      <div class="grid gap-1.5 leading-none">
                        <Label for="terms1"
                          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Button
                        </Label>
                        <p class="text-sm text-muted-foreground">
                          This shows or hide a button in your Hero Section
                        </p>
                      </div>
                    </div>
                    <div v-if="currentLandingInfo.hero_button[0].active" class="pt-4 grid gap-4">
                      <div>
                        <Label for="hero_button_text">Button Text</Label>
                        <Input type="text" id="hero_button_text" v-model="currentLandingInfo.hero_button[0].text" />
                      </div>
                      <div>
                        <Label for="hero_button_link">Destination Link</Label>
                        <Input type="text" id="hero_button_link" v-model="currentLandingInfo.hero_button[0].link" />
                      </div>
                    </div>

                    <Separator class="my-4" label="Background" />

                    <div class="flex flex-col gap-2">
                      <Label>Background type</Label>
                      <Select v-model="currentLandingInfo.hero_bg[0].bg_type">
                        <SelectTrigger>
                          <SelectValue placeholder="Background type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="solid">
                              Solid
                            </SelectItem>
                            <SelectItem value="linear">
                              Linear
                            </SelectItem>
                            <SelectItem value="radial">
                              Radial
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div class="flex flex-col gap-4">
                      <div class="flex gap-2 justify-between">
                        <div>
                          <Label for="hero_bg_1">
                            {{ currentLandingInfo.hero_bg[0].bg_type === "solid" ? 'Background Color' : 'Color 1' }}
                          </Label>
                          <Input class="h-16 w-20" type="color" id="hero_bg_1"
                            v-model="currentLandingInfo.hero_bg[0].bg_color_1" />
                        </div>

                        <div v-if="currentLandingInfo.hero_bg[0].bg_type !== 'solid'" class="content-center">
                          <Button size="icon" @click="invertColors">
                            <Icon name="uil:sync" class="text-xl" />
                          </Button>
                        </div>
                        <div v-if="currentLandingInfo.hero_bg[0].bg_type !== 'solid'">
                          <div>
                            <Label for="hero_bg_2">Color 2</Label>
                            <Input class="h-16 w-20" type="color" id="hero_bg_2"
                              v-model="currentLandingInfo.hero_bg[0].bg_color_2" />
                          </div>
                        </div>
                      </div>
                      <Separator class="my-4" label="Preview" />
                      <div class="col-span-3">
                        <div class="h-100 flex justify-center" :style="stylePreview">
                          <div class="content-center text-center h-full">
                            <Icon name="uil:user" class="text-5xl" />
                            <div class="text-4xl">{{ currentLandingInfo.hero_title }}</div>
                            <div class="pb-6 opacity-80">{{ currentLandingInfo.hero_desc }}</div>
                            <div v-if="currentLandingInfo.hero_button[0].active">

                              <Button
                                class="text-xl p-8 rounded-full bg-white/50 text-black/80 hover:bg-white cursor-pointer shadow-md">{{
                                  currentLandingInfo.hero_button[0].text }}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button class="my-6 w-full" :disabled="!checkHeroChanges" @click="updateHeroSettings">Save Hero
                    Settings</Button>

                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  </div>
</template>
