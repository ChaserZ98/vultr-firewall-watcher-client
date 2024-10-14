import { create } from "zustand";

export enum Theme {
    LIGHT = "light",
    DARK = "dark",
}

type ThemeState = {
    theme: Theme;
    toggleTheme: () => void;
};

function createInitialTheme(): Theme {
    let cachedTheme: string | null = localStorage.getItem("theme");
    if (!cachedTheme || !(<any>Object).values(Theme).includes(cachedTheme)) {
        cachedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
            ? Theme.DARK
            : Theme.LIGHT;
        localStorage.setItem("theme", cachedTheme);
    }
    document.documentElement.dataset.theme = cachedTheme;
    return cachedTheme as Theme;
}

export const useThemeStore = create<ThemeState>()((set) => ({
    theme: createInitialTheme(),
    toggleTheme: () => {
        set((state) => {
            const newTheme =
                state.theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
            localStorage.setItem("theme", newTheme);
            document.documentElement.dataset.theme = newTheme;
            return { theme: newTheme };
        });
    },
}));
