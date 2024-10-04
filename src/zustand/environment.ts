import { type } from "@tauri-apps/plugin-os";
import { create } from "zustand";

export enum Environment {
    LINUX = "linux",
    MACOS = "macos",
    WINDOWS = "windows",
    IOS = "ios",
    ANDROID = "android",
    WEB = "web",
}
type EnvironmentState = {
    environment: Environment;
};

export const useEnvironmentStore = create<EnvironmentState>()(() => ({
    environment: !("__TAURI_INTERNALS__" in window)
        ? Environment.WEB
        : (type() as Environment),
}));
