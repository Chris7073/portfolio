// middleware/auth-dashboard.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const { loggedIn } = useUserSession(); // Assumi che questo composable ti dia lo stato di login
  const loginRoute = '/dashboard/login'; // Definisci il percorso della tua pagina di login
  if (!loggedIn.value) {
    if (to.path !== loginRoute) {

      return navigateTo(loginRoute);
    }

    return; 
  }
  if (to.path === loginRoute) {
    return navigateTo('/dashboard'); 
  }

});