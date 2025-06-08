// composables/useTheme.ts

export const useTheme = () => {
  // `useCookie` è la chiave: persiste la scelta dell'utente ed è compatibile con SSR.
  // Il valore di default è 'system'.
  const themePreference = useCookie<'light' | 'dark'>('theme-preference', {
    default: () => 'dark',
    watch: true // Reagisce ai cambiamenti
  });

  // Stato interno per il tema *effettivamente* applicato ('light' o 'dark')
  const appliedTheme = useState<'light' | 'dark'>('theme-applied', () => 'light');

  // Funzione per cambiare la preferenza dell'utente
  const setThemePreference = (newPreference: 'light' | 'dark') => {
    themePreference.value = newPreference;
  };

  // Funzione che calcola quale tema applicare
  const updateAppliedTheme = () => {
      // Se la preferenza è 'light' o 'dark', usiamo quella
      appliedTheme.value = themePreference.value;
  };
  
  // Eseguiamo l'aggiornamento ogni volta che la preferenza cambia
  watch(themePreference, updateAppliedTheme);
  
  // Eseguiamo l'aggiornamento anche al primo caricamento
  onMounted(() => {
    updateAppliedTheme();
  });

  return {
    themePreference, // Lo stato della preferenza ('light', 'dark', 'system')
    appliedTheme,    // Lo stato del tema applicato ('light', 'dark')
    setThemePreference
  };
};