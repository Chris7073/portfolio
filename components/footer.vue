<script lang="ts" setup>

</script>

<template>

    <div class="relative z-20 bg-gray-800 text-gray-300">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

    <div class="mb-8 text-center md:text-left">
      <h4 class="text-xl font-semibold text-white">Nome Azienda / Logo</h4>
      <p class="text-sm text-gray-400 mt-1">Un breve slogan o una descrizione.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
      <div class="md:col-span-1"> <h5 class="text-lg font-semibold text-white mb-3">Link Utili</h5>
        <ul class="space-y-2">
          <li><a href="#" class="hover:text-white transition-colors duration-200">Chi Siamo</a></li>
          <li><a href="#" class="hover:text-white transition-colors duration-200">Servizi</a></li>
          <li><a href="#" class="hover:text-white transition-colors duration-200">Contatti</a></li>
          <li><a href="#" class="hover:text-white transition-colors duration-200">FAQ</a></li>
        </ul>
      </div>

      <div class="md:col-span-2"> <h5 class="text-lg font-semibold text-white mb-3">Altre Risorse</h5>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
                <ul class="space-y-2">
                    <li><a href="#" class="hover:text-white transition-colors duration-200">Blog</a></li>
                    <li><a href="#" class="hover:text-white transition-colors duration-200">Carriere</a></li>
                    <li><a href="#" class="hover:text-white transition-colors duration-200">Policy Privacy</a></li>
                </ul>
            </div>
            <div>
                <ul class="space-y-2">
                    <li><a href="#" class="hover:text-white transition-colors duration-200">Termini di Servizio</a></li>
                    <li><a href="#" class="hover:text-white transition-colors duration-200">Supporto</a></li>
                    <li><a href="#" class="hover:text-white transition-colors duration-200">Mappa del Sito</a></li>
                </ul>
            </div>
        </div>
      </div>
    </div>

    <div class="border-t border-gray-700 pt-6 text-center">
      <p class="text-sm text-gray-400">
        &copy; <span>{{ new Date().getFullYear() }}</span> Nome Azienda. Tutti i diritti riservati.
      </p>
    </div>

  </div>
</div>
</template>