<script setup lang="ts">
import { ref, watch } from 'vue';
import { Modal, Input, DatePicker, TimePicker, Slider, Row, Col, Switch } from 'ant-design-vue';
import type { TaskItem } from '../models';
import dayjs from 'dayjs';

const props = defineProps<{
  open: boolean;
  taskData: Partial<TaskItem>;
  isEdit: boolean;
}>();

const emit = defineEmits(['update:open', 'save']);

const formState = ref({
  Title: '',
  Description: '',
  DueDate: null as dayjs.Dayjs | null,
  DueTime: null as dayjs.Dayjs | null,
  StartDate: null as dayjs.Dayjs | null,
  StartTime: null as dayjs.Dayjs | null,
  Progress: 0,
  IsCompleted: false
});

watch(() => props.open, (val) => {
  if (val) {
    formState.value = {
      Title: props.taskData.Title || '',
      Description: props.taskData.Description || '',
      DueDate: props.taskData.DueDate ? dayjs(props.taskData.DueDate) : null,
      DueTime: props.taskData.DueTime ? dayjs(props.taskData.DueTime, 'HH:mm:ss') : null,
      StartDate: props.taskData.StartDate ? dayjs(props.taskData.StartDate) : null,
      StartTime: props.taskData.StartTime ? dayjs(props.taskData.StartTime, 'HH:mm:ss') : null,
      Progress: props.taskData.Progress || 0,
      IsCompleted: props.taskData.IsCompleted || false
    };
  }
});

const handleOk = () => {
  emit('save', {
    ...formState.value,
    DueDate: formState.value.DueDate?.format('YYYY-MM-DD') || null,
    DueTime: formState.value.DueTime?.format('HH:mm:ss') || null,
    StartDate: formState.value.StartDate?.format('YYYY-MM-DD') || null,
    StartTime: formState.value.StartTime?.format('HH:mm:ss') || null,
  });
  emit('update:open', false);
};
</script>

<template>
  <Modal
      :open="open"
      :title="isEdit ? 'Edit Task' : 'New Task'"
      @update:open="$emit('update:open', $event)"
      @ok="handleOk"
      width="600px"
  >
    <div class="space-y-5 py-2">
      <!-- Title -->
      <div>
        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Task Title</label>
        <Input v-model:value="formState.Title" placeholder="What needs to be done?" size="large" />
      </div>

      <!-- Dates Row -->
      <Row :gutter="16">
        <Col :span="12">
          <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Start</label>
          <div class="flex gap-2">
            <DatePicker v-model:value="formState.StartDate" class="w-full" placeholder="Date" />
            <TimePicker v-model:value="formState.StartTime" format="HH:mm" placeholder="Time" />
          </div>
        </Col>
        <Col :span="12">
          <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Due</label>
          <div class="flex gap-2">
            <DatePicker v-model:value="formState.DueDate" class="w-full" placeholder="Date" />
            <TimePicker v-model:value="formState.DueTime" format="HH:mm" placeholder="Time" />
          </div>
        </Col>
      </Row>

      <!-- Progress & Status -->
      <div class="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg border border-gray-100 dark:border-slate-800">
        <Row :gutter="16" align="middle">
          <Col :span="16">
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Progress ({{ formState.Progress }}%)</label>
            <Slider v-model:value="formState.Progress" :min="0" :max="100" />
          </Col>
          <Col :span="8" class="text-right">
            <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
            <div class="flex items-center justify-end gap-2">
              <span class="text-sm">Completed</span>
              <Switch v-model:checked="formState.IsCompleted" />
            </div>
          </Col>
        </Row>
      </div>

      <!-- Description -->
      <div>
        <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
        <Input.TextArea
            v-model:value="formState.Description"
            :rows="4"
            placeholder="Add details, context, or sub-notes..."
            class="resize-none"
        />
      </div>
    </div>
  </Modal>
</template>
