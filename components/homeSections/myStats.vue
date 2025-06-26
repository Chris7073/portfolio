      
<script lang="ts" setup>
import { ref } from 'vue';

// La lista di tecnologie. Semplice da gestire, anche quando arriverà da un DB.
const techLogos = ref([
  { desc: 'framework Javascript', name: 'Nuxt', icon: 'nuxtdotjs' },
  { desc: 'framework CSS', name: 'Tailwind CSS', icon: 'tailwindcss' },
  { desc: 'Database', name: 'MongoDB', icon: 'mongodb' },
  { desc: 'Tool', name: 'Figma', icon: 'figma' },
]);

</script>
<template>
  <section id="tech" class="relative z-20 bg-slate-50 dark:bg-slate-900 py-16 lg:py-24">
    <div v-animate-on-scroll
      class="container group mx-auto px-4 opacity-0 transition-opacity duration-500 ease-out [&.is-visible]:opacity-100">

      <div class="text-center mb-12 lg:mb-16 opacity-0 -translate-y-8 transition-all duration-1000 ease-out group-[.is-visible]:opacity-100 group-[.is-visible]:translate-y-0">
        <h3 class="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-slate-100">
          Tecnologie e Strumenti
        </h3>
        <p class="text-lg text-slate-600 dark:text-slate-400 mt-3 max-w-2xl mx-auto">
          I principali strumenti che utilizzo ogni giorno per dare vita a progetti performanti e moderni.
        </p>
      </div>

      <ul class="px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        <li v-for="(tech, index) in techLogos" 
            :key="tech.name"
            class="transition-all duration-500 ease-out opacity-0 translate-y-6 group-[.is-visible]:opacity-100 group-[.is-visible]:translate-y-0"
            :style="{ 'transition-delay': `${200 + index * 50}ms` }">
          
          <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200/80 dark:border-slate-700 flex flex-col items-center justify-center gap-4 h-full
                       transform transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2">

            <Icon :name="`simple-icons:${tech.icon}`" class="text-5xl text-slate-700 dark:text-slate-200" />

            <div class="text-center">
              <h4 class="font-semibold text-slate-700 dark:text-slate-200">
                {{ tech.name }}
              </h4>
              <p class="text-sm text-slate-500 dark:text-slate-400">
                {{ tech.desc }}
              </p>
            </div>
            
          </div>
        </li>

      </ul>
    </div>
  </section>
</template>