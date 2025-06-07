<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-blue-500">{{ error.statusCode }}</h1>
      
      <p class="mt-4 text-2xl font-semibold text-slate-700 dark:text-slate-200">
        {{ message }}
      </p>

      <p v-if="error.statusMessage" class="mt-2 text-slate-500 dark:text-slate-400">
        {{ error.statusMessage }}
      </p>

      <div class="mt-8">
        <Button variant="outline" @click="handleError">
          Return Home
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// Nuxt passa automaticamente la prop 'error' a questo componente
const props = defineProps({
  error: Object
});

// Calcola un messaggio user-friendly in base allo status code
const message = computed(() => {
  switch (props.error.statusCode) {
    case 404:
      return "Page Not Found";
    case 500:
      return "Internal Server Error";
    default:
      return "An unexpected error occurred";
  }
});

// La funzione 'clearError' è fornita da Nuxt per cancellare lo stato di errore
// e reindirizzare l'utente. È il modo corretto per uscire dalla pagina di errore.
const handleError = () => clearError({ redirect: '/' });
</script>