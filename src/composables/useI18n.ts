import { ref } from 'vue';

type Locale = "en-US" | "zh-CN";
const messages: Record<Locale, Record<string, string>> = {
    "en-US": {
        "program.title": "OpenTodo",
        "sidebar.settings": "Settings",
    },
    "zh-CN": {
        "program.title": "OpenTodo",
        "sidebar.settings": "设置",
    }
}

const currentLocale = ref<Locale>("en-US");

export function useI18n() {
    const setLocale = (locale: Locale) => {
        currentLocale.value = locale;
    };

    const t = (key: string): string => {
        const valInCurrent = messages[currentLocale.value][key];
        const valInDefault = messages['en-US'][key];

        if (valInCurrent) return valInCurrent;
        if (valInDefault) return valInDefault;
        return key;
    };

    return { locale: currentLocale, setLocale, t };
}
