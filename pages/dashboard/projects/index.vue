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
async function shareProject(pId: number, projectTitle?: string) {
  if (navigator.share) {
    const projectUrl = `${window.location.origin}/projects/${pId}`;

    const shareData = {
      title: projectTitle || 'Check out this project', // Usa il titolo se fornito
      text: `Check my project ${projectTitle || ''}!`,
      url: projectUrl,
    };
    try {
      await navigator.share({title:projectTitle,text:`Check my project ${projectTitle || ''}!`,url:projectUrl});
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
    showToast('Error:'+e, 'error')
  }
}
</script>
<template>
  <Card>
    <CardHeader class="flex flex-row justify-between">
      <div>
        <CardTitle class="content-middle flex">
          <Icon name="uil:archive" class="text-lg mr-2" />
          Projects
        </CardTitle>
        <CardDescription>Here you can see all your projects</CardDescription>
      </div>
      <Button class="bg-blue-500 hover:bg-blue-500/90" @click="addProjectDialog">Add Project</Button>
    </CardHeader>
    <CardContent class="flex flex-col gap-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Shareable Url</TableHead>
            <TableHead>State</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="project in portfolioProjects"
            :class="!project.post_active ? 'bg-red-100 hover:bg-red-200/80' : 'bg-white'">
            <TableCell class="overflow-clip max-w-[10rem]">
              <Button variant="link" @click="navigateTo(`/dashboard/projects/edit/${project.post_id}`)"
                class="cursor-pointer">
                <Icon name="uil:edit" />
                {{ project.post_name }}
              </Button>
            </TableCell>
            <TableCell>
              {{getCategoryName(project.post_cat)}}
            </TableCell>
            <TableCell>
              <Button variant="link" @click="shareProject(project.post_id,project.post_name)" class="cursor-pointer">
                <Icon name="uil:link" />
                {{ `${useRequestURL().host}/projects/${project.post_id}` }}
              </Button>
            </TableCell>
            <TableCell class="w-[1rem]">
              <Badge variant="outline" class="w-full flex justify-center text-white py-2"
                :class="project.post_active ? 'bg-green-400' : 'bg-red-400'">
              </Badge>
            </TableCell>

          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</template>