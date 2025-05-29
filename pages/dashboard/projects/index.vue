<script setup lang="ts">
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

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
const { data: portfolioProjects } = useFetch('/api/portfolio-posts');

const dialog = useDialog()
function addProjectDialog(){
dialog.open({
  body:Table,
  title:'Add new project'
})
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
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>
              id
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>State</TableHead>
            <TableHead class="text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="project in portfolioProjects"
            :class="!project.post_active ? 'bg-red-100 hover:bg-red-200/80' : 'bg-white'">
            <TableCell class="font-medium">
              {{ project.post_id }}
            </TableCell>
            <TableCell>{{ project.post_name }}</TableCell>
            <TableCell>{{ project.post_active ? 'Active' : 'Disabled' }}</TableCell>
            <TableCell class="text-right flex gap-2 justify-end">
              <NuxtLink :to="`projects/edit/${project.post_id}`">
                <Button size="icon" variant="outline">
                  <Icon name="uil:setting" />
                </Button>
              </NuxtLink>
              <Button size="icon" variant="destructive">
                <Icon name="uil:trash" />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</template>