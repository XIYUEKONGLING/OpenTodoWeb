<script setup lang="ts">
import { ref } from 'vue';
import {useProfile} from "../composables/useProfile.ts";
import {useI18n} from "../composables/useI18n.ts";
import type {Project} from "../models.ts";
import router from "../router";

const { profile } = useProfile();
const { t } = useI18n();

// State: UI
const isCollapsed = ref(false);
const selectedProjectId = ref<string | null>(null);

// Actions
const selectProject = (id: string) => {
  selectedProjectId.value = id;
};


// Debug Code
var createProject = (id: string): Project => ({
  Id: crypto.randomUUID(),
  Name: id,
  Description: null, 
  TaskLists: [],

  CreatedAt: new Date().toISOString(),
  UpdatedAt: new Date().toISOString(),
});
profile.Projects.push(
    createProject("Example A")
);
profile.Projects.push(
    createProject("Example B")
);

var tempCounter = 0;
function createProjectClicked(){
  console.log("[DEBUG] Create Project");
  tempCounter++;
  profile.Projects.push(
      createProject("Example " + tempCounter.toString())
  );
}

function settingsClicked(){
  router.push(`/settings`);
}
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

    <div class="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
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
        <div v-if="!isCollapsed" class="flex px-4 py-3 items-center">
          <i class="fa-solid fa-tasks text-black dark:text-white"></i>
          <div class="font-medium truncate text-black dark:text-white px-3">{{ project.Name }}</div>
        </div>
        
        <div v-else class="flex justify-center py-3">
          <div class="w-2 h-2 rounded-full bg-slate-400" :class="{ 'bg-blue-500': selectedProjectId === project.Id }"></div>
        </div>
      </div>

      <button
        @click="createProjectClicked"
        class="w-full flex items-center rounded-xl border border-dashed border-slate-400/70 dark:border-slate-300/50
                 hover:bg-white/50 dark:hover:bg-white/10 hover:border-slate-500 dark:hover:border-slate-400
                 transition-all duration-200 text-slate-600 dark:text-slate-300 group"
      >
        <span v-if="!isCollapsed" class="flex items-center px-4 py-3 gap-3 w-full">
            <i class="fa-solid fa-plus transition-transform group-hover:scale-110 text-black dark:text-white"></i>
            <span class="font-medium truncate text-black dark:text-white">{{ t("sidebar.create_project") }}</span>
        </span>
  
        <span v-else class="flex justify-center w-full py-3">
            <i class="fa-solid fa-plus transition-transform group-hover:scale-110 text-black dark:text-white"></i>
        </span>
      </button>
    </div>

    <div class="p-3 border-t border-white/40">
      <button @click="settingsClicked" class="w-full flex items-center justify-center p-3 rounded-xl hover:bg-white/50 dark:hover:bg-black/50 transition-colors text-slate-700 dark:text-white">
        <i class="fa-solid fa-gear text-black dark:text-white"></i>
        <span v-if="!isCollapsed" class="ml-2 text-black dark:text-white">{{ t('sidebar.settings') }}</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}
</style>