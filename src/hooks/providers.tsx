import { type ReactNode } from "react";

import { NextUIProvider } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import EnvironmentProvider from "./environment/EnvironmentProvider";
import ThemeProvider from "./theme/ThemeProvider";

export default function AppContextProviders({
    children,
}: {
    children?: ReactNode;
}) {
    const nagivate = useNavigate();
    return (
        <ThemeProvider>
            <NextUIProvider navigate={nagivate}>
                <EnvironmentProvider>{children}</EnvironmentProvider>
            </NextUIProvider>
        </ThemeProvider>
    );
}
