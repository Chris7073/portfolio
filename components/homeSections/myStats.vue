<template>
  <section class="relative z-20 bg-slate-50 dark:bg-slate-900 py-16 lg:py-24">
    <div class="container mx-auto px-4">

      <div class="text-center mb-12 lg:mb-16">
        <h3 class="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-slate-100">
          Tecnologie e Strumenti
        </h3>
        <p class="text-lg text-slate-600 dark:text-slate-400 mt-3 max-w-2xl mx-auto">
          I principali strumenti che utilizzo ogni giorno per dare vita a progetti performanti e moderni.
        </p>
      </div>

      <div class="px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 lg:gap-6">

        <div v-for="tech in techLogos" :key="tech.name"
          class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 border border-slate-200/80 dark:border-slate-700 flex flex-col items-center justify-center gap-4 transition-all duration-300">
          <Icon :name="`simple-icons:${tech.icon}`" class="w-12 h-12 text-slate-700 dark:text-slate-200" />
          <p class="text-sm font-semibold text-center text-slate-600 dark:text-slate-300">
            {{ tech.name }}
          </p>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

// La lista di tecnologie. Semplice da gestire, anche quando arriverà da un DB.
const techLogos = ref([
  { name: 'Vue', icon: 'vuedotjs' },
  { name: 'Nuxt', icon: 'nuxtdotjs' },
  { name: 'Tailwind CSS', icon: 'tailwindcss' },
  { name: 'Bootstrap', icon: 'bootstrap' },
  { name: 'MongoDB', icon: 'mongodb' },
  { name: 'Figma', icon: 'figma' },
]);
</script>