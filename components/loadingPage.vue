<template>
  <div class="h-dvh bg-gray-200">
    <div class="relative flex flex-col gap-4 justify-center items-center h-screen">
      <div class="grid grid-cols-1 grid-rows-1">
        <img class="col-start-1 row-start-1 w-60 place-self-center" src="../public/assets/loader/bg.png"
          alt="Immagine Sfondo">
        <img class="col-start-1 row-start-1 w-60 place-self-center custom-spin-slow"
          src="../public/assets/loader/spin.png" alt="Immagine Intermedia">
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes spin-custom-slow-kf {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.custom-spin-slow {
  animation: spin-custom-slow-kf 3s linear infinite;
  /* 3s per una rotazione lenta, puoi aggiustare */
}
</style>