import { reactive, watch } from 'vue';
import type { Profile } from '../models';

const getDefaultProfile = (): Profile => ({
    UserInfo: { Name: "User" },
    Projects: [],
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
});

const profile = reactive<Profile>(getDefaultProfile());

export function useProfile() {

    const init = () => {
        const saved = localStorage.getItem('opentodo_profile');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Reset and assign to keep reactivity
                Object.keys(profile).forEach(key => delete (profile as any)[key]);
                Object.assign(profile, parsed);
            } catch (e) {
                console.error("Failed to load profile", e);
            }
        }
    };

    watch(profile, (newVal) => {
        newVal.UpdatedAt = new Date().toISOString();
        localStorage.setItem('opentodo_profile', JSON.stringify(newVal));
    }, { deep: true });

    const exportProfile = () => {
        const dataStr = JSON.stringify(profile, null, 4);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
        link.download = `OpenTodo_Profile_${dateStr}.json`;
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
                    // Basic validation
                    if (!parsed.UserInfo || !Array.isArray(parsed.Projects)) {
                        throw new Error("Invalid profile structure");
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
        // Force save immediately
        localStorage.setItem('opentodo_profile', JSON.stringify(profile));
    };

    const resetProfile = () => {
        const defaults = getDefaultProfile();
        Object.keys(profile).forEach(key => delete (profile as any)[key]);
        Object.assign(profile, defaults);
        localStorage.removeItem('opentodo_profile');
    };

    return {
        profile,
        init,
        exportProfile,
        parseProfileFile,
        replaceProfile,
        resetProfile
    };
}
