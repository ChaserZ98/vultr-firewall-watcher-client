import {
    type ClientOptions,
    fetch as tauriFetch,
} from "@tauri-apps/plugin-http";

import { Environment, useEnvironmentStore } from "@zustand/environment";

function createTauriFetch(clientOptions?: ClientOptions) {
    return (input: RequestInfo | URL, init?: RequestInit) => {
        return tauriFetch(input, {
            ...clientOptions,
            ...init,
        });
    };
}

export default function useFetch(clientOptions?: ClientOptions) {
    const environment = useEnvironmentStore((state) => state.environment);

    return environment === Environment.WEB
        ? fetch
        : createTauriFetch(clientOptions);
}
