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
  if (!checkChanges.value) {
    return true;
  }

  const answer = window.confirm(
    'Hai delle modifiche non salvate. Sei sicuro di voler lasciare la pagina? I tuoi dati andranno persi.'
  );

  if (!answer) {
    return false;
  }
});

const route = useRoute();
const { data: allProjects, pending, refresh } = useFetch('/api/portfolio-posts');

const postIdFromRoute = computed(() => Number(route.params.id));
const singleProject = computed(() => {
  return allProjects.value?.find(p => p.post_id === postIdFromRoute.value);
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
    block_position: number;
    hover_effect: boolean;
    image_url: string;
    altText: string;
    didascalia: string;
    cards: {
      c_id: number;
      c_title: string;
      c_desc: string;
      c_icon: string;
    }[];
  }[]
});


// Stato per conservare una copia dei dati originali
const originalProjectInfo = ref<typeof currentProjectInfo.value | null>(null);

// Sostituisci il tuo blocco watch con questo
watch(singleProject, (newProjectData) => {
  if (newProjectData) {
    const formattedData = {
      post_id: newProjectData.post_id,
      post_active: newProjectData.post_active,
      post_cat: newProjectData.post_cat,
      post_name: newProjectData.post_name,
      post_desc: newProjectData.post_desc,
      post_image: newProjectData.post_image ?? '',
      // LA CORREZIONE È QUI: aggiungiamo `: any` a `block` per dire a TypeScript
      // di fidarsi di noi e di permetterci di accedere a qualsiasi proprietà.
      blocks: (newProjectData.blocks ?? []).map((block: any, index) => ({
        block_id: block.block_id,
        block_name: block.block_name,
        block_title: block.block_title,
        block_content: block.block_content,
        block_position: typeof block.block_position === 'number' ? block.block_position : index,
        hover_effect: block.hover_effect,
        image_url: block.image_url ?? '',
        altText: block.altText ?? '',
        didascalia: block.didascalia ?? '',
        // Ora questa riga è valida. Se `block.cards` arriva dall'API, lo usiamo.
        // Altrimenti, `?? []` crea un array vuoto, garantendo che `cards` esista sempre.
        cards: block.cards ?? []
      }))
    };

    currentProjectInfo.value = JSON.parse(JSON.stringify(formattedData));
    originalProjectInfo.value = JSON.parse(JSON.stringify(formattedData));
  }
}, {
  immediate: true
});


const sortedBlocks = computed(() => {
  return currentProjectInfo.value.blocks.slice().sort((a, b) => a.block_position - b.block_position);
});


function moveBlock(blockId: number, direction: -1 | 1) {
  const blocks = currentProjectInfo.value.blocks;
  const currentIndex = sortedBlocks.value.findIndex(b => b.block_id === blockId);

  if (currentIndex === -1 || (currentIndex === 0 && direction === -1) || (currentIndex === sortedBlocks.value.length - 1 && direction === 1)) {
    return;
  }

  const blockToSwapWith = sortedBlocks.value[currentIndex + direction];
  const currentBlockInOriginalArray = blocks.find(b => b.block_id === blockId);
  const blockToSwapInOriginalArray = blocks.find(b => b.block_id === blockToSwapWith.block_id);

  if (!currentBlockInOriginalArray || !blockToSwapInOriginalArray) return;

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

  const newBlock = {
    block_id: Date.now(),
    block_name: selectBlockToAdd.value,
    block_title: `Nuovo Blocco - ${selectBlockToAdd.value}`,
    block_content: '',
    block_position: currentProjectInfo.value.blocks.length+1,
    hover_effect: false,
    image_url: '',
    altText: '',
    didascalia: '',
    // Se il blocco è di tipo 'cards', lo inizializziamo con una card di esempio
    cards: selectBlockToAdd.value === 'cards' ? [{
      c_id: Date.now() + 1,
      c_title: 'Skill Iniziale',
      c_desc: '',
      c_icon: 'plus',
    }] : [] // Altrimenti, l'array delle cards è vuoto
  };

  currentProjectInfo.value.blocks.push(newBlock);
  selectBlockToAdd.value = '';
}

function removeBlock(id: number) {
  currentProjectInfo.value.blocks = currentProjectInfo.value.blocks.filter(block => block.block_id !== id);
}

// --- MODIFICA 1: Funzioni `addCard` e `removeCard` corrette ---
// Ora accettano l'ID del blocco per sapere dove operare.

