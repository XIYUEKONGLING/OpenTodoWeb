<script setup lang="ts">
import { ref, watch } from 'vue';
import { Modal, Input, DatePicker, TimePicker, Slider, Row, Col, Switch } from 'ant-design-vue';
import type { TaskItem } from '../models';
import { useI18n } from '../composables/useI18n';
import dayjs from 'dayjs';

const { t } = useI18n();

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
    ...props.taskData, // Preserve Id and other fields
    Title: formState.value.Title,
    Description: formState.value.Description,
    Progress: formState.value.Progress,
    IsCompleted: formState.value.IsCompleted,
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
      :title="isEdit ? t('task.edit') : t('task.new')"
      @update:open="$emit('update:open', $event)"
      @ok="handleOk"
      :okText="t('common.save')"
      :cancelText="t('common.cancel')"
      width="600px"
  >
    <div class="space-y-5 py-2">
      <!-- Title -->
      <div>
        <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">{{ t('task.title') }}</label>
        <Input v-model:value="formState.Title" :placeholder="t('task.title_ph')" size="large" />
      </div>

      <!-- Dates Row -->
      <Row :gutter="16">
        <Col :span="12">
          <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">{{ t('task.start_date') }}</label>
          <div class="flex gap-2">
            <DatePicker v-model:value="formState.StartDate" class="w-full" :placeholder="t('task.start_date')" />
            <TimePicker v-model:value="formState.StartTime" format="HH:mm" placeholder="Time" />
          </div>
        </Col>
        <Col :span="12">
          <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">{{ t('task.due_date') }}</label>
          <div class="flex gap-2">
            <DatePicker v-model:value="formState.DueDate" class="w-full" :placeholder="t('task.due_date')" />
            <TimePicker v-model:value="formState.DueTime" format="HH:mm" placeholder="Time" />
          </div>
        </Col>
      </Row>

      <div class="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
        <Row :gutter="16" align="middle">
          <Col :span="16">
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">{{ t('task.progress') }} ({{ formState.Progress }}%)</label>
            <Slider v-model:value="formState.Progress" :min="0" :max="100" />
          </Col>
          <Col :span="8" class="text-right">
            <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">{{ t('task.status') }}</label>
            <div class="flex items-center justify-end gap-2">
              <span class="text-sm text-gray-700 dark:text-gray-300">{{ t('task.completed') }}</span>
              <Switch v-model:checked="formState.IsCompleted" />
            </div>
          </Col>
        </Row>
      </div>

      <!-- Description -->
      <div>
        <label class="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">{{ t('task.desc') }}</label>
        <Input.TextArea
            v-model:value="formState.Description"
            :rows="4"
            :placeholder="t('task.desc_ph')"
            class="resize-none"
        />
      </div>
    </div>
  </Modal>
</template>
