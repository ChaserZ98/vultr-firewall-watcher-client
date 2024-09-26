import { readText, writeText } from "@tauri-apps/plugin-clipboard-manager";

import { Environment, useEnvironmentStore } from "@zustand/environment";

export default function useClipboard(): {
    writeText: (text: string) => Promise<void>;
    readText: () => Promise<string>;
} {
    const environment = useEnvironmentStore((state) => state.environment);
    if (environment === Environment.WEB) {
        return {
            writeText: navigator.clipboard.writeText,
            readText: navigator.clipboard.readText,
        };
    }

    return {
        writeText,
        readText,
    };
}
