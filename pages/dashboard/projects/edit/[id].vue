<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import {
  PopoverClose
} from 'reka-ui';

definePageMeta({
  middleware: 'auth-dashboard'
});

// --- 1. GESTIONE CHIUSURA SCHEDA/BROWSER ---

/**
 * Questa funzione viene eseguita dal browser poco prima di chiudere la scheda.
 * @param {BeforeUnloadEvent} event
 */
const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  if (!checkChanges.value) {
    return;
  }
  event.preventDefault();
  event.returnValue = '';
};

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload);
});

onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
});


// --- 2. GESTIONE CAMBIO PAGINA INTERNO (NAVIGAZIONE SPA) ---

onBeforeRouteLeave((to, from) => {
  // Se non ci sono modifiche, permetti la navigazione senza chiedere nulla.
  if (!checkChanges.value) {
    return true;
  }

  // Se ci sono modifiche, mostra un pop-up di conferma standard del browser.
  const answer = window.confirm(
    'Hai delle modifiche non salvate. Sei sicuro di voler lasciare la pagina? I tuoi dati andranno persi.'
  );

  // Se l'utente clicca "Annulla" (answer è false), blocca la navigazione.
  // Se l'utente clicca "OK" (answer è true), la navigazione procede.
  if (!answer) {
    return false;
  }
});

const route = useRoute();
const { data: allProjects, pending, refresh } = useFetch('/api/portfolio-posts');

const postIdFromRoute = computed(() => Number(route.params.id));
const singleProject = computed(() => {
  return allProjects.value?.find(p => p.post_id === postIdFromRoute.value) || null;
});

// Stato per i dati correnti (modificabili nel form)
const currentProjectInfo = ref({
  post_id: 0,
  post_active: false,
  post_cat: '0',
  post_name: '',
  post_desc: '',
  post_image: '',
  blocks: [] as {
    block_id: number;
    block_name: string;
    block_title: string;
    block_content: string;
    block_position: number; // Assicuriamoci che sia un numero
    hover_effect: boolean;
    image_url: string;
    altText: string;
    didascalia: string;
  }[]
});

// Stato per conservare una copia dei dati originali
const originalProjectInfo = ref<typeof currentProjectInfo.value | null>(null);

watch(singleProject, (newProjectData) => {
  if (newProjectData) {
    const formattedData = {
      post_id: newProjectData.post_id,
      post_active: newProjectData.post_active,
      post_cat: newProjectData.post_cat,
      post_name: newProjectData.post_name,
      post_desc: newProjectData.post_desc,
      post_image: newProjectData.post_image ?? '',
      // NUOVA LOGICA: Assicuriamoci che ogni blocco abbia una posizione numerica
      blocks: (newProjectData.blocks ?? []).map((block, index) => ({
        block_id: block.block_id,
        block_name: block.block_name,
        block_title: block.block_title,
        block_content: block.block_content,
        // Se la posizione non esiste o non è valida, usa l'indice come fallback
        block_position: typeof block.block_position === 'number' ? block.block_position : index,
        hover_effect: block.hover_effect,
        image_url: block.image_url ?? '',
        altText: block.altText ?? '',
        didascalia: block.didascalia ?? '',
      }))
    };

    currentProjectInfo.value = JSON.parse(JSON.stringify(formattedData));
    originalProjectInfo.value = JSON.parse(JSON.stringify(formattedData));
  }
}, {
  immediate: true
});

/**
 * NUOVO: Computed property per visualizzare i blocchi sempre ordinati.
 * Usiamo questa nel template per il v-for.
 */
const sortedBlocks = computed(() => {
  // .slice() crea una copia per non mutare l'array originale con sort()
  return currentProjectInfo.value.blocks.slice().sort((a, b) => a.block_position - b.block_position);
});

