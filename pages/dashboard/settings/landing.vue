<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth-dashboard'
})


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
        <DashboardLandingHeroSettings />
        <DashboardLandingStorySettings/>
      </CardContent>
    </Card>
  </div>
</template>
