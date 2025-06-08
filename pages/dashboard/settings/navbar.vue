<script setup lang="ts">
// Aggiungo lang="ts"
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth-dashboard'
})

// Aggiungo tutti gli import necessari per i componenti usati nel template
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

import { ref, watch, computed } from 'vue'
import type { TSocialSettings } from '~/server/schema/SocialLinksSettingsSchema'

// Il tuo composable per le icone, corretto
const { icons } = useSocialIcons();

// 1. MODIFICA CHIAVE: Aggiungo `key` e `default` a useFetch per renderlo robusto.
const { data: socialLinks, refresh } = useFetch('/api/social-links-settings', {
  key: 'social-links-settings',
  default: () => [] as TSocialSettings[] // Definiamo il default come un array vuoto del tipo corretto
});

// Il tuo stato locale è corretto
const currentSocialsLinks = ref<TSocialSettings[]>([]);

// 2. MODIFICA CHIAVE: Aggiungo `{ immediate: true }` al watch.
watch(socialLinks, (newVal) => {
  if (newVal) {
    // La tua copia profonda è già perfetta.
    currentSocialsLinks.value = JSON.parse(JSON.stringify(newVal));
  }
}, {
  immediate: true // FONDAMENTALE: popola il form al primo caricamento.
});

// La computed per verificare i cambiamenti è corretta
const checkSocialChanges = computed(() => {
  if (!socialLinks.value) return false;
  return JSON.stringify(currentSocialsLinks.value) !== JSON.stringify(socialLinks.value);
});

// La computed per il bottone di aggiunta è corretta
const addLinkButton = computed(() => (currentSocialsLinks.value?.length ?? 0) < 5); // Ho messo 5 come limite, puoi cambiarlo

// Funzione per aggiungere un nuovo link, con ID temporaneo
function pushLinks() {
  // Uso un timestamp per un ID temporaneo univoco lato client
  const tempId = `new-${Date.now()}`;
  currentSocialsLinks.value.push({ id: tempId, link: '', icon: 3, active: true });
}

// Funzione per rimuovere, corretta
function removeLink(id: string) {
  currentSocialsLinks.value = currentSocialsLinks.value.filter(link => link.id !== id);
}

// Funzione per il toggle, corretta
function toggleActive(id: string) {
  const link = currentSocialsLinks.value.find(link => link.id === id);
  if (link) link.active = !link.active;
}

// 3. MODIFICA CHIAVE: Funzione di salvataggio migliorata con `$fetch` e `await refresh()`
async function updateSocialSettings() {
  try {
    await $fetch('/api/websettings/update-social-links-settings/', { // URL di esempio, adattalo al tuo
      method: 'POST',
      body: currentSocialsLinks.value,
    });

    showToast("Links salvati con successo!", "success")

    // Attendi il refresh dei dati prima di considerare l'operazione conclusa
    await refresh();

  } catch (error) {
    console.error('Errore durante il salvataggio dei link social:', error);
    showToast("Errore durante il salvataggio" + (error as Error).message, "error")

  }
}
</script>
<template>
  <div>
    <Card>
      <CardHeader>
        <CardTitle class="content-middle flex">
          <Icon name="uil:share-alt" class="text-lg mr-2" />
          Social Links Settings
        </CardTitle>
        <CardDescription>Here you can edit your social links</CardDescription>
      </CardHeader>

      <CardContent class="grid gap-4">
        <Accordion type="single" collapsible
          class="bg-gray-100 dark:bg-slate-800/50 border-2 border-gray-200 dark:border-slate-700 rounded-lg px-4">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <span>Social Links</span>
            </AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent class="p-6">
                  <div class="flex flex-col gap-4">
                    <p v-if="currentSocialsLinks.length === 0">No social links, add your first.</p>

                    <div v-for="(link, index) in currentSocialsLinks" :key="link.id">
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
                                <div class="flex content-center gap-2 p-2">
                                  <Icon :name="icon.icon" class="text-xl" />{{ icon.icon }}
                                </div>
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

                    <Button :disabled="!addLinkButton" variant="outline" @click="pushLinks">
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