export default defineNuxtRouteMiddleware(async (to, from) => {
  const { data: webSettings, error } = await useFetch('/api/web-settings');
  if (error.value) {
    console.error('Errore nel recupero delle impostazioni web:', error.value);

    return;
  }
  if (webSettings.value?.maintenance) {
    return navigateTo('/maintenance');
  }
});