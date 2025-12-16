<script setup lang="ts">
import AppLayout from "../components/AppLayout.vue";
import { useI18n } from "../composables/useI18n";

const { t } = useI18n();
</script>

<template>
  <AppLayout>
    <div class="flex-1 flex flex-col items-center justify-center p-8 h-full">
      <div class="bg-white dark:bg-slate-900 p-12 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 max-w-md w-full transition-colors">
        <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <i class="fa-solid fa-layer-group text-2xl"></i>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">{{ t('home.welcome') }}</h1>
        <p class="text-gray-500 dark:text-gray-400 text-center">{{ t('home.subtitle') }}</p>
      </div>
    </div>
  </AppLayout>
</template>