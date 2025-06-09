<script lang="ts" setup>
// Imports e definePageMeta (se questa è una pagina e non un componente)
import { ref, watch, computed } from 'vue'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

// MODIFICA: Aggiunta di `key` e `default` per rendere la chiamata robusta.
const { data: landingInfo, refresh } = useFetch('/api/landing-settings/', {
  key: 'landing-settings-hero',
  default: () => ({
    hero: false,
    hero_title: 'Caricamento...',
    hero_desc: '...',
    hero_button: [{ active: false, text: '', link: '' }],
    hero_bg: [{ bg_type: 'solid', bg_text_color: '#000000', bg_color_1: '#FFFFFF', bg_color_2: '#CCCCCC', bg_image: '' }]
  })
});

// Lo stato locale del form è corretto, lo manteniamo.
const currentLandingInfo = ref({
  hero: false,
  hero_title: '',
  hero_desc: '',
  hero_button: [{ active: false, text: '', link: '' }],
  hero_bg: [{ bg_type: 'solid', bg_text_color: '', bg_color_1: '', bg_color_2: '', bg_image: '' }]
});

// MODIFICA: `watch` ora è immediato e fa una copia profonda per sicurezza.
watch(landingInfo, (newVal) => {
  if (newVal) {
    currentLandingInfo.value = JSON.parse(JSON.stringify(newVal));
  }
}, {
  immediate: true // FONDAMENTALE per popolare il form al caricamento.
});

// MODIFICA: `checkChanges` ora è più semplice e sicuro grazie alla comparazione JSON.
const checkHeroChanges = computed(() => {
  if (!landingInfo.value) return false;
  return JSON.stringify(currentLandingInfo.value) !== JSON.stringify(landingInfo.value);
});

// MODIFICA: Funzione di salvataggio migliorata con $fetch e gestione errori.
async function updateHeroSettings() {
  try {
    await $fetch('/api/websettings/update-landing-settings/', { // URL di esempio, adattalo
      method: 'POST',
      body: {
        hero: currentLandingInfo.value.hero,
        hero_title: currentLandingInfo.value.hero_title,
        hero_desc: currentLandingInfo.value.hero_desc,
        hero_button: currentLandingInfo.value.hero_button,
        hero_bg: currentLandingInfo.value.hero_bg,
      }
    });
    showToast('Hero updated successfully', 'success');
    await refresh(); // Attendi il refresh dei dati
  } catch (error) {
    console.error('Failed to update Hero:', error);
    showToast('Failed to update Hero: ' + (error as Error).message, 'error');
  }
}

// MODIFICA: Logica per invertire i colori semplificata.
function invertColors() {
  const bg = currentLandingInfo.value.hero_bg[0];
  const temp = bg.bg_color_1;
  bg.bg_color_1 = bg.bg_color_2;
  bg.bg_color_2 = temp;
}

const stylePreview = computed(() => {
  // 1. Controlla se 'bg' esiste. Se no, esci subito.
  const bg = currentLandingInfo.value?.hero_bg?.[0];
  if (!bg) {
    return 'background-color: #CCCCCC;'; // Fallback di sicurezza
  }

  const textColor = `color: ${bg.bg_text_color || '#000000'};`;
  let backgroundStyle = `background-color: ${bg.bg_color_1 || '#CCCCCC'};`; // 2. Applica sempre un colore di base

  // 3. Crea il gradiente SOLO se entrambi i colori esistono e il tipo non è 'solid'
  if (bg.bg_type !== 'solid' && bg.bg_color_1 && bg.bg_color_2) {
    if (bg.bg_type === 'linear') {
      // Usiamo `background-image` che è la proprietà più corretta per i gradienti
      backgroundStyle = `background-image: linear-gradient(to bottom, ${bg.bg_color_1}, ${bg.bg_color_2});`;
    } 
    else if (bg.bg_type === 'radial') {
      // Aggiungiamo 'circle' per un effetto più prevedibile
      backgroundStyle = `background-image: radial-gradient(circle, ${bg.bg_color_1}, ${bg.bg_color_2});`;
    }
  }

  return `${textColor} ${backgroundStyle}`;
});

</script>

