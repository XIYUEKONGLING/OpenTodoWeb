<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppLayout from "../components/AppLayout.vue";
import TaskCard from "../components/TaskCard.vue";
import TaskEditModal from "../components/TaskEditModal.vue";
import { useProfile } from "../composables/useProfile";
import { useI18n } from "../composables/useI18n";
import { v4 as uuidv4 } from 'uuid';
import { Modal, Input, Button, Breadcrumb, BreadcrumbItem, Switch } from 'ant-design-vue';
import type { TaskItem } from '../models';

const route = useRoute();
const router = useRouter();
const { profile } = useProfile();
const { t } = useI18n();

const showDeleted = ref(false);

const project = computed(() => profile.Projects.find(p => p.Id === route.params.pid));
const list = computed(() => project.value?.TaskLists.find(l => l.Id === route.params.lid));

// --- Edit List ---
const isEditListOpen = ref(false);
const editListTitle = ref("");
const editListDesc = ref("");

const openEditList = () => {
  if(!list.value) return;
  editListTitle.value = list.value.Title;
  editListDesc.value = list.value.Description || "";
  isEditListOpen.value = true;
};

const saveList = () => {
  if(list.value) {
    list.value.Title = editListTitle.value;
    list.value.Description = editListDesc.value;
    list.value.UpdatedAt = new Date().toISOString();
  }
  isEditListOpen.value = false;
};

const deleteList = () => {
  Modal.confirm({
    title: t('list.delete_confirm'),
    okType: 'danger',
    okText: t('common.delete'),
    cancelText: t('common.cancel'),
    onOk: () => {
      if(!project.value) return;
      const idx = project.value.TaskLists.findIndex(l => l.Id === list.value?.Id);
      if(idx !== -1) {
        project.value.TaskLists.splice(idx, 1);
        router.push(`/project/${project.value.Id}`);
      }
    }
  });
};

// --- Task Management ---
const isTaskModalOpen = ref(false);
const currentTaskData = ref<Partial<TaskItem>>({});
const isEditingTask = ref(false);
const activeGroupId = ref<string | null>(null);

const openAddTask = (groupId: string | null = null) => {
  activeGroupId.value = groupId;
  currentTaskData.value = {};
  isEditingTask.value = false;
  isTaskModalOpen.value = true;
};

const openEditTask = (task: TaskItem) => {
  currentTaskData.value = { ...task };
  isEditingTask.value = true;
  isTaskModalOpen.value = true;
};

const handleSaveTask = (data: any) => {
  if (!list.value) return;

  if (isEditingTask.value) {
    // Update existing
    let target = list.value.UngroupedTasks.find(t => t.Id === data.Id);
    if (!target) {
      for (const g of list.value.TaskGroups) {
        target = g.Tasks.find(t => t.Id === data.Id);
        if (target) break;
      }
    }
    if (target) Object.assign(target, data, { UpdatedAt: new Date().toISOString() });
  } else {
    // Create new
    const newTask: TaskItem = {
      ...data,
      Id: uuidv4(),
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString(),
      IsDeleted: false
    };

    if (activeGroupId.value) {
      const g = list.value.TaskGroups.find(g => g.Id === activeGroupId.value);
      if (g) g.Tasks.push(newTask);
    } else {
      list.value.UngroupedTasks.push(newTask);
    }
  }
};

const toggleTask = (task: TaskItem) => {
  task.IsCompleted = !task.IsCompleted;
  task.CompletedAt = task.IsCompleted ? new Date().toISOString() : null;
  task.UpdatedAt = new Date().toISOString();
};

const handleDeleteTask = (task: TaskItem) => {
  if (task.IsDeleted) {
    Modal.confirm({
      title: t('task.delete_perm_confirm'),
      okType: 'danger',
      okText: t('common.delete_perm'),
      cancelText: t('common.cancel'),
      onOk: () => {
        if (!list.value) return;
        let idx = list.value.UngroupedTasks.findIndex(t => t.Id === task.Id);
        if (idx !== -1) {
          list.value.UngroupedTasks.splice(idx, 1);
          return;
        }
        for (const g of list.value.TaskGroups) {
          idx = g.Tasks.findIndex(t => t.Id === task.Id);
          if (idx !== -1) {
            g.Tasks.splice(idx, 1);
            return;
          }
        }
      }
    });
  } else {
    task.IsDeleted = true;
    task.UpdatedAt = new Date().toISOString();
  }
};

// --- Group Management ---
const isGroupModalOpen = ref(false);
const groupTitle = ref("");
const editingGroupId = ref<string | null>(null);

const openAddGroup = () => {
  editingGroupId.value = null;
  groupTitle.value = "";
  isGroupModalOpen.value = true;
};

const openEditGroup = (gid: string, title: string) => {
  editingGroupId.value = gid;
  groupTitle.value = title;
  isGroupModalOpen.value = true;
};

const saveGroup = () => {
  if (!list.value || !groupTitle.value.trim()) return;

  if (editingGroupId.value) {
    const g = list.value.TaskGroups.find(group => group.Id === editingGroupId.value);
    if (g) {
      g.Title = groupTitle.value;
      g.UpdatedAt = new Date().toISOString();
    }
  } else {
    list.value.TaskGroups.push({
      Id: uuidv4(),
      Title: groupTitle.value,
      Description: null,
      Tasks: [],
      CreatedAt: new Date().toISOString(),
      UpdatedAt: new Date().toISOString()
    });
  }
  isGroupModalOpen.value = false;
};

