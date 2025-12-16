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
        "common.edit": "Edit",
        "common.created": "Created",
        "common.actions": "Actions",
        "home.welcome": "Welcome to OpenTodo",
        "home.subtitle": "Select a project to start or create a new one.",
        "settings.language": "Language",
        "settings.data_management": "Data Management",
        "settings.export": "Export Profile",
        "settings.import": "Import Profile",
        "settings.reset": "Reset All Data",
        "settings.import_warn": "This will overwrite your current data.",
        "settings.reset_confirm": "Are you sure you want to delete all data? This cannot be undone.",
        "import.notify.title": "Profile Detected",
        "import.notify.msg": "Found profile updated at: {date}. Do you want to import?",
        "project.name": "Project Name",
        "project.desc": "Description",
        "project.delete_confirm": "Delete this project?",
        "list.add": "Add List",
        "list.title": "List Title",
        "list.delete_confirm": "Delete this list and all its tasks?",
        "task.add": "Add Task",
        "task.title": "Task Title",
        "task.desc": "Description",
        "task.due_date": "Due Date",
        "task.delete_confirm": "Delete this task?",
        "group.add": "Add Group",
        "group.title": "Group Title",
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
        "common.edit": "编辑",
        "common.created": "创建于",
        "common.actions": "操作",
        "home.welcome": "欢迎使用 OpenTodo",
        "home.subtitle": "请选择一个项目开始，或创建一个新项目。",
        "settings.language": "语言",
        "settings.data_management": "数据管理",
        "settings.export": "导出数据",
        "settings.import": "导入数据",
        "settings.reset": "重置所有数据",
        "settings.import_warn": "这将覆盖您当前的所有数据。",
        "settings.reset_confirm": "确定要删除所有数据吗？此操作无法撤销。",
        "import.notify.title": "检测到配置文件",
        "import.notify.msg": "发现更新于 {date} 的配置。是否导入？",
        "project.name": "项目名称",
        "project.desc": "描述",
        "project.delete_confirm": "确定删除此项目？",
        "list.add": "添加列表",
        "list.title": "列表标题",
        "list.delete_confirm": "删除此列表及其所有任务？",
        "task.add": "添加任务",
        "task.title": "任务标题",
        "task.desc": "描述",
        "task.due_date": "截止日期",
        "task.delete_confirm": "删除此任务？",
        "group.add": "添加分组",
        "group.title": "分组标题",
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

    const t = (key: string, args?: Record<string, string>): string => {
        let val = messages[currentLocale.value][key] || messages['en-US'][key] || key;
        if (args) {
            Object.entries(args).forEach(([k, v]) => {
                val = val.replace(`{${k}}`, v);
            });
        }
        return val;
    };

    return { locale: currentLocale, setLocale, t };
}
