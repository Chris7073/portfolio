<script lang="ts" setup>
// Imports (sono corretti, li ometto per brevità)
import { ref, watch, computed } from 'vue'
import type { TLandingSettings } from '~/server/schema/LandingSettingsSchema' // Assumiamo che questo tipo contenga TUTTO

// --- SOLUZIONE ERRORE 1: `default` e stato locale completi ---
// Forniamo una struttura completa che corrisponde al tipo TLandingSettings
// includendo anche i campi 'hero' che non modifichiamo qui.
const defaultLandingSettings: () => TLandingSettings = () => ({
  hero: false,
  hero_title: '',
  hero_desc: '',
  hero_button: [{ active: false, text: '', link: '' }],
  hero_bg: [{ bg_type: 'solid', bg_text_color: '', bg_color_1: '', bg_color_2: '', bg_image: '' }],
  story: false,
  story_title: '',
  story_desc: '',
  story_img: '',
  story_me: [] // Lasciamo un array vuoto, vedi nota sotto
});

const { data: landingInfo, refresh } = useFetch('/api/landing-settings', {
  key: 'landing-settings-story', // La chiave rimane importante
  default: defaultLandingSettings
});

// Anche lo stato locale ora ha la struttura completa
const currentLandingInfo = ref<TLandingSettings>(defaultLandingSettings());

// --- SOLUZIONE ERRORE 2 & 4: Gestione dell'array `story_me` ---
// Questa `watch` ora è sicura perché entrambi gli oggetti hanno la stessa "forma".
watch(landingInfo, (newVal) => {
  if (newVal) {
    currentLandingInfo.value = JSON.parse(JSON.stringify(newVal));
  }
}, {
  immediate: true
});

const checkStoryChanges = computed(() => {
  if (!landingInfo.value) return false;
  return JSON.stringify(currentLandingInfo.value) !== JSON.stringify(landingInfo.value);
});


// --- SOLUZIONE ERRORE 3: ID temporanei di tipo `number` ---
let tempIdCounter = -1; // Usiamo un contatore per i numeri negativi

const addSkill = () => {
  // Se la tua API non gestisce gli array vuoti, aggiungi un controllo qui
  if (!currentLandingInfo.value.story_me) {
      currentLandingInfo.value.story_me = [];
  }
  
  currentLandingInfo.value.story_me.push({
    me_id: tempIdCounter--, // Assegna un numero negativo e poi lo decrementa
    me_title: 'Nuova Skill',
    me_desc: 'Nuova Descrizione',
    me_icon: 'plus'
  });
};

const removeSkill = (idToRemove: string | number) => {
  currentLandingInfo.value.story_me = currentLandingInfo.value.story_me.filter(
    skill => skill.me_id !== idToRemove
  );
};

