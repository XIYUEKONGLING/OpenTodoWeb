<script setup lang="ts">
import { useTheme } from "./composables/useTheme";
import { ConfigProvider } from 'ant-design-vue';

const { initTheme, antAlgorithm, isDark } = useTheme();
initTheme();
</script>

<template>
  <ConfigProvider
      :theme="{
      algorithm: antAlgorithm,
      token: {
        colorPrimary: '#3b82f6',
        colorBgContainer: isDark ? '#1e293b' : '#ffffff', // slate-800 : white
        colorBgLayout: isDark ? '#020617' : '#f9fafb',    // slate-950 : gray-50
        colorText: isDark ? '#f1f5f9' : '#1e293b',
      }
    }"
  >
    <router-view />
  </ConfigProvider>
</template>
