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

// Non è necessario importare Icon qui se è registrato globalmente
// altrimenti: import Icon from 'some-icon-library' // o come lo gestisci
</script>

<template>
  <Card class="w-full">
    <CardHeader class="pb-4">
      <CardTitle >
        <Icon name="uil:apps" /> Dashboard Riepilogativa
      </CardTitle>
      <CardDescription>Panoramica delle tue attività recenti e statistiche chiave.</CardDescription>
    </CardHeader>
    <CardContent class="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">
            Post Attivi
          </CardTitle>
          <Icon name="uil:file-check-alt" class="h-5 w-5 text-green-500" />
        </CardHeader>
        <CardContent>
          <div class="text-4xl font-bold">125</div>
          <p class="text-xs text-muted-foreground">
            +10 dall'ultima settimana
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">
            Post Disattivati
          </CardTitle>
          <Icon name="uil:file-times-alt" class="h-5 w-5 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div class="text-4xl font-bold">12</div>
          <p class="text-xs text-muted-foreground">
            In attesa di revisione o archiviati
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">
            Visualizzazioni Totali
          </CardTitle>
          <Icon name="uil:eye" class="h-5 w-5 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div class="text-4xl font-bold">78.4K</div>
          <p class="text-xs text-muted-foreground">
            +20.1% rispetto al mese scorso
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">
            Nuovi Commenti
          </CardTitle>
          <Icon name="uil:comment-dots" class="h-5 w-5 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div class="text-4xl font-bold">+23</div>
          <p class="text-xs text-muted-foreground">
            Nelle ultime 24 ore
          </p>
        </CardContent>
        <CardFooter v-if="false"> <p class="text-xs text-muted-foreground">Dettagli</p>
        </CardFooter>
      </Card>

    </CardContent>
    </Card>
</template>