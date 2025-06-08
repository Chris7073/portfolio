<script setup lang="ts">
import { useTheme } from '~/composables/useTheme';

const { themePreference, setThemePreference } = useTheme();

const cycleTheme = () => {
  const themes: ('light' | 'dark')[] = ['light', 'dark'];
  const currentIndex = themes.indexOf(themePreference.value);
  const nextIndex = (currentIndex + 1) % themes.length;
  setThemePreference(themes[nextIndex]);
}
</script>

<template>

  <Button @click="cycleTheme" size="icon" class="bg-transparent rounded-full text-slate-500 hover:text-blue-600 hover:bg-blue-100/50 dark:text-slate-400 dark:hover:text-sky-400 dark:hover:bg-slate-800 transition-colors duration-300 text-xl">
    <Icon v-if="themePreference === 'light'" name="material-symbols:sunny"/>
    <Icon v-else-if="themePreference === 'dark'" name="material-symbols:dark-mode"/>
    <span class="sr-only">Cambia tema</span>
  </Button>
</template>