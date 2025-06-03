<script lang="ts" setup>
const { data: storyInfo, pending } = useFetch('/api/landing-settings')

// Se hai componenti Card globali come nella dashboard, potresti usarli.
// Altrimenti, stilizzeremo i div per assomigliare a delle card.
// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card' // Esempio se li avessi
</script>

<template>
  <section v-if="storyInfo && storyInfo.story" class="relative z-10 bg-slate-100 dark:bg-slate-900 py-16 lg:py-24 px-4">
    <div class="container mx-auto">
      <div class="text-center mb-12 lg:mb-16">
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 dark:text-white mb-4">
          {{storyInfo.story_title}}
        </h2>
        <p class="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          {{storyInfo.story_desc}}
          </p>
      </div>

      <div v-if="pending" class="text-center py-10">
        <Loader/>
      </div>

      <div v-else-if="storyInfo && storyInfo.story_me && storyInfo.story_me.length > 0"
           class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">

        <div v-for="story in storyInfo.story_me" :key="story.me_title" class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-2xl
                    border border-transparent hover:border-sky-500/50
                    transition-all duration-300 ease-in-out transform hover:-translate-y-1">

          <div class="flex flex-col items-start h-full">
            <div class="flex items-center mb-4">
              <span class="inline-flex justify-center items-center w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-sky-100 dark:bg-sky-700 mr-4 flex-shrink-0">
                <Icon :name="`uil:${story.me_icon}`" class="text-3xl lg:text-4xl text-sky-600 dark:text-sky-300" />
              </span>
              <h3 class="text-xl lg:text-2xl font-semibold text-sky-700 dark:text-sky-400 leading-tight">
                {{ story.me_title }}
              </h3>
            </div>

            <p class="text-slate-600 dark:text-slate-400 text-base leading-relaxed flex-grow">
              {{ story.me_desc }}
            </p>

            </div>
        </div>
      </div>

      <div v-else class="text-center py-10">
        <Icon name="uil:desert" class="text-5xl text-slate-400 dark:text-slate-500" />
        <p class="text-slate-600 dark:text-slate-300 mt-3 text-lg">
          Al momento non ci sono informazioni da mostrare qui.
        </p>
      </div>

      </div>
  </section>
</template>