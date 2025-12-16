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

const openEditList = () => {
  if(!list.value) return;
  editListTitle.value = list.value.Title;
  isEditListOpen.value = true;
};

const saveList = () => {
  if(list.value) list.value.Title = editListTitle.value;
  isEditListOpen.value = false;
};

const deleteList = () => {
  Modal.confirm({
    title: t('list.delete_confirm'),
    okType: 'danger',
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
const activeGroupId = ref<string | null>(null); // null = ungrouped

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
    // Find task in ungrouped or groups
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
};

const softDeleteTask = (task: TaskItem) => {
  task.IsDeleted = true;
  task.UpdatedAt = new Date().toISOString();
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
    const g = list.value.TaskGroups.find(g => g.Id === editingGroupId.value);
    if (g) g.Title = groupTitle.value;
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
    title: "Delete Group?",
    content: "Tasks inside will be deleted (soft).",
    okType: 'danger',
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
            <BreadcrumbItem><a @click="router.push(`/project/${project.Id}`)"><i class="fa-solid fa-arrow-left mr-1"></i> {{ project.Name }}</a></BreadcrumbItem>
            <BreadcrumbItem>{{ list.Title }}</BreadcrumbItem>
          </Breadcrumb>
        </div>
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2 text-sm text-gray-500">
            <span>Show Deleted</span>
            <Switch v-model:checked="showDeleted" size="small" />
          </div>
          <Button @click="openEditList">{{ t('common.edit') }}</Button>
          <Button danger @click="deleteList">{{ t('common.delete') }}</Button>
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6 space-y-8 max-w-5xl mx-auto w-full">

        <!-- Ungrouped Tasks Section -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold text-gray-700 dark:text-gray-200">Tasks</h2>
            <Button type="dashed" size="small" @click="openAddTask(null)">+ Add Task</Button>
          </div>

          <div class="grid grid-cols-1 gap-3">
            <TaskCard
                v-for="task in list.UngroupedTasks.filter(t => showDeleted || !t.IsDeleted)"
                :key="task.Id"
                :task="task"
                @toggle="toggleTask(task)"
                @edit="openEditTask(task)"
                @delete="softDeleteTask(task)"
            />
            <div v-if="list.UngroupedTasks.filter(t => showDeleted || !t.IsDeleted).length === 0" class="text-center py-8 text-gray-400 text-sm italic border-2 border-dashed border-gray-100 dark:border-slate-800 rounded-lg">
              No tasks here
            </div>
          </div>
        </div>

        <!-- Groups Sections -->
        <div v-for="group in list.TaskGroups" :key="group.Id" class="bg-gray-100 dark:bg-slate-900/50 p-4 rounded-xl border border-gray-200 dark:border-slate-800">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-layer-group text-blue-500"></i>
              <h3 class="font-bold text-gray-800 dark:text-gray-100">{{ group.Title }}</h3>
              <button @click="openEditGroup(group.Id, group.Title)" class="text-gray-400 hover:text-blue-500 ml-2"><i class="fa-solid fa-pen text-xs"></i></button>
            </div>
            <div class="flex gap-2">
              <button @click="openAddTask(group.Id)" class="text-xs bg-white dark:bg-slate-800 px-2 py-1 rounded border hover:border-blue-500 transition-colors">+ Task</button>
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
                @delete="softDeleteTask(task)"
            />
            <div v-if="group.Tasks.filter(t => showDeleted || !t.IsDeleted).length === 0" class="text-center py-4 text-gray-400 text-xs">
              Empty Group
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

    <Modal v-model:open="isEditListOpen" :title="t('common.edit')" @ok="saveList">
      <Input v-model:value="editListTitle" />
    </Modal>

    <Modal v-model:open="isGroupModalOpen" :title="editingGroupId ? 'Edit Group' : t('group.add')" @ok="saveGroup">
      <Input v-model:value="groupTitle" :placeholder="t('group.title')" @pressEnter="saveGroup" />
    </Modal>

  </AppLayout>
</template>
