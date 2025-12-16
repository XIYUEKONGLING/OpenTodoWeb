import { ref, reactive, watch } from 'vue';
import type { Profile } from '../models';

const getDefaultProfile = (): Profile => ({
    UserInfo: { Name: "User" },
    Projects: [],
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
});

const profile = reactive<Profile>(getDefaultProfile());
const backgroundBase64 = ref<string | null>(null);

export function useProfile() {

    const init = () => {
        const saved = localStorage.getItem('opentodo_profile');
        const savedBg = localStorage.getItem('opentodo_bg');

        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                profile.Projects = [];
                Object.assign(profile, parsed);
            } catch (e) {
                console.error("Failed to load profile", e);
            }
        }

        if (savedBg) {
            backgroundBase64.value = savedBg;
        }
    };

    watch(profile, (newVal) => {
        newVal.UpdatedAt = new Date().toISOString();
        localStorage.setItem('opentodo_profile', JSON.stringify(newVal));
    }, { deep: true });

    const setBackground = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            backgroundBase64.value = result;
            localStorage.setItem('opentodo_bg', result);
        };
        reader.readAsDataURL(file);
    };

    const exportProfile = () => {
        const dataStr = JSON.stringify(profile, null, 4);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        const dateStr = new Date().toISOString().split('T')[0];
        link.download = `OpenTodo_Backup_${dateStr}.json`;
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const parseProfileFile = (file: File): Promise<Profile> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const json = e.target?.result as string;
                    const parsed = JSON.parse(json);

                    if (!parsed.Projects || !Array.isArray(parsed.Projects)) {
                        throw new Error("Invalid profile format");
                    }

                    resolve(parsed as Profile);
                } catch (err) {
                    reject(err);
                }
            };
            reader.readAsText(file);
        });
    };

    const replaceProfile = (newProfile: Profile) => {
        Object.keys(profile).forEach(key => delete (profile as any)[key]);
        Object.assign(profile, newProfile);
        localStorage.setItem('opentodo_profile', JSON.stringify(profile));
    };

    const resetProfile = () => {
        const defaults = getDefaultProfile();

        profile.Projects = [];
        Object.assign(profile, defaults);

        backgroundBase64.value = null;

        localStorage.removeItem('opentodo_profile');
        localStorage.removeItem('opentodo_bg');

        window.location.reload();
    };

    return {
        profile,
        backgroundBase64,
        init,
        setBackground,
        exportProfile,
        parseProfileFile,
        replaceProfile,
        resetProfile
    };
}
