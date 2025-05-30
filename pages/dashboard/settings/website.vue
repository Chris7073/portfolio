<script setup>
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

const { data: websiteInfo, refresh } = useFetch('/api/web-settings');
const currentWebsiteInfo = ref({
  name: '',
  desc: '',
  mail: '',
})

const checkChanges = computed(() => {
  if (!websiteInfo.value) return;
  if (currentWebsiteInfo.value.name !== websiteInfo.value.name) return true;
  if (currentWebsiteInfo.value.desc !== websiteInfo.value.desc) return true;
  if (currentWebsiteInfo.value.mail !== websiteInfo.value.mail) return true;
  return false;
});

watch(websiteInfo, (newVal) => {
  if (!newVal) return;
  currentWebsiteInfo.value.name = newVal.name;
  currentWebsiteInfo.value.desc = newVal.desc;
  currentWebsiteInfo.value.mail = newVal.mail;
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
      </CardContent>
      <CardFooter class="flex justify-between">
        <Button :disabled="!checkChanges" @click="updateWebSettings">Save Settings</Button>
      </CardFooter>
    </Card>
  </div>
</template>
