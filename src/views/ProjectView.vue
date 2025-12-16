<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppLayout from "../components/AppLayout.vue";
import Sidebar from "../components/Sidebar.vue";
import { useProfile } from "../composables/useProfile";
import { useI18n } from "../composables/useI18n";
import { v4 as uuidv4 } from 'uuid';
import { Modal, Input, DatePicker, message, Dropdown, Menu, MenuItem } from 'ant-design-vue';
import type { TaskItem, TaskList, TaskGroup } from '../models';
import dayjs from 'dayjs';

const route = useRoute();
const router = useRouter();
const { profile } = useProfile();
const { t } = useI18n();

// Current Project Logic
const project = computed(() =>
    profile.Projects.find(p => p.Id === route.params.id)
);

// Redirect if not found
watch(project, (newVal) => {
  if (!newVal && route.params.id) {
    router.push('/');
  }
}, { immediate: true });

// --- Modals State ---
const isListModalVisible = ref(false);
const listTitle = ref("");

const isTaskModalVisible = ref(false);
const currentListId = ref<string | null>(null);
const currentGroupId = ref<string | null>(null); // If adding to a group
const taskTitle = ref("");
const taskDesc = ref("");
const taskDueDate = ref<dayjs.Dayjs | null>(null);

const isGroupModalVisible = ref(false);
const groupTitle = ref("");
const targetListIdForGroup = ref<string | null>(null);

// --- Actions ---

// Delete Project
const deleteProject = () => {
  Modal.confirm({
    title: t('project.delete_confirm'),
    okType: 'danger',
    onOk() {
      const idx = profile.Projects.findIndex(p => p.Id === project.value?.Id);
      if (idx !== -1) {
        profile.Projects.splice(idx, 1);
        router.push('/');
        message.success("Project deleted");
      }
    }
  });
};

// Add List
const showAddList = () => {
  listTitle.value = "";
  isListModalVisible.value = true;
};

const addList = () => {
  if (!project.value || !listTitle.value.trim()) return;
  project.value.TaskLists.push({
    Id: uuidv4(),
    Title: listTitle.value,
    Description: null,
    UngroupedTasks: [],
    TaskGroups: [],
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  });
  isListModalVisible.value = false;
};

const deleteList = (listId: string) => {
  Modal.confirm({
    title: t('list.delete_confirm'),
    okType: 'danger',
    onOk() {
      if (!project.value) return;
      const idx = project.value.TaskLists.findIndex(l => l.Id === listId);
      if (idx !== -1) project.value.TaskLists.splice(idx, 1);
    }
  });
};

// Add Task
const showAddTask = (listId: string, groupId: string | null = null) => {
  currentListId.value = listId;
  currentGroupId.value = groupId;
  taskTitle.value = "";
  taskDesc.value = "";
  taskDueDate.value = null;
  isTaskModalVisible.value = true;
};

const addTask = () => {
  if (!project.value || !currentListId.value || !taskTitle.value.trim()) return;

  const list = project.value.TaskLists.find(l => l.Id === currentListId.value);
  if (!list) return;

  const newTask: TaskItem = {
    Id: uuidv4(),
    Title: taskTitle.value,
    Description: taskDesc.value || null,
    Progress: 0,
    StartDate: null,
    DueDate: taskDueDate.value ? taskDueDate.value.format('YYYY-MM-DD') : null,
    StartTime: null,
    DueTime: null,
    IsDeleted: false,
    IsCompleted: false,
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString(),
    CompletedAt: null
  };

  if (currentGroupId.value) {
    const group = list.TaskGroups.find(g => g.Id === currentGroupId.value);
    if (group) group.Tasks.push(newTask);
  } else {
    list.UngroupedTasks.push(newTask);
  }

  isTaskModalVisible.value = false;
};

const toggleTaskComplete = (task: TaskItem) => {
  task.IsCompleted = !task.IsCompleted;
  task.CompletedAt = task.IsCompleted ? new Date().toISOString() : null;
  task.UpdatedAt = new Date().toISOString();
};