const deleteGroup = (gid: string) => {
  Modal.confirm({
    title: t('group.delete_confirm'),
    content: t('group.delete_msg'),
    okType: 'danger',
    okText: t('common.delete'),
    cancelText: t('common.cancel'),
    onOk: () => {
      if(!list.value) return;
      const idx = list.value.TaskGroups.findIndex(g => g.Id === gid);
      if(idx !== -1) list.value.TaskGroups.splice(idx, 1);
    }
  });
};
</script>

<template>
  <AppLayout>
    <div v-if="project && list" class="flex-1 flex flex-col h-full bg-gray-50 dark:bg-slate-950 overflow-hidden">

      <!-- Top Bar -->
      <div class="h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0">
        <div class="flex items-center gap-4">
          <Breadcrumb>
            <BreadcrumbItem>
              <a @click="router.push(`/project/${project.Id}`)" class="text-gray-600 dark:text-gray-400 hover:text-blue-500">
                <i class="fa-solid fa-arrow-left mr-1"></i> {{ project.Name }}
              </a>
            </BreadcrumbItem>
            <BreadcrumbItem class="text-gray-900 dark:text-gray-100">{{ list.Title }}</BreadcrumbItem>
          </Breadcrumb>
        </div>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>{{ t('list.show_deleted') }}</span>
            <Switch v-model:checked="showDeleted" size="small" />
          </div>
          <Button @click="openEditList">{{ t('common.edit') }}</Button>
          <Button danger @click="deleteList">{{ t('common.delete') }}</Button>
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6 space-y-8 max-w-5xl mx-auto w-full">

        <!-- Description -->
        <div v-if="list.Description" class="text-gray-600 dark:text-gray-400 text-sm bg-white dark:bg-slate-900 p-4 rounded-lg border border-gray-200 dark:border-slate-800 shadow-sm">
          {{ list.Description }}
        </div>

        <!-- Ungrouped Tasks Section -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold text-gray-800 dark:text-gray-200">Tasks</h2>
            <Button type="dashed" size="small" @click="openAddTask(null)">+ {{ t('task.add') }}</Button>
          </div>

          <div class="grid grid-cols-1 gap-3">
            <TaskCard
                v-for="task in list.UngroupedTasks.filter(t => showDeleted || !t.IsDeleted)"
                :key="task.Id"
                :task="task"
                @toggle="toggleTask(task)"
                @edit="openEditTask(task)"
                @delete="handleDeleteTask(task)"
            />
            <div v-if="list.UngroupedTasks.filter(t => showDeleted || !t.IsDeleted).length === 0" class="text-center py-8 text-gray-400 text-sm italic border-2 border-dashed border-gray-300 dark:border-slate-800 rounded-lg">
              {{ t('list.no_tasks') }}
            </div>
          </div>
        </div>

        <!-- Groups Sections -->
        <div v-for="group in list.TaskGroups" :key="group.Id" class="bg-gray-100/80 dark:bg-slate-900/50 p-4 rounded-xl border border-gray-200 dark:border-slate-800">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-layer-group text-blue-500"></i>
              <h3 class="font-bold text-gray-800 dark:text-gray-100">{{ group.Title }}</h3>
              <button @click="openEditGroup(group.Id, group.Title)" class="text-gray-400 hover:text-blue-500 ml-2"><i class="fa-solid fa-pen text-xs"></i></button>
            </div>
            <div class="flex gap-2">
              <button @click="openAddTask(group.Id)" class="text-xs bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded border border-gray-200 dark:border-slate-700 hover:border-blue-500 transition-colors">+ {{ t('task.add') }}</button>
              <button @click="deleteGroup(group.Id)" class="text-gray-400 hover:text-red-500 px-2"><i class="fa-solid fa-trash"></i></button>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-3">
            <TaskCard
                v-for="task in group.Tasks.filter(t => showDeleted || !t.IsDeleted)"
                :key="task.Id"
                :task="task"
                @toggle="toggleTask(task)"
                @edit="openEditTask(task)"
                @delete="handleDeleteTask(task)"
            />
            <div v-if="group.Tasks.filter(t => showDeleted || !t.IsDeleted).length === 0" class="text-center py-4 text-gray-400 text-xs">
              {{ t('list.empty_group') }}
            </div>
          </div>
        </div>

        <!-- Add Group Button -->
        <Button block type="dashed" class="h-12" @click="openAddGroup">
          <i class="fa-solid fa-folder-plus mr-2"></i> {{ t('group.add') }}
        </Button>

      </div>
    </div>

    <!-- Modals -->
    <TaskEditModal
        v-model:open="isTaskModalOpen"
        :taskData="currentTaskData"
        :isEdit="isEditingTask"
        @save="handleSaveTask"
    />

    <Modal v-model:open="isEditListOpen" :title="t('common.edit')" @ok="saveList" :okText="t('common.save')" :cancelText="t('common.cancel')">
      <div class="flex flex-col gap-4 pt-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('list.title') }}</label>
          <Input v-model:value="editListTitle" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('list.desc') }}</label>
          <Input.TextArea v-model:value="editListDesc" :rows="3" />
        </div>
      </div>
    </Modal>

    <Modal v-model:open="isGroupModalOpen" :title="editingGroupId ? t('group.edit') : t('group.add')" @ok="saveGroup" :okText="t('common.save')" :cancelText="t('common.cancel')">
      <div class="pt-4">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ t('group.title') }}</label>
        <Input v-model:value="groupTitle" :placeholder="t('group.title')" @pressEnter="saveGroup" />
      </div>
    </Modal>

  </AppLayout>
</template>
