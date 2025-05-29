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

</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="content-middle flex">
        <Icon name="uil:home-alt" class="text-lg mr-2" />
        Dashboard
      </CardTitle>
      <CardDescription>This is your dashboard</CardDescription>

    </CardHeader>
    <CardContent class="grid sm:grid-cols-1 lg:grid-cols-2 gap-4">
      <Card class="bg-gray-100">
        <CardContent class="p-8">
          cacca
        </CardContent>
      </Card>
    </CardContent>
  </Card>
</template>
