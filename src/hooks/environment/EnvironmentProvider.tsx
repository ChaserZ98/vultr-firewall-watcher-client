import type { ReactNode } from "react";

import { EnvironmentContext, useEnvironment } from "./environment";

export default function EnvironmentProvider({
    children,
}: {
    children: ReactNode;
}) {
    const environment = useEnvironment();
    return (
        <EnvironmentContext.Provider value={environment}>
            {children}
        </EnvironmentContext.Provider>
    );
}