const deleteTask = (listId: string, taskId: string, groupId: string | null = null) => {
  if (!project.value) return;
  const list = project.value.TaskLists.find(l => l.Id === listId);
  if (!list) return;

  if (groupId) {
    const group = list.TaskGroups.find(g => g.Id === groupId);
    if (group) {
      const idx = group.Tasks.findIndex(t => t.Id === taskId);
      if (idx !== -1) group.Tasks.splice(idx, 1);
    }
  } else {
    const idx = list.UngroupedTasks.findIndex(t => t.Id === taskId);
    if (idx !== -1) list.UngroupedTasks.splice(idx, 1);
  }
};

// Add Group
const showAddGroup = (listId: string) => {
  targetListIdForGroup.value = listId;
  groupTitle.value = "";
  isGroupModalVisible.value = true;
};

const addGroup = () => {
  if (!project.value || !targetListIdForGroup.value || !groupTitle.value.trim()) return;
  const list = project.value.TaskLists.find(l => l.Id === targetListIdForGroup.value);
  if (list) {
    list.TaskGroups.push({
      Id: uuidv4(),
      Title: groupTitle.value,
      Description: null,
      Tasks: [],
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString()
    });
  }
  isGroupModalVisible.value = false;
};

const deleteGroup = (listId: string, groupId: string) => {
  if (!project.value) return;
  const list = project.value.TaskLists.find(l => l.Id === listId);
  if (!list) return;
  const idx = list.TaskGroups.findIndex(g => g.Id === groupId);
  if (idx !== -1) list.TaskGroups.splice(idx, 1);
};

</script>

