<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Sidebar from "./Sidebar.vue";
import { useTheme } from "../composables/useTheme";

const { isDark } = useTheme();
const isMobile = ref(false);
const isSidebarCollapsed = ref(false);
const isMobileMenuOpen = ref(false);

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
  if (!isMobile.value) isMobileMenuOpen.value = false;
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => window.removeEventListener('resize', checkMobile));

const toggleSidebar = () => isSidebarCollapsed.value = !isSidebarCollapsed.value;
const toggleMobileMenu = () => isMobileMenuOpen.value = !isMobileMenuOpen.value;
</script>

<template>
  <!-- Root Container: Handles global text color and background for consistency -->
  <div class="flex h-screen w-full overflow-hidden transition-colors duration-300"
       :class="isDark ? 'bg-slate-950 text-slate-100' : 'bg-gray-50 text-slate-800'">

    <!-- Desktop Sidebar -->
    <aside
        v-if="!isMobile"
        class="h-full border-r transition-all duration-300 ease-in-out shrink-0 z-20"
        :class="[
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200',
        isSidebarCollapsed ? 'w-20' : 'w-64'
      ]"
    >
      <Sidebar :collapsed="isSidebarCollapsed" @toggle="toggleSidebar" />
    </aside>

    <!-- Mobile Header -->
    <div v-if="isMobile" class="fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-4 border-b shadow-sm transition-colors"
         :class="isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'">
      <span class="font-bold text-lg">OpenTodo</span>
      <button @click="toggleMobileMenu" class="p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-800">
        <i class="fa-solid fa-bars text-xl"></i>
      </button>
    </div>

    <!-- Mobile Drawer -->
    <div v-if="isMobile && isMobileMenuOpen" class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" @click="toggleMobileMenu">
      <div class="absolute right-0 top-0 bottom-0 w-64 shadow-xl transition-colors"
           :class="isDark ? 'bg-slate-900' : 'bg-white'"
           @click.stop>
        <Sidebar :collapsed="false" :isMobile="true" @close="toggleMobileMenu" />
      </div>
    </div>

    <!-- Main Content Area -->
    <!-- Added bg-gray-50/slate-950 here to ensure the main area always has the correct background -->
    <main class="flex-1 flex flex-col h-full overflow-hidden relative transition-colors"
          :class="[isMobile ? 'pt-16' : '', isDark ? 'bg-slate-950' : 'bg-gray-50']">
      <slot></slot>
    </main>
  </div>
</template>