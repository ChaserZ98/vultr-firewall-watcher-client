import { create } from "zustand";

export enum Environment {
    MOBILE = "mobile",
    DESKTOP = "desktop",
    WEB = "web",
}
type EnvironmentState = {
    environment: Environment;
};

export const useEnvironmentStore = create<EnvironmentState>()(() => ({
    environment: !("__TAURI_INTERNALS__" in window)
        ? Environment.WEB
        : navigator.maxTouchPoints > 0
        ? Environment.MOBILE
        : Environment.DESKTOP,
}));