/**
 * NUOVO: Funzione per spostare un blocco su o giù.
 * @param blockId L'ID del blocco da spostare.
 * @param direction La direzione dello spostamento (-1 per su, 1 per giù).
 */
function moveBlock(blockId: number, direction: -1 | 1) {
  const blocks = currentProjectInfo.value.blocks;
  const currentIndex = sortedBlocks.value.findIndex(b => b.block_id === blockId);

  // Controlla se il blocco esiste e se il movimento è possibile
  if (currentIndex === -1 || (currentIndex === 0 && direction === -1) || (currentIndex === sortedBlocks.value.length - 1 && direction === 1)) {
    return;
  }

  // Trova il blocco con cui scambiare la posizione
  const blockToSwapWith = sortedBlocks.value[currentIndex + direction];

  // Trova i blocchi originali nell'array non ordinato
  const currentBlockInOriginalArray = blocks.find(b => b.block_id === blockId);
  const blockToSwapInOriginalArray = blocks.find(b => b.block_id === blockToSwapWith.block_id);

  if (!currentBlockInOriginalArray || !blockToSwapInOriginalArray) return;

  // Scambia le loro proprietà 'block_position'
  const tempPosition = currentBlockInOriginalArray.block_position;
  currentBlockInOriginalArray.block_position = blockToSwapInOriginalArray.block_position;
  blockToSwapInOriginalArray.block_position = tempPosition;
}


const checkChanges = computed(() => {
  if (!originalProjectInfo.value) {
    return false;
  }
  const originalJson = JSON.stringify(originalProjectInfo.value);
  const currentJson = JSON.stringify(currentProjectInfo.value);
  return originalJson !== currentJson;
});


const selectBlockToAdd = ref('');
const postStatus = computed({
  get() {
    return String(currentProjectInfo.value.post_active);
  },

  set(newValue) {
    currentProjectInfo.value.post_active = (newValue === 'true');
  }
});


const checkBlockToAdd = computed(() => {
  return selectBlockToAdd.value !== '';
});

function addBlock() {
  if (!selectBlockToAdd.value) {
    alert("Per favore, seleziona un tipo di blocco prima di aggiungerlo.");
    return;
  }

  const newBlockId = Date.now();

  const newBlock = {
    block_id: newBlockId,
    block_name: selectBlockToAdd.value,
    block_title: `Nuovo Blocco - ${selectBlockToAdd.value}`,
    block_content: '',
    // MODIFICATO: Assegna la posizione successiva disponibile
    block_position: currentProjectInfo.value.blocks.length,
    hover_effect: false,
    image_url: '',
    altText: '',
    didascalia: ''
  };

  currentProjectInfo.value.blocks.push(newBlock);
  selectBlockToAdd.value = '';
}

function removeBlock(id: number) {
  currentProjectInfo.value.blocks = currentProjectInfo.value.blocks.filter(block => block.block_id !== id);
}

async function saveProject() {
  try {
    await $fetch(`/api/projects/${postIdFromRoute.value}/projects/update/`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(currentProjectInfo.value)
    });
    showToast('Project updated succesfully', 'success');
    refresh();
  } catch (error) {
    console.log(error)
    showToast('Error while saving', 'error');
  }
}

async function deleteProject() {
  try {
    await $fetch(`/api/projects/${postIdFromRoute.value}/projects/delete/`, {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' },
      body: { project: postIdFromRoute.value }
    });
    showToast('Project deleted succesfully', 'success');
    navigateTo('/dashboard/projects/')
  } catch (error) {
    console.log(error)
    showToast('Error while deleting', 'error');
  }
}

const deletionInput = ref('')
const checkDeletion = computed(() => {
  if (deletionInput.value === `Delete/${currentProjectInfo.value.post_name}`) return true;
  return false;
})
</script>

