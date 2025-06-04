<script setup>
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

import { ref, watch } from 'vue'

const { data: websiteInfo, refresh } = useFetch('/api/web-settings');
const currentWebsiteInfo = ref({
  name: '',
  desc: '',
  mail: '',
  maintenance: false,
  maintenance_desc: '',
})

const checkChanges = computed(() => {
  if (!websiteInfo.value) return;
  if (currentWebsiteInfo.value.name !== websiteInfo.value.name) return true;
  if (currentWebsiteInfo.value.desc !== websiteInfo.value.desc) return true;
  if (currentWebsiteInfo.value.mail !== websiteInfo.value.mail) return true;

  if (currentWebsiteInfo.value.maintenance !== websiteInfo.value.maintenance) return true;
  if (currentWebsiteInfo.value.maintenance_desc !== websiteInfo.value.maintenance_desc) return true;
  return false;
});

watch(websiteInfo, (newVal) => {
  if (!newVal) return;
  currentWebsiteInfo.value.name = newVal.name;
  currentWebsiteInfo.value.desc = newVal.desc;
  currentWebsiteInfo.value.mail = newVal.mail;

  currentWebsiteInfo.value.maintenance = newVal.maintenance;
  currentWebsiteInfo.value.maintenance_desc = newVal.maintenance_desc;
});

async function updateWebSettings() {
  try {
    await fetch('/api/websettings/update-web-settings/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentWebsiteInfo.value),
    })
    showToast('Settings updated successfully', 'success')
    await refresh()
  } catch (error) {
    showToast('Failed to update settings:' + error, 'error')
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
                This {{ currentWebsiteInfo.maintenance?'activate':'disable' }} the maintenance mode
              </p>
            </div>
          </div>
          <div v-if="currentWebsiteInfo.maintenance">
            <Label>Description</Label>
            <Textarea v-model="currentWebsiteInfo.maintenance_desc"></Textarea>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button :disabled="!checkChanges" class="w-full" @click="updateWebSettings">Save Settings</Button>
      </CardFooter>
    </Card>
  </div>
</template>
