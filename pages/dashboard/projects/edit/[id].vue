<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useFetch, useRoute } from '#app';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input'; // Assicurati che queste importazioni siano corrette
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

definePageMeta({
    middleware: 'auth-dashboard'
});

// --- Interfacce Dati ---
interface PortfolioPost {
    post_id: string;
    post_name: string;
    [key: string]: any;
}

interface TPostBlock {
    id?: string | number;
    post_id: string;
    block_position: string | number;
    block_content: string;
    block_name: string;
    [key: string]: any;
}

interface CurrentPageConfigItem {
    filterBlocks: TPostBlock | undefined; // Contiene il blocco CLONATO per la modifica
}

interface EditableStateSnapshot {
    postDetails: PortfolioPost | null;
    pageConfig: CurrentPageConfigItem[];
}

const route = useRoute();
const currentParamId = computed(() => route.params.id as string);

const { data: portfolioProjectsAll } = useFetch<PortfolioPost[]>('/api/portfolio-posts');
const { data: postBlocksAll, pending: postBlocksPending, error: postBlocksError } = useFetch<TPostBlock[]>('/api/post-blocks');

const currentPageConfig = ref<CurrentPageConfigItem[]>([]);
const editablePostDetails = ref<PortfolioPost | null>(null);

const history = ref<EditableStateSnapshot[]>([]);
const historyIndex = ref(-1);
const MAX_HISTORY_ENTRIES = 50;

function deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    try {
        return JSON.parse(JSON.stringify(obj));
    } catch (e) {
        console.error("Errore nel deep clone:", e, obj);
        return obj;
    }
}

const isRestoringState = ref(false);

function saveStateToHistory() {
    if (isRestoringState.value) {
        return;
    }
    const snapshot: EditableStateSnapshot = {
        postDetails: deepClone(editablePostDetails.value),
        pageConfig: deepClone(currentPageConfig.value),
    };
    if (historyIndex.value < history.value.length - 1) {
        history.value.splice(historyIndex.value + 1);
    }
    history.value.push(snapshot);
    historyIndex.value = history.value.length - 1;
    if (history.value.length > MAX_HISTORY_ENTRIES) {
        history.value.shift();
        historyIndex.value--;
    }
}

function undo() {
    if (canUndo.value) {
        isRestoringState.value = true;
        historyIndex.value--;
        const previousState = history.value[historyIndex.value];
        editablePostDetails.value = deepClone(previousState.postDetails);
        currentPageConfig.value = deepClone(previousState.pageConfig);
        nextTick(() => { isRestoringState.value = false; });
    }
}

function redo() {
    if (canRedo.value) {
        isRestoringState.value = true;
        historyIndex.value++;
        const nextState = history.value[historyIndex.value];
        editablePostDetails.value = deepClone(nextState.postDetails);
        currentPageConfig.value = deepClone(nextState.pageConfig);
        nextTick(() => { isRestoringState.value = false; });
    }
}

const canUndo = computed(() => historyIndex.value > 0);
const canRedo = computed(() => historyIndex.value < history.value.length - 1);

watch(
    [postBlocksAll, portfolioProjectsAll, currentParamId],
    ([newPostBlocks, newPortfolioProjects, newId]) => {
        isRestoringState.value = true;

        editablePostDetails.value = null;
        if (newId && newPortfolioProjects) {
            const originalPost = newPortfolioProjects.find(p => p.post_id === newId);
            if (originalPost) {
                editablePostDetails.value = deepClone(originalPost);
            }
        }

        currentPageConfig.value = []; // Resetta per i nuovi blocchi
        if (newId && newPostBlocks) {
            // USA FILTER per prendere TUTTI i blocchi corrispondenti
            const matchingBlocks = newPostBlocks.filter(b => b.post_id === newId);

            if (matchingBlocks.length > 0) {
                matchingBlocks.forEach(block => {
                    // Clona ogni blocco e wrappalo
                    currentPageConfig.value.push({ filterBlocks: deepClone(block) });
                });
            } else {
                // Nessun blocco trovato, potremmo lasciare currentPageConfig vuoto
                // o pushare un placeholder se il template lo gestisce (il tuo v-if lo fa)
                 currentPageConfig.value.push({ filterBlocks: undefined }); // Coerente con la gestione precedente
            }
        } else if (!postBlocksPending.value) {
            currentPageConfig.value.push({ filterBlocks: undefined });
        }

        history.value = [];
        historyIndex.value = -1;
        nextTick(() => {
            isRestoringState.value = false;
            if (editablePostDetails.value || currentPageConfig.value.some(c => c.filterBlocks)) {
                saveStateToHistory();
            }
        });
    },
    { immediate: true }
);

function handleInputModification() {
    saveStateToHistory();
}

