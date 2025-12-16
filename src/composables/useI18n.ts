import { ref } from 'vue';

type Locale = "en-US" | "zh-CN";

const messages: Record<Locale, Record<string, string>> = {
    "en-US": {
        "app.title": "OpenTodo",
        "nav.projects": "Projects",
        "nav.settings": "Settings",
        "nav.new_project": "New Project",
        "common.confirm": "Confirm",
        "common.cancel": "Cancel",
        "common.save": "Save",
        "common.delete": "Delete",
        "common.delete_perm": "Delete Permanently",
        "common.edit": "Edit",
        "common.created": "Created",
        "common.actions": "Actions",
        "common.success": "Success",
        "common.error": "Error",
        "home.welcome": "Welcome to OpenTodo",
        "home.subtitle": "Select a project to start or create a new one.",
        "settings.language": "Language",
        "settings.theme": "Theme",
        "settings.theme_auto": "System (Auto)",
        "settings.theme_light": "Light",
        "settings.theme_dark": "Dark",
        "settings.data_management": "Data Management",
        "settings.export": "Export Profile",
        "settings.export_desc": "Download your data as a JSON file.",
        "settings.import": "Import Profile",
        "settings.import_desc": "Restore data from a JSON file.",
        "settings.import_warn": "This will overwrite your current data.",
        "settings.reset": "Reset All Data",
        "settings.reset_confirm": "Are you sure you want to delete all data? This cannot be undone.",
        "settings.import_success": "Profile imported successfully",
        "settings.export_success": "Profile exported successfully",
        "settings.parse_error": "Failed to parse profile file",
        "import.notify.title": "Profile Detected",
        "import.notify.msg": "Found profile updated at: {date}. Do you want to import?",
        "project.name": "Project Name",
        "project.desc": "Description",
        "project.delete_confirm": "Delete this project?",
        "list.add": "Add List",
        "list.title": "List Title",
        "list.desc": "List Description",
        "list.delete_confirm": "Delete this list and all its tasks?",
        "list.show_deleted": "Show Deleted",
        "list.no_tasks": "No tasks here",
        "list.empty_group": "Empty Group",
        "list.tasks_count": "{count} Tasks",
        "list.no_lists": "No lists yet.",
        "task.add": "Add Task",
        "task.edit": "Edit Task",
        "task.new": "New Task",
        "task.title": "Task Title",
        "task.title_ph": "What needs to be done?",
        "task.desc": "Description",
        "task.desc_ph": "Add details, context, or sub-notes...",
        "task.due_date": "Due Date",
        "task.start_date": "Start Date",
        "task.progress": "Progress",
        "task.status": "Status",
        "task.completed": "Completed",
        "task.delete_confirm": "Delete this task?",
        "task.delete_perm_confirm": "Permanently delete this task?",
        "group.add": "Add Group",
        "group.edit": "Edit Group",
        "group.title": "Group Title",
        "group.delete_confirm": "Delete Group?",
        "group.delete_msg": "Tasks inside will be deleted (soft).",
    },
    "zh-CN": {
        "app.title": "OpenTodo",
        "nav.projects": "项目列表",
        "nav.settings": "设置",
        "nav.new_project": "新建项目",
        "common.confirm": "确认",
        "common.cancel": "取消",
        "common.save": "保存",
        "common.delete": "删除",
        "common.delete_perm": "永久删除",
        "common.edit": "编辑",
        "common.created": "创建于",
        "common.actions": "操作",
        "common.success": "成功",
        "common.error": "错误",
        "home.welcome": "欢迎使用 OpenTodo",
        "home.subtitle": "请选择一个项目开始，或创建一个新项目。",
        "settings.language": "语言",
        "settings.theme": "主题",
        "settings.theme_auto": "跟随系统",
        "settings.theme_light": "明亮",
        "settings.theme_dark": "暗黑",
        "settings.data_management": "数据管理",
        "settings.export": "导出数据",
        "settings.export_desc": "将您的数据下载为 JSON 文件。",
        "settings.import": "导入数据",
        "settings.import_desc": "从 JSON 文件恢复数据。",
        "settings.import_warn": "这将覆盖您当前的所有数据。",
        "settings.reset": "重置所有数据",
        "settings.reset_confirm": "确定要删除所有数据吗？此操作无法撤销。",
        "settings.import_success": "数据导入成功",
        "settings.export_success": "数据导出成功",
        "settings.parse_error": "解析配置文件失败",
        "import.notify.title": "检测到配置文件",
        "import.notify.msg": "发现更新于 {date} 的配置。是否导入？",
        "project.name": "项目名称",
        "project.desc": "描述",
        "project.delete_confirm": "确定删除此项目？",
        "list.add": "添加列表",
        "list.title": "列表标题",
        "list.desc": "列表描述",
        "list.delete_confirm": "删除此列表及其所有任务？",
        "list.show_deleted": "显示已删除",
        "list.no_tasks": "暂无任务",
        "list.empty_group": "空分组",
        "list.tasks_count": "{count} 个任务",
        "list.no_lists": "暂无列表",
        "task.add": "添加任务",
        "task.edit": "编辑任务",
        "task.new": "新建任务",
        "task.title": "任务标题",
        "task.title_ph": "需要做什么？",
        "task.desc": "描述",
        "task.desc_ph": "添加详情、背景或备注...",
        "task.due_date": "截止日期",
        "task.start_date": "开始日期",
        "task.progress": "进度",
        "task.status": "状态",
        "task.completed": "已完成",
        "task.delete_confirm": "删除此任务？",
        "task.delete_perm_confirm": "永久删除此任务？",
        "group.add": "添加分组",
        "group.edit": "编辑分组",
        "group.title": "分组标题",
        "group.delete_confirm": "删除分组？",
        "group.delete_msg": "分组内的任务将被移入回收站。",
    }
}

const currentLocale = ref<Locale>("en-US");

export function useI18n() {
    const setLocale = (locale: Locale) => {
        currentLocale.value = locale;
        localStorage.setItem('opentodo_locale', locale);
    };

    // Load saved locale on init
    const saved = localStorage.getItem('opentodo_locale');
    if (saved && (saved === "en-US" || saved === "zh-CN")) {
        currentLocale.value = saved;
    }

    const t = (key: string, args?: Record<string, string | number>): string => {
        let val = messages[currentLocale.value][key] || messages['en-US'][key] || key;
        if (args) {
            Object.entries(args).forEach(([k, v]) => {
                val = val.replace(`{${k}}`, String(v));
            });
        }
        return val;
    };

    return { locale: currentLocale, setLocale, t };
}
