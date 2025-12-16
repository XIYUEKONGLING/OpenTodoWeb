<script setup lang="ts">
import { computed } from 'vue';
import type { TaskItem } from '../models';
import dayjs from 'dayjs';

const props = defineProps<{
  task: TaskItem;
}>();

const emit = defineEmits(['toggle', 'edit', 'delete']);

const isOverdue = computed(() => {
  if (props.task.IsCompleted || !props.task.DueDate) return false;
  const due = dayjs(props.task.DueDate + (props.task.DueTime ? `T${props.task.DueTime}` : ''));
  return due.isBefore(dayjs());
});

const progressColor = computed(() => {
  if (props.task.Progress >= 100) return 'bg-green-500';
  if (props.task.Progress > 50) return 'bg-blue-500';
  return 'bg-orange-400';
});
</script>

<template>
  <div
      class="group relative bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200"
      :class="{'opacity-60': task.IsCompleted}"
  >
    <div class="flex items-start gap-3">
      <!-- Checkbox -->
      <button
          @click.stop="emit('toggle')"
          class="mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0"
          :class="task.IsCompleted 
          ? 'bg-green-500 border-green-500 text-white' 
          : 'border-gray-300 dark:border-slate-600 hover:border-blue-500'"
      >
        <i v-if="task.IsCompleted" class="fa-solid fa-check text-xs"></i>
      </button>

      <!-- Content -->
      <div class="flex-1 min-w-0" @click="emit('edit')">
        <div class="flex justify-between items-start">
          <h4
              class="text-sm font-semibold text-gray-800 dark:text-gray-200 break-words leading-tight"
              :class="{'line-through text-gray-400 dark:text-gray-500': task.IsCompleted}"
          >
            {{ task.Title }}
          </h4>
        </div>

        <!-- Description Snippet -->
        <p v-if="task.Description" class="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
          {{ task.Description }}
        </p>

        <!-- Metadata Row -->
        <div class="flex flex-wrap items-center gap-2 mt-3">
          <!-- Date Badge -->
          <div
              v-if="task.DueDate"
              class="flex items-center px-2 py-0.5 rounded text-[10px] font-medium border"
              :class="isOverdue 
              ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800' 
              : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-slate-600'"
          >
            <i class="fa-regular fa-clock mr-1"></i>
            {{ task.DueDate }} {{ task.DueTime ? task.DueTime.substring(0,5) : '' }}
          </div>

          <!-- Progress Badge -->
          <div v-if="!task.IsCompleted && task.Progress > 0" class="flex items-center gap-1.5 min-w-[60px]">
            <div class="h-1.5 flex-1 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div class="h-full rounded-full" :class="progressColor" :style="{width: `${task.Progress}%`}"></div>
            </div>
            <span class="text-[10px] text-gray-400">{{ task.Progress }}%</span>
          </div>
        </div>
      </div>

      <!-- Actions (Hover) -->
      <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded">
        <button @click.stop="emit('edit')" class="p-1.5 text-gray-400 hover:text-blue-500">
          <i class="fa-solid fa-pen text-xs"></i>
        </button>
        <button @click.stop="emit('delete')" class="p-1.5 text-gray-400 hover:text-red-500">
          <i class="fa-solid fa-trash text-xs"></i>
        </button>
      </div>
    </div>
  </div>
</template>
