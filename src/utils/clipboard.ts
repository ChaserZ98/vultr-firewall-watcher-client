import { readText, writeText } from "@tauri-apps/plugin-clipboard-manager";

type Clipboard = {
    writeText: (text: string) => Promise<void>;
    readText: () => Promise<string>;
};

const clipboard: Clipboard =
    "__TAURI_INTERNALS__" in window
        ? {
              writeText,
              readText,
          }
        : {
              writeText: navigator.clipboard.writeText,
              readText: navigator.clipboard.readText,
          };

export default clipboard;
