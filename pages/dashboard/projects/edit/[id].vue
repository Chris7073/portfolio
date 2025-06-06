<script setup lang="ts">
definePageMeta({
  middleware: 'auth-dashboard'
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
      blocks: (newProjectData.blocks ?? []).map(block => ({
        block_id: block.block_id,
        block_name: block.block_name,
        block_title: block.block_title,
        block_content: block.block_content,
        hover_effect: block.hover_effect,
        image_url: block.image_url ?? '',
        altText: block.altText ?? '',
        didascalia: block.didascalia ?? '',
      }))
    };

    // Assegna i dati formattati sia allo stato corrente che a quello originale
    currentProjectInfo.value = JSON.parse(JSON.stringify(formattedData));
    originalProjectInfo.value = JSON.parse(JSON.stringify(formattedData));
  }
}, {
  immediate: true
});

/**
 * Controlla se ci sono differenze tra lo stato originale e quello corrente del progetto.
 * Restituisce 'true' se ci sono modifiche, altrimenti 'false'.
 */
const checkChanges = computed(() => {
  // Se i dati originali non sono ancora stati caricati, non ci sono modifiche.
  if (!originalProjectInfo.value) {
    return false;
  }

  // Il modo più semplice e robusto per confrontare due oggetti (anche annidati)
  // è confrontare le loro rappresentazioni JSON.
  // Questo rileva qualsiasi modifica, inclusi aggiunta/rimozione di blocchi o cambiamenti di ordine.
  const originalJson = JSON.stringify(originalProjectInfo.value);
  const currentJson = JSON.stringify(currentProjectInfo.value);

  // Se le stringhe JSON sono diverse, significa che qualcosa è cambiato.
  return originalJson !== currentJson;
});

const selectBlockToAdd = ref('');

const checkBlockToAdd = computed(() => {
  if (selectBlockToAdd.value === '') {
    return false;
  }
  return true;
});

function addBlock() {
  // 1. CONTROLLO DI SICUREZZA
  //    Non fare nulla se l'utente non ha selezionato un tipo di blocco.
  if (!selectBlockToAdd.value) {
    alert("Per favore, seleziona un tipo di blocco prima di aggiungerlo.");
    return; // Interrompe l'esecuzione della funzione qui.
  }

  // 2. CREA UN ID UNIVOCO PIÙ ROBUSTO
  //    Usare Date.now() è un modo semplice per generare un ID temporaneo 
  //    che ha una probabilità quasi nulla di essere duplicato sul client.
  const newBlockId = Date.now();

  // 3. CREA L'OGGETTO DEL NUOVO BLOCCO
  //    Usa il valore selezionato e imposta valori di default per le altre proprietà.
  const newBlock = {
    block_id: newBlockId,
    block_name: selectBlockToAdd.value,
    block_title: `Nuovo Blocco - ${selectBlockToAdd.value}`,
    block_content: '',
    hover_effect: false,
    image_url: '',
    altText: '',
    didascalia: ''
  };

  // 4. AGGIUNGI IL NUOVO BLOCCO ALL'ARRAY
  currentProjectInfo.value.blocks.push(newBlock);

  console.log("Aggiunto nuovo blocco:", newBlock);

  // 5. (CONSIGLIATO) RESETTA IL VALORE DEL SELECT
  //    Questo pulisce il dropdown, pronto per una nuova selezione.
  selectBlockToAdd.value = '';
}

async function saveProject() {
  console.log('save cliccato')
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
</script>

<template>
  <div class="bg-slate-200 p-4 flex justify-between">
    <Input v-model="currentProjectInfo.post_name" class="bg-white w-50" />
    <div class="flex flex-row gap-2">
      <Button class="bg-slate-600 hover:bg-slate-500" :disabled="!checkChanges" @click="saveProject">Save
        Project</Button>
      <Button variant="destructive" size="icon">
        <Icon name="material-symbols:delete-outline" />
      </Button>
    </div>
  </div>
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
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="text">
                Text Block
              </SelectItem>
              <SelectItem value="image">
                Image Block
              </SelectItem>
              <SelectItem value="text-image">
                Text and Image Block
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button :disabled="!checkBlockToAdd" @click="addBlock">Add Block</Button>
      </div>
      <Separator label="Edit Blocks" />
      <div v-if="currentProjectInfo.blocks && currentProjectInfo.blocks.length > 0">

        <div v-for="block in currentProjectInfo.blocks" :key="block.block_id">
          <Accordion type="single" collapsible class="bg-slate-200 rounded-xl px-4 my-2">
            <AccordionItem value="item-1">
              <AccordionTrigger class="capitalize">{{ block.block_name }} Block</AccordionTrigger>
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
                      <Checkbox :id="'terms' + block.block_id" v-model:checked="block.hover_effect" />
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
</template>