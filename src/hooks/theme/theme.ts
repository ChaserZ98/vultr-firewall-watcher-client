import { createContext, useEffect, useReducer, type Dispatch } from "react";

export enum Theme {
    LIGHT = "light",
    DARK = "dark",
}

export const ThemeContext = createContext<[Theme, Dispatch<{ type: string }>]>([
    Theme.LIGHT,
    () => {},
]);

// This function will switch the theme parameter in the OG image URL
function switchOGImageThemeParam(element: HTMLMetaElement | null) {
    if (!element) return;

    const ogImageURL = element.getAttribute("content");
    if (ogImageURL) {
        const newURL = new URL(ogImageURL);
        newURL.searchParams.set(
            "theme",
            document.body.dataset.theme || Theme.DARK
        );
        element.setAttribute("content", newURL.toString());
    }
}

export const themeReducer = (state: Theme, action: { type: string }) => {
    switch (action.type) {
        case "TOGGLE":
            const newTheme = state === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
            localStorage.setItem("theme", newTheme);
            document.body.dataset.theme = newTheme;

            switchOGImageThemeParam(
                document.querySelector('meta[property="og:image"]')
            );
            switchOGImageThemeParam(
                document.querySelector('meta[name="twitter:image"]')
            );

            return newTheme;
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
};

export const useTheme = () => {
    const [theme, themeDispatch] = useReducer(themeReducer, Theme.DARK);

    useEffect(() => {
        let cachedTheme: string | null = localStorage.getItem("theme");
        if (
            !cachedTheme ||
            !(<any>Object).values(Theme).includes(cachedTheme)
        ) {
            cachedTheme = window.matchMedia("(prefers-color-scheme: dark)")
                .matches
                ? Theme.DARK
                : Theme.LIGHT;
            localStorage.setItem("theme", cachedTheme);
        }
        cachedTheme === Theme.DARK
            ? (document.body.dataset.theme = cachedTheme)
            : themeDispatch({ type: "TOGGLE" });
    }, []);

    return [theme, themeDispatch];
};
