import { ref, computed } from 'vue';
import { theme as antTheme } from 'ant-design-vue';

type ThemeMode = 'light' | 'dark' | 'auto';

const themeMode = ref<ThemeMode>('auto');
const isDark = ref(false);

export function useTheme() {

    const initTheme = () => {
        const saved = localStorage.getItem('opentodo_theme') as ThemeMode;
        if (saved) themeMode.value = saved;
        applyTheme();
    };

    const applyTheme = () => {
        const root = document.documentElement;
        let effectiveDark = false;

        if (themeMode.value === 'auto') {
            effectiveDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        } else {
            effectiveDark = themeMode.value === 'dark';
        }

        isDark.value = effectiveDark;

        if (effectiveDark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    };

    const setTheme = (mode: ThemeMode) => {
        themeMode.value = mode;
        localStorage.setItem('opentodo_theme', mode);
        applyTheme();
    };

    // Listen to system changes if auto
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (themeMode.value === 'auto') applyTheme();
    });

    // Ant Design Theme Algorithm
    const antAlgorithm = computed(() =>
        isDark.value ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm
    );

    return { themeMode, isDark, setTheme, initTheme, antAlgorithm };
}
