<script setup lang="ts">
import { ref } from 'vue';
import {useProfile} from "../composables/useProfile.ts";
import {useI18n} from "../composables/useI18n.ts";
import type {Project} from "../models.ts";

const { profile } = useProfile();
const { t } = useI18n();

const isCollapsed = ref(false);
const selectedProjectId = ref<string | null>(null);

const selectProject = (id: string) => {
  selectedProjectId.value = id;
};


var createProject = (id: string): Project => ({
  Id: crypto.randomUUID(),
  Name: id,
  Description: null, 
  TaskLists: [],

  CreatedAt: new Date().toISOString(),
  UpdatedAt: new Date().toISOString(),
});
profile.Projects.push(
    createProject("A")
);
profile.Projects.push(
    createProject("B")
);
</script>

<template>
  <aside
      class="flex flex-col h-full transition-all duration-300 border-r
      border-white/40 bg-white/60 
      dark:border-black/40 dark:bg-black/60
       backdrop-blur-xl shadow-sm"
      :class="[isCollapsed ? 'w-16' : 'w-64']"
  >

    <div class="grid grid-cols-1 auto-cols-max items-center p-4 border-b border-white/40 dark:border-black/40">
      <div class="flex items-center justify-center">
        <h1
            v-if="!isCollapsed"
            class="text-xl font-bold text-slate-800 truncate dark:text-white text-center"
        >
          {{ t('program.title') }}
        </h1>
      </div>

      <button
          @click="isCollapsed = !isCollapsed"
          class="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/15 transition-colors text-slate-600"
      >
        <i :class="['fa-solid', isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left']" class="text-black dark:text-white"></i>
      </button>
    </div>

    <div class="flex-1 overflow-y-auto p-3 space-y-2">
      <div
          v-for="project in profile.Projects"
          :key="project.Id"
          @click="selectProject(project.Id)"
          class="cursor-pointer rounded-xl transition-all duration-200 group relative"
          :class="[
          selectedProjectId === project.Id 
            ? 'bg-blue-500/20 border border-blue-500/50 text-blue-700' 
            : 'hover:bg-white/50 dark:hover:bg-black/20 border dark:border-white/50'
        ]"
      >
        <div v-if="!isCollapsed" class="px-4 py-3">
          <div class="font-medium truncate text-black dark:text-white">{{ project.Name }}</div>
          <div class="text-xs text-slate-300 dark:text-white truncate mt-0.5">{{ project.Description }}</div>
        </div>
        
        <div v-else class="flex justify-center py-3">
          <div class="w-2 h-2 rounded-full bg-slate-400" :class="{ 'bg-blue-500': selectedProjectId === project.Id }"></div>
        </div>
      </div>
    </div>

    <div class="p-3 border-t border-white/40">
      <button class="w-full flex items-center justify-center p-3 rounded-xl hover:bg-white/50 dark:hover:bg-black/50 transition-colors text-slate-700 dark:text-white">
        <i class="fa-solid fa-gear text-black dark:text-white"></i>
        <span v-if="!isCollapsed" class="ml-2 text-black dark:text-white">{{ t('sidebar.settings') }}</span>
      </button>
    </div>
    
  </aside>
</template>

<style scoped>

</style>