/**
 * Aggiunge una nuova card a un blocco specifico.
 * @param {number} blockId L'ID del blocco a cui aggiungere la card.
 */
const addCard = (blockId: number) => {
  const targetBlock = currentProjectInfo.value.blocks.find(b => b.block_id === blockId);
  if (targetBlock) {
    targetBlock.cards.push({
      c_id: Date.now(), // ID Unico
      c_title: 'Nuova Card Senza Nome',
      c_desc: 'Descrizione della card da modificare',
      c_icon: 'plus'
    });
  }
};

/**
 * Rimuove una card specifica da un blocco specifico.
 * @param {number} blockId L'ID del blocco da cui rimuovere la card.
 * @param {number} cardId L'ID della card da rimuovere.
 */
const removeCard = (blockId: number, cardId: number) => {
  const targetBlock = currentProjectInfo.value.blocks.find(b => b.block_id === blockId);
  if (targetBlock) {
    targetBlock.cards = targetBlock.cards.filter(
      card => card.c_id !== cardId
    );
  }
};

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
  <div>
    <header class="bg-slate-200 dark:bg-slate-900 border-b dark:border-b-slate-800 p-4 flex items-center justify-between gap-4 sticky top-0 z-10">
      <div class="flex items-center gap-3 flex-grow min-w-0">
        <Button variant="outline" size="icon" @click="navigateTo('/dashboard/projects/')" class="dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700">
          <Icon name="material-symbols:arrow-back-ios-new-rounded" class="text-lg" />
        </Button>

        <Separator orientation="vertical" class="h-8 dark:bg-slate-700" />

        <Input v-model="currentProjectInfo.post_name" placeholder="Nome del Progetto"
          class="bg-transparent border-none text-2xl font-semibold p-0 h-auto focus-visible:ring-0 truncate dark:text-slate-50" />
      </div>

      <div class="flex items-center gap-2 flex-shrink-0">
        <Select v-model="postStatus">
          <SelectTrigger class="w-[150px] bg-white dark:bg-slate-900 dark:border-slate-700">
            <SelectValue placeholder="Seleziona stato" />
          </SelectTrigger>
          <SelectContent class="dark:bg-slate-950 dark:border-slate-800">
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

        <Button class="bg-slate-800 hover:bg-slate-700 dark:bg-sky-600 dark:hover:bg-sky-500" :disabled="!checkChanges || pending" @click="saveProject">
          <div v-if="pending" class="flex items-center">
            <Icon name="ri:loader-fill" class="mr-2 animate-spin" />
            Saving...
          </div>
          <div v-else class="flex items-center">
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
          <PopoverContent align="end" side="top" class="w-80 dark:bg-slate-950 dark:border-slate-800">
            <div class="flex flex-col gap-2">
              <Label class="font-bold dark:text-slate-100">Sei assolutamente sicuro?</Label>
              <p class="text-sm dark:text-slate-400">
                Questa azione non può essere annullata. Per confermare la cancellazione, digita
                <strong class="text-red-600 dark:text-red-500">Delete/{{ currentProjectInfo.post_name }}</strong>
                nel campo qui sotto.
              </p>
              <Input v-model="deletionInput" placeholder="Delete/..." class="dark:bg-slate-900 dark:border-slate-700" />
              <div class="flex justify-end gap-2 mt-2">
                <PopoverClose as-child>
                  <Button variant="secondary" class="dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">Annulla</Button>
                </PopoverClose>
                <Button :disabled="!checkDeletion" @click="deleteProject" variant="destructive">Conferma Cancellazione</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>

    <div class="bg-slate-50 dark:bg-slate-950 p-2">
      <Card class="m-4 dark:bg-slate-900 dark:border-slate-800">
        <CardHeader>
          <CardTitle class="content-middle flex dark:text-slate-100">
            <Icon name="gg:website" class="text-lg mr-2" />
            Project info
          </CardTitle>
          <CardDescription class="dark:text-slate-400">Here you can edit your description and background image</CardDescription>
        </CardHeader>
        <CardContent class="grid gap-4 grid-cols-1 lg:grid-cols-2">
          <div>
            <Label class="dark:text-slate-200">Project Description</Label>
            <Textarea v-model="currentProjectInfo.post_desc" class="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-50" />
          </div>
          <div>
            <Label class="dark:text-slate-200">Background Image</Label>
            <Input v-model="currentProjectInfo.post_image" class="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-50" />
            <img v-if="currentProjectInfo.post_image" :src="currentProjectInfo.post_image"
              class="mt-2 rounded-md border dark:border-slate-700 max-h-40 w-auto" />
          </div>
        </CardContent>
      </Card>
      
      <Card class="m-4 dark:bg-slate-900 dark:border-slate-800">
        <CardHeader>
          <CardTitle class="content-middle flex dark:text-slate-100">
            <Icon name="uil:web-section" class="text-lg mr-2" />
            Blocks
          </CardTitle>
          <CardDescription class="dark:text-slate-400">Here you can edit your blocks for project: <strong class="dark:text-slate-300">{{ currentProjectInfo.post_name }}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent class="grid gap-4">
          <div class="flex justify-between gap-4">
            <Select v-model="selectBlockToAdd">
              <SelectTrigger class="dark:bg-slate-800 dark:border-slate-700">
                <SelectValue placeholder="Select a block" />
              </SelectTrigger>
              <SelectContent class="dark:bg-slate-950 dark:border-slate-700">
                <SelectGroup>
                  <SelectLabel>Blocks types</SelectLabel>
                  <SelectItem value="text"><Icon name="memory:text-box" /> Text Block</SelectItem>
                  <SelectItem value="image"><Icon name="memory:image" /> Image Block</SelectItem>
                  <SelectItem value="text-image"><Icon name="memory:text-image" /> Text and Image Block</SelectItem>
                  <SelectItem value="image-text"><Icon name="memory:text-image" /> Image and Text Block</SelectItem>
                  <SelectItem value="cards"><Icon name="memory:card-text" /> Cards Block</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button :disabled="!checkBlockToAdd" @click="addBlock">Add Block</Button>
          </div>
          <Separator label="Edit Blocks" />
          
          <div v-if="sortedBlocks.length > 0">
            <div v-for="(block, index) in sortedBlocks" :key="block.block_id">
              <Accordion type="single" collapsible class="bg-slate-200 dark:bg-slate-800/50 dark:border dark:border-slate-700 rounded-xl px-4 my-2">
                <AccordionItem :value="`block-${block.block_id}`" class="border-b-0">
                  <div class="flex items-center justify-between w-full">
                    <AccordionTrigger class="capitalize flex-grow dark:text-slate-200">{{ block.block_name }} Block</AccordionTrigger>
                    <div class="flex gap-1 ml-4 flex-shrink-0">
                      <Button size="icon" variant="ghost" @click="moveBlock(block.block_id, -1)" :disabled="index === 0" class="disabled:opacity-25 dark:text-slate-400 dark:hover:bg-slate-700">
                        <Icon name="material-symbols:arrow-upward-alt-rounded" />
                      </Button>
                      <Button size="icon" variant="ghost" @click="moveBlock(block.block_id, 1)" :disabled="index === sortedBlocks.length - 1" class="disabled:opacity-25 dark:text-slate-400 dark:hover:bg-slate-700">
                        <Icon name="material-symbols:arrow-downward-alt-rounded" />
                      </Button>
                      <Popover>
                        <PopoverTrigger as-child>
                          <Button variant="outline" size="icon" class="bg-red-400 hover:bg-red-500/80 text-white hover:text-white">
                            <Icon name="material-symbols:delete-outline-rounded" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="center" side="left" class="flex flex-col gap-2 dark:bg-slate-950 dark:border-slate-800">
                          <Label class="dark:text-slate-200">Are you sure?</Label>
                          <p class="dark:text-slate-400">You are going to delete <strong>block #{{ block.block_name }}</strong></p>
                          <div class="flex justify-between gap-2 mt-2">
                            <PopoverClose as-child>
                              <Button variant="secondary" class="dark:bg-slate-800 dark:hover:bg-slate-700">Undo</Button>
                            </PopoverClose>
                            <Button @click="removeBlock(block.block_id)" variant="destructive">Confirm</Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <AccordionContent class="bg-slate-50 dark:bg-slate-800 rounded-md p-4 mb-4">
                    
                    <div v-if="['text', 'text-image', 'image-text', 'cards'].includes(block.block_name)" class="flex flex-col gap-4">
                      <div class="border-b dark:border-slate-700 pb-4 mb-4">
                        <h3 class="font-semibold text-lg text-slate-800 dark:text-slate-200">Text Settings</h3>
                      </div>
                      <div>
                        <Label class="dark:text-slate-300">Title</Label>
                        <Input class="bg-white dark:bg-slate-700" v-model="block.block_title" />
                      </div>
                      <div>
                        <Label class="dark:text-slate-300">Description</Label>
                        <Textarea class="bg-white dark:bg-slate-700" v-model="block.block_content" />
                      </div>
                    </div>

                    <div v-if="['image', 'text-image', 'image-text'].includes(block.block_name)" class="flex flex-col gap-4 mt-6">
                      <div class="border-b dark:border-slate-700 pb-4 mb-4">
                        <h3 class="font-semibold text-lg text-slate-800 dark:text-slate-200">Image Settings</h3>
                      </div>
                      <div>
                        <Label class="dark:text-slate-300">Image Url</Label>
                        <Input class="bg-white dark:bg-slate-700" v-model="block.image_url" />
                        <img v-if="block.image_url" :src="block.image_url" class="mt-2 rounded-md border dark:border-slate-700 max-h-40 w-auto" />
                      </div>
                      <div class="flex items-center gap-3 mt-1">
                        <Checkbox :id="'hover-' + block.block_id" v-model="block.hover_effect" />
                        <div class="grid gap-1.5 leading-none">
                          <label :for="'hover-' + block.block_id" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-slate-300">
                            {{ block.hover_effect ? 'Activated' : 'Disabled' }}
                          </label>
                          <p class="text-sm text-muted-foreground dark:text-slate-500">
                            This {{ block.hover_effect ? 'activates' : 'disables' }} the hover effect.
                          </p>
                        </div>
                      </div>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label class="dark:text-slate-300">Alt Text</Label>
                          <Input class="bg-white dark:bg-slate-700" v-model="block.altText" />
                        </div>
                        <div>
                          <Label class="dark:text-slate-300">Didascalia (Caption)</Label>
                          <Input class="bg-white dark:bg-slate-700" v-model="block.didascalia" />
                        </div>
                      </div>
                    </div>

                    <div v-if="block.block_name === 'cards'" class="flex flex-col gap-4">
                      <div class="border-b dark:border-slate-700 pb-4 mb-4 mt-6">
                        <h3 class="font-semibold text-lg text-slate-800 dark:text-slate-200">Cards Settings</h3>
                      </div>
                      <div class="flex justify-between">
                        <p class="dark:text-slate-300">{{ block.cards.length }} Cards</p>
                        <div class="flex gap-2">
                          <Button @click="addCard(block.block_id)">Add Card</Button>
                          <NuxtLink to="https://icones.js.org/collection/uil" target="_blank">
                            <Button variant="outline" size="icon"><Icon name="uil:icons" /></Button>
                          </NuxtLink>
                        </div>
                      </div>
                      <Accordion type="multiple" collapsible class="bg-gray-100 dark:bg-slate-700/50 rounded-md">
                        <AccordionItem v-for="(card, cardIndex) in block.cards" :key="card.c_id" :value="`card-item-${card.c_id}`" class="px-4">
                          <AccordionTrigger class="dark:text-slate-200">card {{ cardIndex + 1 }}</AccordionTrigger>
                          <AccordionContent class="flex gap-2 flex-col">
                            <div>
                              <Label class="dark:text-slate-300">Icon</Label>
                              <div class="flex flex-row items-center">
                                <Icon class="text-4xl mr-2 dark:text-slate-200" :name="card.c_icon || 'uil:ban'" />
                                <Input class="bg-white dark:bg-slate-700" v-model="card.c_icon" />
                              </div>
                            </div>
                            <div>
                              <Label class="dark:text-slate-300">Title</Label>
                              <Input class="bg-white dark:bg-slate-700" v-model="card.c_title" />
                            </div>
                            <div>
                              <Label class="dark:text-slate-300">Description</Label>
                              <Input class="bg-white dark:bg-slate-700" v-model="card.c_desc" />
                            </div>
                            <Popover>
                              <PopoverTrigger as-child>
                                <Button class="w-full" variant="destructive">Remove Card</Button> </PopoverTrigger>
                              <PopoverContent class="flex flex-col gap-2 dark:bg-slate-950 dark:border-slate-800">
                                <Label class="dark:text-slate-200">Are you sure?</Label>
                                <Button @click="removeCard(block.block_id, card.c_id)">Confirm</Button>
                              </PopoverContent>
                            </Popover>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
          <div v-else class="dark:text-slate-400">
            Non ci sono blocchi da visualizzare.
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>