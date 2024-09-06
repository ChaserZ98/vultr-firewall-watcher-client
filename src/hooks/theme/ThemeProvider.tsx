import type { Dispatch, ReactNode } from "react";

import { ThemeContext, useTheme, type Theme } from "./theme";

export default function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, themeDispatch] = useTheme() as [
        Theme,
        Dispatch<{ type: string }>
    ];
    return (
        <ThemeContext.Provider value={[theme, themeDispatch]}>
            {children}
        </ThemeContext.Provider>
    );
}