const checkChanges = computed<boolean>(() => {
    // 1. Confronta i dettagli del post
    const originalPost = portfolioProjectsAll.value?.find(p => p.post_id === currentParamId.value);
    // Semplifichiamo il confronto per null/undefined e contenuto
    if (JSON.stringify(originalPost || null) !== JSON.stringify(editablePostDetails.value || null)) {
        return true;
    }

    // 2. Confronta i blocchi di contenuto
    // Ottieni i blocchi originali per l'ID corrente
    const originalRelevantBlocks = postBlocksAll.value?.filter(b => b.post_id === currentParamId.value) || [];
    
    // Estrai i blocchi attualmente modificabili da currentPageConfig
    const currentEditableBlocks = currentPageConfig.value
        .map(item => item.filterBlocks)
        .filter(block => block !== undefined) as TPostBlock[]; // Array di TPostBlock

    // Confronta lunghezza e contenuto
    if (originalRelevantBlocks.length !== currentEditableBlocks.length) {
        return true;
    }
    if (JSON.stringify(originalRelevantBlocks) !== JSON.stringify(currentEditableBlocks)) {
        return true;
    }

    return false; // Nessuna modifica rilevata
});

</script>

<template>
    <div v-if="editablePostDetails">
        <div class="bg-gray-100 p-4 flex justify-between items-center sticky top-0 z-10">
            <div>
                <Input v-if="editablePostDetails" class="bg-white"
                    v-model="editablePostDetails.post_name" @blur="handleInputModification" />
            </div>
            <div class="flex gap-1 md:gap-2">
                <Button @click="undo" :disabled="!canUndo" size="icon" variant="outline" aria-label="Annulla Modifica">
                    <Icon name="material-symbols:undo" />
                </Button>
                <Button @click="redo" :disabled="!canRedo" size="icon" variant="outline" aria-label="Ripeti Modifica">
                    <Icon name="material-symbols:redo" />
                </Button>
                <Button :disabled="!checkChanges" @click="() => { /* Logica per salvare il progetto */ }"
                    class="bg-blue-500 hover:bg-blue-400 text-white">Salva Progetto</Button>
            </div>
        </div>

        <div v-if="currentPageConfig.length > 0 && currentPageConfig.some(c => c.filterBlocks)" class="p-4 flex gap-2 flex-col">
            <div v-for="(bloccoWrapper, index) in currentPageConfig"
                :key="bloccoWrapper.filterBlocks?.id || `block-wrapper-${index}`">
                <div v-if="bloccoWrapper && bloccoWrapper.filterBlocks">
                    <Accordion type="single" collapsible class="bg-gray-200 rounded-lg px-4 w-full">
                        <AccordionItem :value="`item-${bloccoWrapper.filterBlocks.id || index}`" class="border-b-0">
                            <AccordionTrigger class="hover:no-underline">{{ bloccoWrapper.filterBlocks.block_name }} block</AccordionTrigger>
                            <AccordionContent class="bg-white p-4 rounded-sm m-2">
                                <div v-if="bloccoWrapper.filterBlocks.block_name === 'text'">
                                    <Label :for="`content-text-${bloccoWrapper.filterBlocks.id || index}`" class="text-sm font-medium">Content</Label>
                                    <Input :id="`content-text-${bloccoWrapper.filterBlocks.id || index}`"
                                        v-model="bloccoWrapper.filterBlocks.block_content"
                                        @blur="handleInputModification" class="mt-1" />
                                </div>
                                <div v-else-if="bloccoWrapper.filterBlocks.block_name === 'image'">
                                    <Label :for="`content-image-${bloccoWrapper.filterBlocks.id || index}`" class="text-sm font-medium">Image URL</Label>
                                    <Input :id="`content-image-${bloccoWrapper.filterBlocks.id || index}`"
                                        v-model="bloccoWrapper.filterBlocks.block_content" @blur="handleInputModification" class="mt-1" />
                                        <Input v-model="bloccoWrapper.filterBlocks.info.altText" @blur="handleInputModification" class="mt-1" />

                                        <Input v-model="bloccoWrapper.filterBlocks.info.didascalia" @blur="handleInputModification" class="mt-1" />
                                    <img v-if="bloccoWrapper.filterBlocks.block_content" :src="bloccoWrapper.filterBlocks.block_content" alt="Image preview" class="mt-2 max-h-48 rounded"/>
                                </div>
                                <div v-else>
                                    <p class="text-sm text-gray-600">Blocco '{{ bloccoWrapper.filterBlocks.block_name }}' non riconosciuto o senza editor specifico.</p>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
        </div>
        <div v-else-if="!postBlocksPending" class="p-8 text-center text-gray-500">
            <p>Nessun blocco di contenuto configurato per questo progetto.</p>
        </div>
         <div v-if="postBlocksPending" class="p-8 text-center text-gray-500">
            <p>Caricamento blocchi...</p>
        </div>

    </div>
    <div v-else-if="!postBlocksPending && !portfolioProjectsAll?.find(p => p.post_id === currentParamId)" class="p-8 text-center text-gray-500">
        <p>Il progetto con ID '{{ currentParamId }}' non è stato trovato o i dati sono ancora in caricamento.</p>
    </div>
    <div v-else class="p-8 text-center text-gray-500">
        <p>Caricamento dati del progetto...</p>
    </div>
</template>