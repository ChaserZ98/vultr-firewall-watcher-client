import {
    type ClientOptions,
    fetch as tauriFetch,
} from "@tauri-apps/plugin-http";

function createTauriFetch(clientOptions?: ClientOptions) {
    return (input: RequestInfo | URL, init?: RequestInit) => {
        return tauriFetch(input, {
            ...clientOptions,
            ...init,
        });
    };
}

export default function useFetch(clientOptions?: ClientOptions) {
    return "__TAURI_INTERNALS__" in window
        ? createTauriFetch(clientOptions)
        : fetch;
}
