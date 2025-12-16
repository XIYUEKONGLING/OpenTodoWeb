<script setup lang="ts">
import { ref } from 'vue';
import { useProfile } from "../composables/useProfile";
import { useI18n } from "../composables/useI18n";
import { useRouter, useRoute } from "vue-router";
import { v4 as uuidv4 } from 'uuid';
import { Modal, Input, Tooltip } from 'ant-design-vue';

const props = defineProps<{
  collapsed: boolean;
  isMobile?: boolean;
}>();

const emit = defineEmits(['toggle', 'close']);

const { profile } = useProfile();
const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const isCreateModalVisible = ref(false);
const newProjectName = ref("");

const navigateTo = (path: string) => {
  router.push(path);
  if (props.isMobile) emit('close');
};

const handleCreateProject = () => {
  if (!newProjectName.value.trim()) return;
  const newId = uuidv4();
  profile.Projects.push({
    Id: newId,
    Name: newProjectName.value,
    Description: null,
    TaskLists: [],
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  });
  isCreateModalVisible.value = false;
  newProjectName.value = "";
  navigateTo(`/project/${newId}`);
};
</script>

<template>
  <div class="flex flex-col h-full bg-white dark:bg-slate-900">
    <!-- Header / Toggle -->
    <div class="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-slate-800" :class="isMobile ? 'hidden' : ''">
      <div v-if="!collapsed" class="flex items-center gap-2 font-bold text-lg truncate text-gray-900 dark:text-white">
        <i class="fa-solid fa-check-double text-blue-600 dark:text-blue-400"></i>
        <span>{{ t('app.title') }}</span>
      </div>
      <div v-else class="w-full flex justify-center">
        <i class="fa-solid fa-check-double text-blue-600 dark:text-blue-400 text-xl"></i>
      </div>
      <button v-if="!isMobile" @click="emit('toggle')" class="text-gray-400 dark:text-gray-500 hover:text-blue-500 transition-colors">
        <i class="fa-solid" :class="collapsed ? 'fa-chevron-right' : 'fa-chevron-left'"></i>
      </button>
    </div>

    <!-- Projects -->
    <div class="flex-1 overflow-y-auto py-4 space-y-1 custom-scrollbar">
      <div v-if="!collapsed" class="px-4 mb-2 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
        {{ t('nav.projects') }}
      </div>

      <div
          v-for="project in profile.Projects"
          :key="project.Id"
          @click="navigateTo(`/project/${project.Id}`)"
          class="group flex items-center px-4 py-3 cursor-pointer transition-all border-l-4"
          :class="route.path.startsWith(`/project/${project.Id}`) 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' 
          : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'"
      >
        <Tooltip :title="collapsed ? project.Name : ''" placement="right">
          <i class="fa-solid fa-folder text-lg shrink-0" :class="collapsed ? 'mx-auto' : 'mr-3'"></i>
        </Tooltip>
        <span v-if="!collapsed" class="truncate text-sm font-medium">{{ project.Name }}</span>
      </div>

      <div
          @click="isCreateModalVisible = true"
          class="flex items-center px-4 py-3 cursor-pointer text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
      >
        <Tooltip :title="collapsed ? t('nav.new_project') : ''" placement="right">
          <i class="fa-solid fa-plus text-lg shrink-0" :class="collapsed ? 'mx-auto' : 'mr-3'"></i>
        </Tooltip>
        <span v-if="!collapsed" class="truncate text-sm">{{ t('nav.new_project') }}</span>
      </div>
    </div>

    <div class="p-4 border-t border-gray-200 dark:border-slate-800">
      <div
          @click="navigateTo('/settings')"
          class="flex items-center justify-center p-2 rounded-lg cursor-pointer transition-colors"
          :class="route.path === '/settings' 
            ? 'bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white' 
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'"
      >
        <Tooltip :title="collapsed ? t('nav.settings') : ''" placement="right">
          <i class="fa-solid fa-gear text-lg shrink-0" :class="collapsed ? '' : 'mr-3'"></i>
        </Tooltip>
        <span v-if="!collapsed" class="font-medium text-sm">{{ t('nav.settings') }}</span>
      </div>
    </div>

    <Modal v-model:open="isCreateModalVisible" :title="t('nav.new_project')" @ok="handleCreateProject" :okText="t('common.confirm')" :cancelText="t('common.cancel')">
      <Input v-model:value="newProjectName" :placeholder="t('project.name')" />
    </Modal>
  </div>
</template>
