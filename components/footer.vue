<script lang="ts" setup>

const { data: landingInfo } = useFetch('/api/landing-settings');
const { data: websiteInfo } = useFetch('/api/web-settings');
</script>

<template>
  <footer class="relative z-20 bg-slate-100 dark:bg-slate-900">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      
      

      <div class="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
        <p>&copy; {{ new Date().getFullYear() }} {{ websiteInfo?.name || 'Tuo Nome' }}.</p>
        </div>
    </div>
  </footer>
</template>