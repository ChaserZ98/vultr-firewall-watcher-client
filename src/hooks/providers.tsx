import { type ReactNode } from "react";

import EnvironmentProvider from "./environment/EnvironmentProvider";
import ThemeProvider from "./theme/ThemeProvider";

export default function AppContextProviders({
    children,
}: {
    children?: ReactNode;
}) {
    return (
        <ThemeProvider>
            <EnvironmentProvider>{children}</EnvironmentProvider>
        </ThemeProvider>
    );
}