async function updateStorySettings() {
  // Nel body inviamo solo le parti relative a 'story', per non sovrascrivere 'hero'
  const storyData = {
    story: currentLandingInfo.value.story,
    story_title: currentLandingInfo.value.story_title,
    story_desc: currentLandingInfo.value.story_desc,
    story_img: currentLandingInfo.value.story_img,
    story_me: currentLandingInfo.value.story_me,
  }

  try {
    await $fetch('/api/websettings/update-landing-settings/', {
      method: 'POST',
      body: storyData
    });
    showToast('Story updated successfully', 'success');
    await refresh();
  } catch (error) {
    console.error('Failed to update Story:', error);
    showToast('Failed to update Story: ' + (error as Error).message, 'error');
  }
}
</script>
<template>
    <Accordion type="single" collapsible class="bg-gray-100 dark:bg-slate-800/50 border-2 border-gray-200 dark:border-slate-700 rounded-lg px-4">
    <AccordionItem value="item-1">
      <AccordionTrigger>
        <span class="dark:text-slate-100"> STORY
          <Badge class="ml-4" variant="outline"
            :class="landingInfo?.story ? 'bg-green-500/80 text-white' : 'bg-gray-300 dark:bg-slate-600 dark:text-slate-200'">{{ landingInfo?.story ?
              'Enabled' : 'Disabled' }}</Badge>
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <Card class="bg-white dark:bg-slate-800/50 border-none">
          <CardContent class="p-6">
            <div class="flex gap-2 items-center">
              <Checkbox id="story-active" v-model="currentLandingInfo.story" />
              <div class="grid gap-1.5 leading-none">
                <Label for="story-active"
                  class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-slate-200">
                  Activate Story
                </Label>
                <p class="text-sm text-muted-foreground dark:text-slate-400">
                  This shows or hides your story on your landing page
                </p>
              </div>
            </div>
            <div v-if="currentLandingInfo.story" class="pt-8 grid gap-4">
              <div>
                <Label for="story_title" class="dark:text-slate-200">Title</Label>
                <Input type="text" id="story_title" v-model="currentLandingInfo.story_title" class="bg-white dark:bg-slate-800 dark:border-slate-600"/>
              </div>
              <div>
                <Label for="story_desc" class="dark:text-slate-200">Description</Label>
                <Textarea id="story_desc" v-model="currentLandingInfo.story_desc" class="bg-white dark:bg-slate-800 dark:border-slate-600"/>
              </div>
            </div>
            <div v-if="currentLandingInfo.story">
              <Separator class="my-4" label="Skills" />
              <div class="flex justify-between items-center"> <p class="dark:text-slate-300">{{ currentLandingInfo.story_me.length }} Skills</p>
                <div class="flex gap-2">
                  <Button @click="addSkill">
                    Add Skill
                  </Button>
                  <NuxtLink to="https://icones.js.org/collection/uil" target="_blank">
                    <Button variant="outline" size="icon">
                      <Icon name="uil:icons" />
                    </Button>
                  </NuxtLink>
                </div>
              </div>

              <Accordion class="bg-gray-100 dark:bg-slate-900/80 rounded-md my-2 px-4" v-for="(skill, index) in currentLandingInfo.story_me"
                :key="skill.me_id" type="single" collapsible>
                <AccordionItem :value="`skill-${skill.me_id}`">
                  <AccordionTrigger class="dark:text-slate-200">skill {{ index + 1 }}</AccordionTrigger>
                  <AccordionContent class="flex gap-2 flex-col">
                    <div>
                      <Label class="dark:text-slate-200">Icon</Label>
                      <div class="flex flex-row items-center gap-2">
                        <Icon class="text-4xl text-slate-700 dark:text-slate-200" :name="`uil:${skill.me_icon || 'question-circle'}`" />
                        <Input class="bg-white dark:bg-slate-800 dark:border-slate-600" v-model="skill.me_icon" />
                      </div>
                    </div>
                    <div>
                      <Label class="dark:text-slate-200">Title</Label>
                      <Input class="bg-white dark:bg-slate-800 dark:border-slate-600" v-model="skill.me_title" />
                    </div>
                    <div>
                      <Label class="dark:text-slate-200">Description</Label>
                      <Input class="bg-white dark:bg-slate-800 dark:border-slate-600" v-model="skill.me_desc" />
                    </div>
                    <Popover>
                      <PopoverTrigger as-child>
                        <Button class="w-full" variant="destructive">Remove Skill</Button>
                      </PopoverTrigger>
                      <PopoverContent class="flex flex-col gap-2 bg-white dark:bg-slate-900 dark:border-slate-700">
                        <Label class="dark:text-slate-200">Are you sure?</Label>
                        <Button @click="removeSkill(skill.me_id)">Confirm</Button>
                      </PopoverContent>
                    </Popover>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <Button class="my-6 w-full" :disabled="!checkStoryChanges" @click="updateStorySettings">Save Story Settings</Button>
          </CardContent>
        </Card>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</template>