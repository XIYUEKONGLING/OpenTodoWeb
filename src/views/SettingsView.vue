<script setup lang="ts">
import { ref } from 'vue';
import AppLayout from "../components/AppLayout.vue";
import { useI18n } from "../composables/useI18n";
import { useProfile } from "../composables/useProfile";
import { useTheme } from "../composables/useTheme";
import { Modal, message, Upload, Button, Card, Select } from 'ant-design-vue';
import type { UploadProps, UploadFile } from 'ant-design-vue';

const { themeMode, setTheme } = useTheme();
const { t, locale, setLocale } = useI18n();
const { exportProfile, parseProfileFile, replaceProfile, resetProfile } = useProfile();

const fileList = ref<UploadFile[]>([]);

const handleExport = () => {
  exportProfile();
  message.success("Profile exported successfully");
};

const beforeUpload: UploadProps['beforeUpload'] = async (file) => {
  try {
    const newProfile = await parseProfileFile(file);

    Modal.confirm({
      title: t('import.notify.title'),
      content: t('import.notify.msg', { date: new Date(newProfile.UpdatedAt).toLocaleString() }),
      okText: t('common.confirm'),
      cancelText: t('common.cancel'),
      onOk() {
        replaceProfile(newProfile);
        message.success("Profile imported successfully");
        setTimeout(() => window.location.reload(), 500);
      }
    });
  } catch (e) {
    message.error("Failed to parse profile file");
    console.error(e);
  }
  return false; // Prevent auto upload
};

const handleReset = () => {
  Modal.confirm({
    title: t('settings.reset'),
    content: t('settings.reset_confirm'),
    okType: 'danger',
    okText: t('common.delete'),
    cancelText: t('common.cancel'),
    onOk() {
      resetProfile();
      window.location.href = "/";
    }
  });
};
</script>

<template>
  <AppLayout>
    <div class="flex-1 h-full overflow-y-auto p-8">
      <div class="max-w-3xl mx-auto space-y-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">{{ t('nav.settings') }}</h1>

        <!-- Language & Theme -->
        <Card :title="t('settings.language')" class="shadow-sm mb-6">
          <div class="flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <span>Language</span>
              <Select :value="locale" @change="setLocale" class="w-48">
                <Select.Option value="en-US">English (US)</Select.Option>
                <Select.Option value="zh-CN">简体中文</Select.Option>
              </Select>
            </div>
            <div class="flex items-center justify-between">
              <span>Theme</span>
              <Select :value="themeMode" @change="setTheme" class="w-48">
                <Select.Option value="auto">System (Auto)</Select.Option>
                <Select.Option value="light">Light</Select.Option>
                <Select.Option value="dark">Dark</Select.Option>
              </Select>
            </div>
          </div>
        </Card>

        <!-- Data Management -->
        <Card :title="t('settings.data_management')" class="shadow-sm">
          <div class="space-y-6">
            <!-- Export -->
            <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700">
              <div>
                <h3 class="font-medium text-gray-900 dark:text-gray-100">{{ t('settings.export') }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Download your data as a JSON file.</p>
              </div>
              <Button @click="handleExport">
                <template #icon><i class="fa-solid fa-download mr-2"></i></template>
                {{ t('common.save') }}
              </Button>
            </div>

            <!-- Import -->
            <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700">
              <div>
                <h3 class="font-medium text-gray-900 dark:text-gray-100">{{ t('settings.import') }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('settings.import_warn') }}</p>
              </div>
              <Upload
                  v-model:file-list="fileList"
                  :before-upload="beforeUpload"
                  :show-upload-list="false"
                  accept=".json"
              >
                <Button>
                  <template #icon><i class="fa-solid fa-upload mr-2"></i></template>
                  {{ t('common.edit') }}
                </Button>
              </Upload>
            </div>

            <div class="border-t border-gray-200 dark:border-slate-700 pt-6">
              <Button danger block @click="handleReset">
                {{ t('settings.reset') }}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </AppLayout>
</template>