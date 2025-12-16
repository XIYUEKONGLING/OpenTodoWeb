<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppLayout from "../components/AppLayout.vue";
import { useProfile } from "../composables/useProfile";
import { useI18n } from "../composables/useI18n";
import { v4 as uuidv4 } from 'uuid';
import { Modal, Input, Dropdown, Menu, MenuItem, Empty, Button } from 'ant-design-vue';

const route = useRoute();
const router = useRouter();
const { profile } = useProfile();
const { t } = useI18n();

const project = computed(() => profile.Projects.find(p => p.Id === route.params.pid));
const isEditProjectOpen = ref(false);
const editProjectName = ref("");
const editProjectDesc = ref("");
const isAddListOpen = ref(false);
const newListTitle = ref("");

const openEditProject = () => {
  if(!project.value) return;
  editProjectName.value = project.value.Name;
  editProjectDesc.value = project.value.Description || "";
  isEditProjectOpen.value = true;
};

const saveProject = () => {
  if(!project.value) return;
  project.value.Name = editProjectName.value;
  project.value.Description = editProjectDesc.value;
  isEditProjectOpen.value = false;
};

const deleteProject = () => {
  Modal.confirm({
    title: t('project.delete_confirm'),
    okType: 'danger',
    onOk: () => {
      const idx = profile.Projects.findIndex(p => p.Id === project.value?.Id);
      if (idx !== -1) {
        profile.Projects.splice(idx, 1);
        router.push('/');
      }
    }
  });
};

const addList = () => {
  if (!project.value || !newListTitle.value.trim()) return;
  const newList = {
    Id: uuidv4(),
    Title: newListTitle.value,
    Description: null,
    UngroupedTasks: [],
    TaskGroups: [],
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  };
  project.value.TaskLists.push(newList);
  isAddListOpen.value = false;
  newListTitle.value = "";
};

const goToList = (lid: string) => {
  router.push(`/project/${project.value?.Id}/list/${lid}`);
};
</script>

<template>
  <AppLayout>
    <!-- Removed bg-gray-50 dark:bg-slate-950 because AppLayout handles it now -->
    <div v-if="project" class="flex-1 flex flex-col h-full p-6 overflow-y-auto">

      <!-- Header -->
      <div class="flex items-start justify-between mb-8">
        <div>
          <div class="flex items-center gap-3">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ project.Name }}</h1>
            <button @click="openEditProject" class="text-gray-400 hover:text-blue-500"><i class="fa-solid fa-pen"></i></button>
          </div>
          <p class="text-gray-500 dark:text-gray-400 mt-1 max-w-2xl">{{ project.Description }}</p>
        </div>
        <Dropdown>
          <Button>
            <i class="fa-solid fa-ellipsis"></i>
          </Button>
          <template #overlay>
            <Menu>
              <MenuItem @click="deleteProject" danger>{{ t('common.delete') }}</MenuItem>
            </Menu>
          </template>
        </Dropdown>
      </div>

      <!-- Lists Grid -->
      <div v-if="project.TaskLists.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
            v-for="list in project.TaskLists"
            :key="list.Id"
            @click="goToList(list.Id)"
            class="bg-white dark:bg-slate-900 p-6 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer group"
        >
          <div class="flex justify-between items-start mb-4">
            <div class="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
              <i class="fa-solid fa-list-check text-xl"></i>
            </div>
            <i class="fa-solid fa-arrow-right text-gray-300 group-hover:text-blue-500 transition-colors"></i>
          </div>
          <h3 class="font-bold text-lg text-gray-800 dark:text-gray-100 mb-1">{{ list.Title }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ list.UngroupedTasks.filter(t => !t.IsDeleted).length + list.TaskGroups.reduce((acc, g) => acc + g.Tasks.filter(t => !t.IsDeleted).length, 0) }} Tasks
          </p>
        </div>

        <!-- Add List Card -->
        <button
            @click="isAddListOpen = true"
            class="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-700 text-gray-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all min-h-[160px]"
        >
          <i class="fa-solid fa-plus text-2xl mb-2"></i>
          <span class="font-medium">{{ t('list.add') }}</span>
        </button>
      </div>

      <div v-else class="flex-1 flex flex-col items-center justify-center text-gray-400">
        <Empty :description="false" />
        <p class="mt-4 mb-6">No lists yet.</p>
        <Button type="primary" size="large" @click="isAddListOpen = true">{{ t('list.add') }}</Button>
      </div>
    </div>

    <!-- Fallback if project not found (e.g. deleted) -->
    <div v-else class="flex-1 flex items-center justify-center text-gray-500">
      Project not found.
    </div>

    <!-- Modals -->
    <Modal v-model:open="isEditProjectOpen" :title="t('common.edit')" @ok="saveProject">
      <div class="space-y-4 pt-2">
        <Input v-model:value="editProjectName" />
        <Input.TextArea v-model:value="editProjectDesc" />
      </div>
    </Modal>

    <Modal v-model:open="isAddListOpen" :title="t('list.add')" @ok="addList">
      <Input v-model:value="newListTitle" :placeholder="t('list.title')" @pressEnter="addList" />
    </Modal>
  </AppLayout>
</template>