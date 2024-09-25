import { create } from "zustand";

export type Settings = {
    proxyAddress: string;
    useProxy: boolean;
    apiToken: string;
};

type State = {
    settings: Settings;
};

type Action = {
    setSettings: (settings: Settings) => void;
};

export function isSettings(settings: any): settings is Settings {
    return (
        typeof settings.proxyAddress === "string" &&
        typeof settings.useProxy === "boolean" &&
        typeof settings.apiToken === "string"
    );
}

function createInitialSettings(): Settings {
    try {
        const settings = JSON.parse(localStorage.getItem("settings") || "");
        return isSettings(settings)
            ? settings
            : {
                  proxyAddress: "",
                  useProxy: false,
                  apiToken: "",
              };
    } catch (e) {
        console.error(`Error parsing settings: ${e}`);
        return {
            proxyAddress: "",
            useProxy: false,
            apiToken: "",
        };
    }
}

export const useSettingsStore = create<State & Action>((set) => ({
    settings: createInitialSettings(),
    setSettings: (settings: Settings) =>
        set(() => {
            localStorage.setItem("settings", JSON.stringify(settings));
            return { settings };
        }),
}));