<template>
  <header class="bg-slate-200 border-b p-4 flex items-center justify-between gap-4 sticky top-0 z-10">
    <div class="flex items-center gap-3 flex-grow min-w-0">
      <Button variant="outline" size="icon" @click="navigateTo('/dashboard/projects/')">
        <Icon name="material-symbols:arrow-back-ios-new-rounded" class="text-lg" />
      </Button>

      <Separator orientation="vertical" class="h-8" />

      <Input v-model="currentProjectInfo.post_name" placeholder="Nome del Progetto"
        class="bg-transparent border-none text-2xl font-semibold p-0 h-auto focus-visible:ring-0 truncate" />
    </div>

    <div class="flex items-center gap-2 flex-shrink-0">
      <Select v-model="postStatus">
        <SelectTrigger class="w-[150px] bg-white">
          <SelectValue placeholder="Seleziona stato" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="true">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-green-500"></span>
                Attivo
              </div>
            </SelectItem>
            <SelectItem value="false">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-slate-400"></span>
                Disattivato
              </div>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Button class="bg-slate-700 hover:bg-slate-600" :disabled="!checkChanges || pending" @click="saveProject">
        <div v-if="pending">
          <Icon name="ri:loader-fill" class="mr-2 animate-spin" />
          Saving...
        </div>

        <div v-else>
          <Icon name="material-symbols:save-outline-rounded" class="mr-2" />
          Salva
        </div>

      </Button>

      <Popover>
        <PopoverTrigger as-child>
          <Button variant="destructive" size="icon">
            <Icon name="material-symbols:delete-outline-rounded" class="text-lg" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" side="top" class="w-80">
          <div class="flex flex-col gap-2">
            <Label class="font-bold">Sei assolutamente sicuro?</Label>
            <p class="text-sm">
              Questa azione non può essere annullata. Per confermare la cancellazione, digita
              <strong class="text-red-600">Delete/{{ currentProjectInfo.post_name }}</strong>
              nel campo qui sotto.
            </p>
            <Input v-model="deletionInput" placeholder="Delete/..." />
            <div class="flex justify-end gap-2 mt-2">
              <PopoverClose as-child>
                <Button variant="secondary">Annulla</Button>
              </PopoverClose>
              <Button :disabled="!checkDeletion" @click="deleteProject">Conferma Cancellazione</Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  </header>
  <div class="bg-slate-50 p-2">
    <Card class="m-4">
      <CardHeader>
        <CardTitle class="content-middle flex">
          <Icon name="gg:website" class="text-lg mr-2" />
          Project info
        </CardTitle>
        <CardDescription>Here you can edit your description and background image
        </CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <div>
          <Label>Project Description</Label>
          <Textarea v-model="currentProjectInfo.post_desc" />
        </div>
        <div>
          <Label>Background Image</Label>
          <Input v-model="currentProjectInfo.post_image" />
          <img v-if="currentProjectInfo.post_image" :src="currentProjectInfo.post_image"
            class="mt-2 rounded-md border dark:border-slate-700 max-h-40 w-auto" />
        </div>
      </CardContent>
    </Card>
    <Card class="m-4">
      <CardHeader>
        <CardTitle class="content-middle flex">
          <Icon name="uil:web-section" class="text-lg mr-2" />
          Blocks
        </CardTitle>
        <CardDescription>Here you can edit your blocks for project: <strong>{{ currentProjectInfo.post_name }}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4">
        <div class="flex justify-between gap-4">
          <Select v-model="selectBlockToAdd">
            <SelectTrigger>
              <SelectValue placeholder="Select a block" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Blocks types</SelectLabel>
                <SelectItem value="text">
                  <Icon name="memory:text-box" /> Text Block
                </SelectItem>
                <SelectItem value="image">
                  <Icon name="memory:image" /> Image Block
                </SelectItem>
                <SelectItem value="text-image">
                  <Icon name="memory:text-image" /> Text and Image Block
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button :disabled="!checkBlockToAdd" @click="addBlock">Add Block</Button>
        </div>
        <Separator label="Edit Blocks" />

        <div v-if="sortedBlocks.length > 0">
          <div v-for="(block, index) in sortedBlocks" :key="block.block_id">
            <Accordion type="single" collapsible class="bg-slate-200 rounded-xl px-4 my-2">
              <AccordionItem value="item-1" class="border-b-0">

                <div class="flex items-center justify-between w-full">
                  <AccordionTrigger class="capitalize flex-grow">{{ block.block_name }} Block</AccordionTrigger>

                  <div class="flex gap-1 ml-4 flex-shrink-0">
                    <Button size="icon" variant="ghost" @click="moveBlock(block.block_id, -1)" :disabled="index === 0"
                      class="disabled:opacity-25">
                      <Icon name="material-symbols:arrow-upward-alt-rounded" />
                    </Button>
                    <Button size="icon" variant="ghost" @click="moveBlock(block.block_id, 1)"
                      :disabled="index === sortedBlocks.length - 1" class="disabled:opacity-25">
                      <Icon name="material-symbols:arrow-downward-alt-rounded" />
                    </Button>

                    <Popover>
                      <PopoverTrigger>
                        <Button variant="outline" size="icon"
                          class="bg-red-400 hover:bg-red-500/80 text-white hover:text-white">
                          <Icon name="material-symbols:delete-outline-rounded" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="center" side="left" class="flex flex-col gap-2">
                        <Label>Are you sure?</Label>
                        <p>You are going to delete <strong>block #{{ block.block_name }}</strong></p>
                        <div class="flex justify-between gap-2 mt-2">

                          <PopoverClose as-child>
                            <Button variant="secondary">Undo</Button>
                          </PopoverClose>
                          <Button @click="removeBlock(block.block_id)">Confirm</Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <AccordionContent class="bg-slate-50 rounded-md p-4 mb-4">
                  <div v-if="['text', 'text-image'].includes(block.block_name)" class="flex flex-col gap-4">
                    <div class="border-b dark:border-slate-700 pb-4 mb-4">
                      <h3 class="font-semibold text-lg text-slate-800 dark:text-slate-200">Text Settings</h3>
                    </div>
                    <div>
                      <Label>Title</Label>
                      <Input class="bg-white" v-model="block.block_title" />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea class="bg-white" v-model="block.block_content" />
                    </div>
                  </div>

                  <div v-if="['image', 'text-image'].includes(block.block_name)" class="flex flex-col gap-4 mt-6">
                    <div class="border-b dark:border-slate-700 pb-4 mb-4">
                      <h3 class="font-semibold text-lg text-slate-800 dark:text-slate-200">Image Settings</h3>
                    </div>
                    <div>
                      <Label>Image Url</Label>
                      <Input class="bg-white" v-model="block.image_url" />
                      <img v-if="block.image_url" :src="block.image_url"
                        class="mt-2 rounded-md border dark:border-slate-700 max-h-40 w-auto" />
                    </div>
                    <div>
                      <Label>Hover Effect</Label>
                      <div class="flex items-center gap-3 mt-1">
                        <Checkbox :id="'terms' + block.block_id" v-model="block.hover_effect" />
                        <div class="grid gap-1.5 leading-none">
                          <label :for="'terms' + block.block_id"
                            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {{ block.hover_effect ? 'Activated' : 'Disabled' }}
                          </label>
                          <p class="text-sm text-muted-foreground">
                            This {{ block.hover_effect ? 'activates' : 'disables' }} the hover effect.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Alt Text</Label>
                        <Input class="bg-white" v-model="block.altText" />
                      </div>
                      <div>
                        <Label>Didascalia (Caption)</Label>
                        <Input class="bg-white" v-model="block.didascalia" />
                      </div>
                    </div>
                  </div>


                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <div v-else>
          Non ci sono blocchi da visualizzare.
        </div>
      </CardContent>
    </Card>
  </div>
</template>