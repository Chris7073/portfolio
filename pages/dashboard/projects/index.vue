<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth-dashboard'
})

import { DialogsCreateProjectDialog } from '#components';
import { Badge } from '@/components/ui/badge'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
const { data: portfolioProjects, refresh } = useFetch('/api/portfolio-posts');
import type { TPortfolioPosts } from '~/server/schema/PortfolioPostsSchema';

const { data: portfolioCatsInfo } = useFetch('/api/portfolio-categories');

function getCategoryName(catId: string) {
  const cat = portfolioCatsInfo.value?.find(c => c.cat_id === catId);
  return cat ? cat.cat_name : 'No category'
}


const dialog = useDialog()
const route = useRoute()
function addProjectDialog() {
  dialog.open({
    body: DialogsCreateProjectDialog,
    title: 'Add new project',
    onSuccess(data, close) {
      addProject(data, close)
    },
  })
}

function copyUrl(pId: number) {
  navigator.clipboard.writeText(`${window.location.origin}/projects/${pId}`)
  showToast("Url Copied to clipboard!", "success")
}
const requestURL = useRequestURL(); // Inizializza il composable una volta

async function shareProject(pId: number, projectTitle?: string) {
  if (navigator.share) {
    // SOSTITUZIONE: usiamo requestURL.origin invece di window.location.origin
    const projectUrl = `${requestURL.origin}/projects/${pId}`;

    const shareData = {
      title: projectTitle || 'Check out this project',
      text: `Check my project ${projectTitle || ''}!`,
      url: projectUrl,
    };

    try {
      await navigator.share(shareData);
      // Feedback opzionale per l'utente, anche se la condivisione nativa è già chiara
      showToast("Sharing dialog opened!", "success");
    } catch (err) {
      // Gestisce il caso in cui l'utente annulla la condivisione
      if (err instanceof Error && err.name !== 'AbortError') {
        showToast(`Error: ${err.message}`, "error");
      }
    }
  } else {
    // Fallback: se navigator.share non è disponibile, esegui la copia del link
    copyUrl(pId);
  }
}

async function addProject(data: Pick<TPortfolioPosts, "post_name" | "post_desc">, close: () => any) {
  try {
    await $fetch(`/api/projects/create/`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: data
    })
    showToast('Project created succesfully!', 'success')
    close()
    refresh()
  } catch (e) {
    showToast('Error:' + e, 'error')
  }
}
</script>
<template>
  <Card>
    <CardHeader class="flex flex-row justify-between items-start">
      <div>
        <CardTitle class="content-middle flex dark:text-slate-100">
          <Icon name="uil:archive" class="text-lg mr-2" />
          Projects
        </CardTitle>
        <CardDescription class="dark:text-slate-400">Here you can see all your projects</CardDescription>
      </div>
      <Button class="bg-blue-500 hover:bg-blue-500/90 dark:bg-sky-600 dark:hover:bg-sky-500"
        @click="addProjectDialog">Add Project</Button>
    </CardHeader>
    <CardContent class="flex flex-col gap-4">
      <Table>
        <TableHeader>
          <TableRow class="dark:border-b-slate-800">
            <TableHead class="dark:text-slate-300">Project Name</TableHead>
            <TableHead class="dark:text-slate-300">Category</TableHead>
            <TableHead class="dark:text-slate-300">Shareable Url</TableHead>
            <TableHead class="dark:text-slate-300">State</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="project in portfolioProjects" :key="project.post_id" :class="!project.post_active
            ? 'bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:text-slate-300  dark:hover:bg-red-950'
            : 'hover:bg-gray-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'">
            <TableCell class="overflow-hidden max-w-[10rem]"> <Button variant="link"
                @click="navigateTo(`/dashboard/projects/edit/${project.post_id}`)"
                class="cursor-pointer truncate text-slate-700 dark:text-slate-300 p-0">
                <Icon name="uil:edit" />
                {{ project.post_name }}
              </Button>
            </TableCell>
            <TableCell>
              {{ getCategoryName(project.post_cat) }}
            </TableCell>
            <TableCell class="overflow-hidden max-w-xs"> <Button variant="link"
                @click="shareProject(project.post_id, project.post_name)"
                class="cursor-pointer text-slate-700 dark:text-slate-300 p-0 truncate">
                <Icon name="uil:link" />
                /projects/{{ project.post_id }}
              </Button>
            </TableCell>
            <TableCell class="w-24 text-center">
              <Badge :class="project.post_active
                ? 'bg-green-200 text-green-800 dark:bg-green-900/70 dark:text-green-200'
                : 'bg-red-200 text-red-800 dark:bg-red-900/80 dark:text-red-200'"
                class="py-1 w-full flex justify-center" variant="outline">
                {{ project.post_active ? 'Active' : 'Hidden' }}
              </Badge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</template>