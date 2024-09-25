import { useCallback, useEffect, useState } from "react";

import tauriNotify from "@/hooks/notification";
import {
    mdiWindowClose,
    mdiWindowMaximize,
    mdiWindowMinimize,
    mdiWindowRestore,
} from "@mdi/js";
import Icon from "@mdi/react";
import { Image } from "@nextui-org/react";
import { getCurrentWindow } from "@tauri-apps/api/window";

import { Environment, useEnvironmentStore } from "@/zustand/environment";
import appIcon from "@img/app-icon.png";

export default function TauriTitleBar() {
    const environment = useEnvironmentStore((state) => state.environment);
    if (environment !== Environment.DESKTOP) return <></>;

    const [isMaximized, setIsMaximized] = useState(false);
    const [isFirstClosed, setIsFirstClosed] = useState(true);

    const updateMaximizeStatus = useCallback(async () => {
        setIsMaximized(await getCurrentWindow().isMaximized());
    }, []);
    const onWindowDrag = useCallback(
        async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            if (e.buttons !== 1) return;

            e.preventDefault();
            if (e.detail === 2) {
                await getCurrentWindow().toggleMaximize();
                setIsMaximized(await getCurrentWindow().isMaximized());
            } else {
                await getCurrentWindow().startDragging();
            }
        },
        []
    );
    const onWindowMinimize = useCallback(
        async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            e.stopPropagation();
            await getCurrentWindow().minimize();
        },
        []
    );
    const onWindowMaximize = useCallback(
        async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            e.stopPropagation();
            await getCurrentWindow().toggleMaximize();
            setIsMaximized(await getCurrentWindow().isMaximized());
        },
        []
    );
    const onWindowClose = useCallback(
        async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            e.stopPropagation();

            await getCurrentWindow().hide();

            if (isFirstClosed) {
                await tauriNotify(
                    "The application is still running in the background."
                );
                setIsFirstClosed(false);
            }
        },
        [isFirstClosed]
    );

    useEffect(() => {
        console.log(
            `Current platform: ${environment}\nCurrent mode: ${
                import.meta.env.MODE
            }`
        );

        updateMaximizeStatus();
        let unlistenResize = () => {};
        const listenResize = async () => {
            unlistenResize = await getCurrentWindow().onResized(() => {
                updateMaximizeStatus();
            });
        };
        listenResize();
        const preventContextMenu = (e: MouseEvent) => e.preventDefault();

        const preventRefreshKey = import.meta.env.PROD
            ? (e: KeyboardEvent) => {
                  if (e.key === "F5" || (e.key === "r" && e.ctrlKey))
                      e.preventDefault();
              }
            : () => {};

        document.addEventListener("contextmenu", preventContextMenu);
        document.addEventListener("keydown", preventRefreshKey);

        return () => {
            unlistenResize();
            document.removeEventListener("contextmenu", preventContextMenu);
            document.removeEventListener("keydown", preventRefreshKey);
        };
    }, []);

    return (
        <div
            className="sticky flex w-full h-8 select-none z-50"
            onMouseDown={onWindowDrag}
        >
            <div className="absolute flex items-center justify-center right-0 h-full">
                <button
                    className="text-default-400 h-full px-2 hover:bg-default-400 hover:text-default-foreground cursor-default transition-colors-opacity duration-75"
                    onMouseDown={(e) => e.stopPropagation()}
                    onMouseUp={onWindowMinimize}
                >
                    <Icon path={mdiWindowMinimize} size={1} />
                </button>
                <button
                    className="text-default-400 h-full px-2 hover:bg-default-400 hover:text-default-foreground cursor-default transition-colors-opacity duration-75"
                    onMouseUp={onWindowMaximize}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <Icon
                        path={
                            isMaximized ? mdiWindowRestore : mdiWindowMaximize
                        }
                        size={1}
                    />
                </button>
                <button
                    className="text-default-400 h-full px-2 hover:bg-danger hover:text-default-foreground cursor-default transition-colors-opacity duration-75"
                    onMouseUp={onWindowClose}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <Icon path={mdiWindowClose} size={1} />
                </button>
            </div>
            <div className="mx-0 flex items-center justify-center gap-1 sm:mx-auto">
                <Image
                    alt="Vultr Firewall Watcher Logo"
                    src={appIcon}
                    className="px-1 w-10"
                />
                <h1 className="hidden text-default-400 font-bold text-medium sm:block">
                    Vultr Firewall Watcher
                </h1>
            </div>
        </div>
    );
}