<template>
  <AppLayout>
    <Sidebar />
    <div class="flex-1 flex flex-col h-full overflow-hidden bg-gray-50" v-if="project">

      <!-- Header -->
      <div class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
        <div>
          <h1 class="text-xl font-bold text-gray-900">{{ project.Name }}</h1>
          <p class="text-xs text-gray-500 truncate max-w-md">{{ project.Description }}</p>
        </div>
        <div class="flex items-center space-x-3">
          <button @click="deleteProject" class="text-red-500 hover:bg-red-50 p-2 rounded-md transition-colors">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>

      <!-- Board Area -->
      <div class="flex-1 overflow-x-auto overflow-y-hidden p-6">
        <div class="flex h-full space-x-4 items-start">

          <!-- Columns (TaskLists) -->
          <div
              v-for="list in project.TaskLists"
              :key="list.Id"
              class="w-80 shrink-0 flex flex-col bg-gray-100 rounded-lg max-h-full border border-gray-200"
          >
            <!-- List Header -->
            <div class="p-3 flex items-center justify-between border-b border-gray-200/50">
              <h3 class="font-semibold text-gray-700">{{ list.Title }}</h3>
              <Dropdown>
                <button class="text-gray-400 hover:text-gray-600 p-1">
                  <i class="fa-solid fa-ellipsis"></i>
                </button>
                <template #overlay>
                  <Menu>
                    <MenuItem @click="showAddGroup(list.Id)">{{ t('group.add') }}</MenuItem>
                    <MenuItem danger @click="deleteList(list.Id)">{{ t('common.delete') }}</MenuItem>
                  </Menu>
                </template>
              </Dropdown>
            </div>

            <!-- Tasks Container -->
            <div class="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">

              <!-- Ungrouped Tasks -->
              <div
                  v-for="task in list.UngroupedTasks"
                  :key="task.Id"
                  class="bg-white p-3 rounded shadow-sm border border-gray-200 hover:shadow-md transition-shadow group relative"
              >
                <div class="flex items-start gap-3">
                  <button
                      @click="toggleTaskComplete(task)"
                      class="mt-1 w-4 h-4 rounded border flex items-center justify-center transition-colors"
                      :class="task.IsCompleted ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-blue-400'"
                  >
                    <i v-if="task.IsCompleted" class="fa-solid fa-check text-[10px]"></i>
                  </button>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium text-gray-800 break-words" :class="{'line-through text-gray-400': task.IsCompleted}">
                      {{ task.Title }}
                    </div>
                    <div v-if="task.DueDate" class="text-[10px] mt-1 flex items-center" :class="task.IsCompleted ? 'text-gray-300' : 'text-orange-500'">
                      <i class="fa-regular fa-clock mr-1"></i> {{ task.DueDate }}
                    </div>
                  </div>
                  <button @click="deleteTask(list.Id, task.Id)" class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>

              <!-- Groups -->
              <div v-for="group in list.TaskGroups" :key="group.Id" class="mt-4">
                <div class="flex items-center justify-between mb-2 px-1">
                  <span class="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <i class="fa-solid fa-layer-group"></i> {{ group.Title }}
                  </span>
                  <button @click="deleteGroup(list.Id, group.Id)" class="text-gray-300 hover:text-red-400 text-xs">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>

                <div class="space-y-2 pl-2 border-l-2 border-gray-200">
                  <div
                      v-for="task in group.Tasks"
                      :key="task.Id"
                      class="bg-white p-3 rounded shadow-sm border border-gray-200 hover:shadow-md transition-shadow group relative"
                  >
                    <div class="flex items-start gap-3">
                      <button
                          @click="toggleTaskComplete(task)"
                          class="mt-1 w-4 h-4 rounded border flex items-center justify-center transition-colors"
                          :class="task.IsCompleted ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-blue-400'"
                      >
                        <i v-if="task.IsCompleted" class="fa-solid fa-check text-[10px]"></i>
                      </button>
                      <div class="flex-1 min-w-0">
                        <div class="text-sm font-medium text-gray-800 break-words" :class="{'line-through text-gray-400': task.IsCompleted}">
                          {{ task.Title }}
                        </div>
                        <div v-if="task.DueDate" class="text-[10px] mt-1 flex items-center" :class="task.IsCompleted ? 'text-gray-300' : 'text-orange-500'">
                          <i class="fa-regular fa-clock mr-1"></i> {{ task.DueDate }}
                        </div>
                      </div>
                      <button @click="deleteTask(list.Id, task.Id, group.Id)" class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity">
                        <i class="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  </div>

                  <button
                      @click="showAddTask(list.Id, group.Id)"
                      class="w-full py-1 text-xs text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded dashed border border-transparent hover:border-blue-200 transition-all"
                  >
                    + {{ t('task.add') }}
                  </button>
                </div>
              </div>

            </div>

            <!-- Footer Add Task -->
            <div class="p-2 border-t border-gray-200">
              <button
                  @click="showAddTask(list.Id)"
                  class="w-full flex items-center justify-center py-2 text-sm text-gray-500 hover:bg-gray-200 rounded transition-colors"
              >
                <i class="fa-solid fa-plus mr-2"></i> {{ t('task.add') }}
              </button>
            </div>
          </div>

          <!-- Add List Button -->
          <button
              @click="showAddList"
              class="w-80 shrink-0 h-12 flex items-center justify-center bg-gray-200/50 hover:bg-gray-200 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 text-gray-500 font-medium transition-all"
          >
            <i class="fa-solid fa-plus mr-2"></i> {{ t('list.add') }}
          </button>

        </div>
      </div>
    </div>

    <!-- Modals -->
    <Modal v-model:open="isListModalVisible" :title="t('list.add')" @ok="addList" :okText="t('common.confirm')" :cancelText="t('common.cancel')">
      <Input v-model:value="listTitle" :placeholder="t('list.title')" @pressEnter="addList" />
    </Modal>

    <Modal v-model:open="isGroupModalVisible" :title="t('group.add')" @ok="addGroup" :okText="t('common.confirm')" :cancelText="t('common.cancel')">
      <Input v-model:value="groupTitle" :placeholder="t('group.title')" @pressEnter="addGroup" />
    </Modal>

    <Modal v-model:open="isTaskModalVisible" :title="t('task.add')" @ok="addTask" :okText="t('common.confirm')" :cancelText="t('common.cancel')">
      <div class="space-y-4 py-2">
        <Input v-model:value="taskTitle" :placeholder="t('task.title')" />
        <Input.TextArea v-model:value="taskDesc" :placeholder="t('task.desc')" :rows="2" />
        <div class="flex flex-col">
          <span class="text-xs text-gray-500 mb-1">{{ t('task.due_date') }}</span>
          <DatePicker v-model:value="taskDueDate" class="w-full" />
        </div>
      </div>
    </Modal>

  </AppLayout>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}
</style>
