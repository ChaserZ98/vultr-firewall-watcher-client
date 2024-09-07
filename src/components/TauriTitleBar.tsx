import { useCallback, useContext, useEffect, useState } from "react";

import tauriNotify from "@/hooks/notification";
import {
    Environment,
    EnvironmentContext,
} from "@hooks/environment/environment";
import {
    mdiWindowClose,
    mdiWindowMaximize,
    mdiWindowMinimize,
    mdiWindowRestore,
} from "@mdi/js";
import Icon from "@mdi/react";
import { getCurrentWindow } from "@tauri-apps/api/window";

export default function TauriTitleBar() {
    const environment = useContext(EnvironmentContext);
    if (environment !== Environment.TAURI) return <></>;

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
        updateMaximizeStatus();
        let unlistenResize = () => {};
        const listenResize = async () => {
            unlistenResize = await getCurrentWindow().onResized(() => {
                updateMaximizeStatus();
            });
        };
        listenResize();
        return () => {
            unlistenResize();
        };
    }, []);

    return (
        <div
            className="sticky flex w-full h-[30px] items-center justify-center select-none z-50"
            onMouseDown={onWindowDrag}
        >
            <div className="absolute flex right-0 h-full items-center justify-center">
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
            <h1 className="text-default-400 font-bold text-medium">
                Vultr Firewall Watcher
            </h1>
        </div>
    );
}
