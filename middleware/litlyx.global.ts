import { Lit } from "litlyx-js";

// Rendi la funzione del middleware 'async' per poter usare 'await'
export default defineNuxtRouteMiddleware(async (to) => {

    // Sposta la chiamata a useFetch QUI, all'interno del middleware
    const { data: websiteInfo } = await useFetch('/api/web-settings');

    if (!to.path.startsWith('/dashboard')) {
        if (!websiteInfo.value) {
            console.warn("Dati di configurazione non trovati, inizializzazione Litlyx saltata.");
            return;
        }
        Lit.init(websiteInfo.value.analytics);
    }
});