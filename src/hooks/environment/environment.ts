import { createContext, useState } from "react";

export enum Environment {
    TAURI = "tauri",
    WEB = "web",
}

export const EnvironmentContext = createContext<Environment>(Environment.WEB);

export const useEnvironment = () => {
    const [environment, _] = useState(
        "__TAURI_INTERNALS__" in window ? Environment.TAURI : Environment.WEB
    );
    return environment;
};
