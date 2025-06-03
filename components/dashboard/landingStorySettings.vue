<script lang="ts" setup>
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { Badge } from '@/components/ui/badge'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'


import { ref, watch } from 'vue'
const { data: landingInfo, refresh } = useFetch('/api/landing-settings')
const currentLandingInfo = ref({
  story: null,
  story_title: '',
  story_desc: '',
  story_img: '',
  story_me: [{
    me_id: 0,
    me_icon: '',
    me_title: '',
    me_desc: ''
  }]
})

//Story
function deepEqual<T>(a: T, b: T): boolean {
  if (a === b) return true; // Stesso riferimento o valori primitivi identici

  // Controlla se sono oggetti o null
  if (a == null || typeof a != "object" || b == null || typeof b != "object") return false;

  // Assicurati che siano entrambi array o entrambi oggetti (non uno array e l'altro oggetto)
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  let keysA = Object.keys(a), keysB = Object.keys(b);

  if (keysA.length != keysB.length) return false;

  for (let key of keysA) {
    if (!keysB.includes(key) || !deepEqual((a as any)[key], (b as any)[key])) return false;
  }

  return true;
}

const checkStoryChanges = computed(() => {
  if (!landingInfo.value) return false;

  if (currentLandingInfo.value.story !== landingInfo.value.story) return true;
  if (currentLandingInfo.value.story_title !== landingInfo.value.story_title) return true;
  if (currentLandingInfo.value.story_desc !== landingInfo.value.story_desc) return true;
  if (currentLandingInfo.value.story_img !== landingInfo.value.story_img) return true;

  if (currentLandingInfo.value.story_me.length !== landingInfo.value.story_me.length) return true;

  const sortedCurrent = [...currentLandingInfo.value.story_me].sort((a, b) => (a.me_id - b.me_id));
  const sortedOriginal = [...landingInfo.value.story_me].sort((a, b) => (a.me_id - b.me_id));

  for (let i = 0; i < sortedCurrent.length; i++) {
    if (!deepEqual(sortedCurrent[i], sortedOriginal[i])) {
      return true;
    }
  }

  return false;
});

watch(landingInfo, (newVal) => {
  if (!newVal) return;
  currentLandingInfo.value.story = newVal.story as any;
  currentLandingInfo.value.story_title = newVal.story_title;
  currentLandingInfo.value.story_desc = newVal.story_desc;

  currentLandingInfo.value.story_me = newVal.story_me
    ? JSON.parse(JSON.stringify(newVal.story_me))
    : [];
  console.log(currentLandingInfo.value)
});


const addSkill = () => {
  currentLandingInfo.value.story_me.push({
    me_id: currentLandingInfo.value.story_me.length + 1,
    me_title: 'Nuova Skill Senza Nome',
    me_desc: 'Descrizione della skill da modificare',
    me_icon: 'plus'
  });
  console.log('Skill aggiunta:', currentLandingInfo.value.story_me);
};

const removeSkill = (idToRemove: number) => {
  currentLandingInfo.value.story_me = currentLandingInfo.value.story_me.filter(
    skill => skill.me_id !== idToRemove
  );
  console.log(`Skill con ID ${idToRemove} rimossa.`, currentLandingInfo.value.story_me);
};

async function updateStorySettings() {
  try {
    await fetch('/api/websettings/update-landing-settings/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentLandingInfo.value),
    })
    showToast('Story updated successfully', 'success')
    await refresh()
  } catch (error) {
    showToast('Failed to update Story:' + error, 'error')
  }
}
</script>
<template>
  <Accordion type="single" collapsible class="bg-gray-100 border-2 border-gray-200 rounded-lg px-4">
    <AccordionItem value="item-1">
      <AccordionTrigger>
        <span>
          STORY
          <Badge class="ml-4" variant="outline"
            :class="landingInfo?.story ? 'bg-green-500/80 text-white' : 'bg-gray-200'">{{ landingInfo?.story ?
              'Enabled' : 'Disabled' }}</Badge>
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <Card>
          <CardContent class="p-6">
            <div class="flex gap-2">
              <Checkbox v-model="currentLandingInfo.story" />
              <div class="grid gap-1.5 leading-none">
                <Label for="terms1"
                  class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Activate Story
                </Label>
                <p class="text-sm text-muted-foreground">
                  This shows or hide your story on your landing page
                </p>
              </div>
            </div>
            <div v-if="currentLandingInfo.story" class="pt-8 grid gap-4">
              <div>
                <Label for="story_title">Title</Label>
                <Input type="text" id="story_title" v-model="currentLandingInfo.story_title" />
              </div>
              <div>
                <Label for="story_desc">Description</Label>
                <Textarea type="text" id="story_desc" v-model="currentLandingInfo.story_desc" />
              </div>
            </div>
            <div v-if="currentLandingInfo.story">
              
            
            <Separator class="my-4" label="Skills" />
            <div class="flex justify-between">
              <p>{{ currentLandingInfo.story_me.length }} Skills</p>
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
            <Accordion class="bg-gray-100 rounded-md my-2 px-4" v-for="(skill, index) in currentLandingInfo.story_me"
              :key="index" type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>skill {{ index + 1 }}</AccordionTrigger>
                <AccordionContent class="flex gap-2 flex-col">
                  <div>
                    <Label>Icon</Label>
                    <div class="flex flex-row">
                      <Icon class="text-4xl" :name="`uil:` + skill.me_icon" />
                      <Input class="bg-white" v-model="skill.me_icon" />
                    </div>

                  </div>
                  <div>
                    <Label>Title</Label>
                    <Input class="bg-white" v-model="skill.me_title" />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input class="bg-white" v-model="skill.me_desc" />
                  </div>
                  <Popover>
                    <PopoverTrigger>
                      <Button class="w-full" variant="destructive">Remove Skill</Button>
                    </PopoverTrigger>
                    <PopoverContent class="flex flex-col gap-2">
                      <Label>Are you sure?</Label>
                      <Button @click="removeSkill(skill.me_id)">Confirm</Button>
                    </PopoverContent>
                  </Popover>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            </div>
            <Button class="my-6 w-full" :disabled="!checkStoryChanges" @click="updateStorySettings">Save Story
              Settings</Button>

          </CardContent>
        </Card>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</template>