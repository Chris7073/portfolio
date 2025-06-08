// plugins/litlyx.client.ts

import { Lit } from "litlyx-js";

export default defineNuxtPlugin(nuxtApp => {
  // Questa funzione contiene la logica di inizializzazione
  async function initializeLitlyx() {
    try {
      const websiteInfo = await $fetch('/api/web-settings');
      if (websiteInfo && websiteInfo.analytics) {
        Lit.init(websiteInfo.analytics);
        console.log('✅ Litlyx è stato inizializzato in modo sicuro.');
      } else {
        console.warn("Configurazione Litlyx non trovata. Inizializzazione saltata.");
      }
    } catch (error) {
      console.error('Errore durante il caricamento della configurazione per Litlyx:', error);
    }
  }

  // Usiamo l'hook 'app:mounted'. Questa funzione verrà eseguita UNA SOLA VOLTA,
  // dopo che l'intera applicazione Vue è stata montata e idratata con successo.
  nuxtApp.hooks.hook('app:mounted', () => {
    // Ora che l'app è stabile, accediamo al router per controllare la rotta attuale
    const router = useRouter();
    const currentPath = router.currentRoute.value.path;

    // Eseguiamo lo script solo se la pagina iniziale non è il dashboard
    if (!currentPath.startsWith('/dashboard')) {
      initializeLitlyx();
    }
  });
});