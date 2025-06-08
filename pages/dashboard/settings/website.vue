<script lang="ts" setup>
// Aggiunto lang="ts" per coerenza con il codice TypeScript

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth-dashboard'
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
import { Checkbox } from '@/components/ui/checkbox'
// Importo gli altri componenti che usi nel template
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

import { ref, watch, computed } from 'vue'

// 1. MODIFICA CHIAVE: Aggiunta la `key` e un `default` robusto a useFetch
const { data: websiteInfo, refresh } = useFetch('/api/web-settings', {
  key: 'web-settings', // Chiave unica per questa chiamata
  default: () => ({
    name: '',
    desc: '',
    mail: '',
    analytics: '',
    maintenance: false,
    maintenance_desc: '',
  })
});

// Questo stato locale è corretto
const currentWebsiteInfo = ref({
  name: '',
  desc: '',
  mail: '',
  analytics: '',
  maintenance: false,
  maintenance_desc: '',
})

// Questa computed per controllare i cambiamenti è corretta
const checkChanges = computed(() => {
  if (!websiteInfo.value) return false;
  // Confronto i valori in modo sicuro
  return currentWebsiteInfo.value.name !== websiteInfo.value.name ||
         currentWebsiteInfo.value.desc !== websiteInfo.value.desc ||
         currentWebsiteInfo.value.mail !== websiteInfo.value.mail ||
         currentWebsiteInfo.value.analytics !== websiteInfo.value.analytics ||
         currentWebsiteInfo.value.maintenance !== websiteInfo.value.maintenance ||
         currentWebsiteInfo.value.maintenance_desc !== websiteInfo.value.maintenance_desc;
});

// 2. MODIFICA CHIAVE: Aggiunta di `{ immediate: true }` e di una copia profonda.
watch(websiteInfo, (newVal) => {
  if (newVal) {
    // Usiamo JSON.parse/stringify per fare una "copia profonda" sicura dei dati.
    // Questo evita problemi di mutazione diretta dell'oggetto originale.
    currentWebsiteInfo.value = JSON.parse(JSON.stringify(newVal));
  }
}, {
  immediate: true // Questa opzione è FONDAMENTALE. Esegue il watch subito al primo caricamento.
});

// 3. MODIFICA CHIAVE: Uso di `$fetch` di Nuxt per coerenza e semplicità.
async function updateWebSettings() {
  try {
    // Uso $fetch invece di fetch. È più semplice e gestisce meglio gli errori.
    await $fetch('/api/websettings/update-web-settings/', { // Ho corretto l'URL che avevi nell'esempio
      method: 'POST',
      body: currentWebsiteInfo.value,
    })

    // Sostituisco showToast con alert, dato che non è definito qui.
    // Se hai un tuo composable per i toast, importalo e usalo.
    showToast("Impostazioni aggiornate con successo!", "success")

    // Il refresh per aggiornare i dati originali è corretto.
    await refresh();

  } catch (error) {
    console.error('Failed to update settings:', error);
    showToast("Errore durante il salvataggio" + (error as Error).message, "error")
  }
}
</script>

<template>
  <div>
    <Card>
      <CardHeader>
        <CardTitle class="content-middle flex">
          <Icon name="uil:setting" class="text-lg mr-2" />
          Website Settings
        </CardTitle>
        <CardDescription>Here you can edit your navbar</CardDescription>
      </CardHeader>

      <CardContent class="grid gap-4">
        <div>
          <Label for="website_name">Website Name</Label>
          <Input id="website_name" v-model="currentWebsiteInfo.name" />
        </div>
        <div>
          <Label for="website_desc">Website Description</Label>
          <Input id="website_desc" v-model="currentWebsiteInfo.desc" />
        </div>
        <div>
          <Label for="contact_mail">Contact Mail</Label>
          <Input id="contact_mail" v-model="currentWebsiteInfo.mail" type="email" />
        </div>
        <Separator label="Maintenance Mode" class="my-4" />
        <div class="flex flex-col gap-4">
          <div class="flex flex-row gap-2 content-center">
            <Checkbox id="terms" v-model="currentWebsiteInfo.maintenance" />
            <div class="grid gap-1.5 leading-none">
              <Label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {{ currentWebsiteInfo.maintenance ? 'Activated' : 'Disabled' }}
              </Label>
              <p class="text-sm text-muted-foreground">
                This {{ currentWebsiteInfo.maintenance ? 'activate' : 'disable' }} the maintenance mode
              </p>
            </div>
          </div>
          <div v-if="currentWebsiteInfo.maintenance">
            <Label>Description</Label>
            <Textarea v-model="currentWebsiteInfo.maintenance_desc"></Textarea>
          </div>
        </div>
        <Separator label="Analytics" class="my-4" />
        <div>
          <Label for="litlyx">Litlyx project id</Label>
          <Input id="litlyx" v-model="currentWebsiteInfo.analytics" />
        </div>
      </CardContent>
      <CardFooter>
        <Button :disabled="!checkChanges" class="w-full" @click="updateWebSettings">Save Settings</Button>
      </CardFooter>
    </Card>
  </div>
</template>