<template>
  <Accordion type="single" collapsible class="bg-gray-100 dark:bg-slate-800/50 border-2 border-gray-200 dark:border-slate-700 rounded-lg px-4">
    <AccordionItem value="item-1">
      <AccordionTrigger>
        <span class="dark:text-slate-100"> HERO
          <Badge class="ml-4" variant="outline"
            :class="landingInfo?.hero ? 'bg-green-500/80 text-white' : 'bg-gray-300 dark:bg-slate-600 dark:text-slate-200'">{{ landingInfo?.hero ?
              'Enabled' : 'Disabled' }}</Badge>
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <Card class="bg-white dark:bg-slate-800/50 border-none">
          <CardContent class="p-6">
            <div class="flex gap-2 items-center"> <Checkbox id="hero-active" v-model="currentLandingInfo.hero" />
              <div class="grid gap-1.5 leading-none">
                <Label for="hero-active"
                  class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-slate-200">
                  Activate Hero
                </Label>
                <p class="text-sm text-muted-foreground dark:text-slate-400">
                  This shows or hides the Hero on your landing page
                </p>
              </div>
            </div>
            <div v-if="currentLandingInfo.hero" class="pt-8 grid gap-4">
              <div>
                <Label for="hero_title" class="dark:text-slate-200">Title</Label>
                <Input type="text" id="hero_title" v-model="currentLandingInfo.hero_title" class="bg-white dark:bg-slate-800 dark:border-slate-600" />
              </div>
              <div>
                <Label for="hero_desc" class="dark:text-slate-200">Description</Label>
                <Input type="text" id="hero_desc" v-model="currentLandingInfo.hero_desc" class="bg-white dark:bg-slate-800 dark:border-slate-600" />
              </div>
              <div>
                <Label for="hero_text_color" class="dark:text-slate-200">Text Color</Label>
                <Input class="h-16 w-20 p-1 bg-white dark:bg-slate-800" type="color" id="hero_text_color"
                  v-model="currentLandingInfo.hero_bg[0].bg_text_color" />
              </div>
              <Separator class="my-4" label="Button" />
              <div class="flex gap-2 items-center">
                <Checkbox id="hero-button-active" v-model="currentLandingInfo.hero_button[0].active" />
                <div class="grid gap-1.5 leading-none">
                  <Label for="hero-button-active"
                    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-slate-200">
                    Button
                  </Label>
                  <p class="text-sm text-muted-foreground dark:text-slate-400">
                    This shows or hides a button in your Hero Section
                  </p>
                </div>
              </div>
              <div v-if="currentLandingInfo.hero_button[0].active" class="pt-4 grid gap-4">
                <div>
                  <Label for="hero_button_text" class="dark:text-slate-200">Button Text</Label>
                  <Input type="text" id="hero_button_text" v-model="currentLandingInfo.hero_button[0].text" class="bg-white dark:bg-slate-800 dark:border-slate-600"/>
                </div>
                <div>
                  <Label for="hero_button_link" class="dark:text-slate-200">Destination Link</Label>
                  <Input type="text" id="hero_button_link" v-model="currentLandingInfo.hero_button[0].link" class="bg-white dark:bg-slate-800 dark:border-slate-600"/>
                </div>
              </div>

              <Separator class="my-4" label="Background" />
              
              <div class="flex flex-col gap-2">
                <Label class="dark:text-slate-200">Background type</Label>
                <Select v-model="currentLandingInfo.hero_bg[0].bg_type">
                  <SelectTrigger class="dark:bg-slate-800 dark:border-slate-600">
                    <SelectValue placeholder="Background type" />
                  </SelectTrigger>
                  <SelectContent class="dark:bg-slate-900 dark:border-slate-700">
                    <SelectGroup>
                      <SelectItem value="solid">Solid</SelectItem>
                      <SelectItem value="linear">Linear</SelectItem>
                      <SelectItem value="radial">Radial</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div class="flex flex-col gap-4">
                <div class="flex gap-2 justify-between items-center"> <div>
                    <Label for="hero_bg_1" class="dark:text-slate-200">
                      {{ currentLandingInfo.hero_bg[0].bg_type === "solid" ? 'Background Color' : 'Color 1' }}
                    </Label>
                    <Input class="h-16 w-20 p-1 bg-white dark:bg-slate-800" type="color" id="hero_bg_1"
                      v-model="currentLandingInfo.hero_bg[0].bg_color_1" />
                  </div>

                  <div v-if="currentLandingInfo.hero_bg[0].bg_type !== 'solid'" class="content-center">
                    <Button size="icon" @click="invertColors">
                      <Icon name="uil:sync" class="text-xl" />
                    </Button>
                  </div>
                  <div v-if="currentLandingInfo.hero_bg[0].bg_type !== 'solid'">
                    <div>
                      <Label for="hero_bg_2" class="dark:text-slate-200">Color 2</Label>
                      <Input class="h-16 w-20 p-1 bg-white dark:bg-slate-800" type="color" id="hero_bg_2"
                        v-model="currentLandingInfo.hero_bg[0].bg_color_2" />
                    </div>
                  </div>
                </div>

                <Separator class="my-4" label="Background Image" />

                <div>
                  <Label for="hero_image_url" class="dark:text-slate-200">Image Url</Label>
                  <Input type="text" id="hero_image_url" v-model="currentLandingInfo.hero_bg[0].bg_image" class="bg-white dark:bg-slate-800 dark:border-slate-600"/>
                  <img v-if="currentLandingInfo.hero_bg[0].bg_image" :src="currentLandingInfo.hero_bg[0].bg_image"
                    class="mt-2 rounded-md border dark:border-slate-700 max-h-40 w-auto" />
                </div>

                <Separator class="my-4" label="Preview" />
                <div class="col-span-3">
                  <div class="h-100 flex justify-center rounded-lg" :style="stylePreview"> 
                    <div class="content-center text-center h-full">
                      
                    <Icon name="uil:user" class="text-5xl" />
                      <div class="text-4xl font-bold">{{ currentLandingInfo.hero_title }}</div>
                      <div class="pb-6 opacity-80">{{ currentLandingInfo.hero_desc }}</div>
                      <div v-if="currentLandingInfo.hero_button[0].active">
                        <Button
                          class="text-lg p-6 rounded-full bg-white/50 text-black/80 hover:bg-white cursor-pointer shadow-md">{{
                            currentLandingInfo.hero_button[0].text }}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Button class="my-6 w-full" :disabled="!checkHeroChanges" @click="updateHeroSettings">Save Hero Settings</Button>
          </CardContent>
        </Card>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</template>