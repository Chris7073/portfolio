// plugins/directives.ts

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('animate-on-scroll', {
    
    // Chiamato quando l'elemento viene montato nel DOM
    mounted(el) {
      // La logica che conosciamo bene

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
                    console.log('mostrato')
              // Quando l'elemento è visibile, aggiungiamo la classe!
              el.classList.add('is-visible');
              // E smettiamo di osservare per non ripetere l'animazione
              observer.unobserve(el);
            }
          });
        },
        { threshold: 0.2 } // Puoi personalizzare la soglia qui
      );

      // Salviamo l'observer sull'elemento per poterlo pulire dopo
      el._observer = observer;
      observer.observe(el);
    },
    // Chiamato quando l'elemento viene rimosso
    unmounted(el) {
      if (el._observer) {
        el._observer.disconnect();
      }
    },
  });
});