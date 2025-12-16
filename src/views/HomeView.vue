<script setup lang="ts">
import AppLayout from "../components/AppLayout.vue";
import Sidebar from "../components/Sidebar.vue";
import { useI18n } from "../composables/useI18n";

const { t } = useI18n();
</script>

<template>
  <AppLayout>
    <Sidebar />
    <div class="flex-1 flex flex-col items-center justify-center bg-gray-50 text-center p-8">
      <div class="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
        <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <i class="fa-solid fa-layer-group text-2xl"></i>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ t('home.welcome') }}</h1>
        <p class="text-gray-500">{{ t('home.subtitle') }}</p>
      </div>
    </div>
  </AppLayout>
</template>
