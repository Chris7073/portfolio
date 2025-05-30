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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ref, watch } from 'vue'
import type { TSocialSettings } from '~/server/schema/SocialLinksSettingsSchema'
const { icons } = useSocialIcons();
const { data: socialLinks, refresh } = useFetch('/api/social-links-settings');
const currentSocialsLinks = ref<TSocialSettings[]>([]);

watch(socialLinks, () => {
  currentSocialsLinks.value = socialLinks.value ?? [];
});
console.log(currentSocialsLinks.value)
const addLinkButton = computed(() => (currentSocialsLinks.value?.length ?? 0) <= 2);

const nextId = computed(()=>{
const lastItem = currentSocialsLinks.value.at(-1);
if(!lastItem) return 0;
return parseInt(lastItem.id)+1
})

function pushLinks() {
  currentSocialsLinks.value.push({ id: (nextId.value).toString(), link: 'test',icon:3, active: true });
}

function removeLink(id: string) {
  currentSocialsLinks.value = currentSocialsLinks.value.filter(link => link.id !== id);
}


function toggleActive(id: string) {
  const link = currentSocialsLinks.value.find(link => link.id === id);
  if (link) link.active = !link.active;
}

async function updateSocialSettings() {
  try {
    await fetch('/api/websettings/update-social-links-settings/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentSocialsLinks.value),
    });
    showToast('Aggiornato con successo', 'success');
    refresh();
  } catch {
    showToast('Errore durante il salvataggio', 'error');
  }
}



const checkSocialChanges = computed(() => {
  return true;
});

</script>

<template>
  <div>
    <Card>
      <CardHeader>
        <CardTitle class="content-middle flex">
          <Icon name="uil:setting" class="text-lg mr-2" />
          Navbar Settings
        </CardTitle>
        <CardDescription>Here you can edit your navbar</CardDescription>

      </CardHeader>
      <CardContent class="grid gap-4">
        <Accordion type="single" collapsible class="bg-gray-100 border-2 border-gray-200 rounded-lg px-4">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <span>
                Social Links
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent class="p-6" v-if="currentSocialsLinks">
                  <div class="flex flex-col gap-4">
                    <p v-if="currentSocialsLinks.length === 0">No navbar links, add your first</p>
                    <div v-for="(link, index) in currentSocialsLinks" :key="index">
                      <Label>Link {{ index + 1 }}</Label>
                      <div class="flex justify-between gap-2">
                        <Input :disabled="!link.active" placeholder="Your link" v-model="link.link" />
                        
                        <Select v-model="link.icon" :disabled="!link.active">
                          <SelectTrigger>
                            <SelectValue placeholder="icon" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Social icons</SelectLabel>
                              <SelectItem v-for="icon in icons" :key="icon.id" :value="icon.id">
                                <div class="flex content-center gap-2 p-2"><Icon :name="icon.icon" class="text-xl" />{{ icon.icon }}</div>
                                
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Button :variant="link.active ? 'outline' : 'default'" size="icon"
                                @click="toggleActive(link.id)">
                                <Icon :name="link.active ? 'uil:eye' : 'uil:eye-slash'" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{{ link.active ? 'Hide from website' : 'Show in website' }}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Button class="bg-red-500/90 hover:bg-red-500 text-white hover:text-white"
                                variant="outline" size="icon" @click="removeLink(link.id)">
                                <Icon name='uil:trash' />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Remove link from website</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                      </div>
                    </div>
                    <Button :disabled="!addLinkButton" @click="pushLinks">
                      <Icon name="uil:plus" /> Add Link
                    </Button>
                  </div>

                </CardContent>
                <CardFooter>
                  <Button class="w-full" :disabled="!checkSocialChanges" @click="updateSocialSettings">Save Social
                    Links</Button>
                </CardFooter>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

      </CardContent>

    </Card>
  </div>
</template>
