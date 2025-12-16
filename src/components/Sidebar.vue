<script setup lang="ts">
import { ref } from 'vue';
import { useProfile } from "../composables/useProfile";
import { useI18n } from "../composables/useI18n";
import { useRouter, useRoute } from "vue-router";
import { v4 as uuidv4 } from 'uuid';
import { Modal, Input, message } from 'ant-design-vue';

const { profile } = useProfile();
const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const isCreateModalVisible = ref(false);
const newProjectName = ref("");
const newProjectDesc = ref("");

const navigateTo = (path: string) => {
  router.push(path);
};

const showCreateModal = () => {
  newProjectName.value = "";
  newProjectDesc.value = "";
  isCreateModalVisible.value = true;
};

const handleCreateProject = () => {
  if (!newProjectName.value.trim()) {
    message.error("Project name is required");
    return;
  }

  const newProject = {
    Id: uuidv4(),
    Name: newProjectName.value,
    Description: newProjectDesc.value,
    TaskLists: [],
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  };

  profile.Projects.push(newProject);
  isCreateModalVisible.value = false;
  router.push(`/project/${newProject.Id}`);
  message.success("Project created");
};
</script>

<template>
  <div class="w-64 h-full bg-white border-r border-gray-200 flex flex-col shrink-0">
    <!-- Header -->
    <div class="h-16 flex items-center px-6 border-b border-gray-100">
      <i class="fa-solid fa-check-double text-blue-600 text-xl mr-3"></i>
      <span class="font-bold text-lg text-gray-800">{{ t('app.title') }}</span>
    </div>

    <!-- Projects List -->
    <div class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
      <div class="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {{ t('nav.projects') }}
      </div>

      <div
          v-for="project in profile.Projects"
          :key="project.Id"
          @click="navigateTo(`/project/${project.Id}`)"
          class="group flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors duration-150"
          :class="route.path === `/project/${project.Id}` ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'"
      >
        <i class="fa-solid fa-folder mr-3" :class="route.path === `/project/${project.Id}` ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'"></i>
        <span class="truncate">{{ project.Name }}</span>
      </div>

      <button
          @click="showCreateModal"
          class="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-500 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors mt-2"
      >
        <i class="fa-solid fa-plus mr-3 text-gray-400"></i>
        {{ t('nav.new_project') }}
      </button>
    </div>

    <!-- Footer -->
    <div class="p-4 border-t border-gray-200">
      <button
          @click="navigateTo('/settings')"
          class="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors"
          :class="route.path === '/settings' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
      >
        <i class="fa-solid fa-gear mr-3 text-gray-400"></i>
        {{ t('nav.settings') }}
      </button>
    </div>

    <!-- Create Project Modal -->
    <Modal
        v-model:open="isCreateModalVisible"
        :title="t('nav.new_project')"
        @ok="handleCreateProject"
        :okText="t('common.confirm')"
        :cancelText="t('common.cancel')"
    >
      <div class="space-y-4 py-2">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('project.name') }}</label>
          <Input v-model:value="newProjectName" :placeholder="t('project.name')" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('project.desc') }}</label>
          <Input.TextArea v-model:value="newProjectDesc" :rows="3" />
        </div>
      </div>
    </Modal>
  </div>
</template>
