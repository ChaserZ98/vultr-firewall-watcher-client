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
import { appWindow } from "@tauri-apps/api/window";
import { useCallback, useContext, useEffect, useState } from "react";

export default function TauriTitleBar() {
    const environment = useContext(EnvironmentContext);
    if (environment !== Environment.TAURI) return <></>;

    const [isMaximized, setIsMaximized] = useState(false);

    const updateMaximizeStatus = useCallback(async () => {
        setIsMaximized(await appWindow.isMaximized());
    }, []);
    const onWindowDrag = useCallback(
        async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            e.preventDefault();
            await appWindow.startDragging();
        },
        []
    );
    const onWindowMinimize = useCallback(
        async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            e.stopPropagation();
            await appWindow.minimize();
        },
        []
    );
    const onWindowMaximize = useCallback(
        async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            e.stopPropagation();
            await appWindow.toggleMaximize();
            setIsMaximized(await appWindow.isMaximized());
        },
        []
    );
    const onWindowClose = useCallback(
        async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            e.stopPropagation();
            await appWindow.hide();
        },
        []
    );

    useEffect(() => {
        updateMaximizeStatus();
        let unlistenResize = () => {};
        const listenResize = async () => {
            unlistenResize = await appWindow.onResized(() => {
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
            className="flex relative w-full h-8 items-center justify-center select-none"
            onMouseDown={onWindowDrag}
        >
            <div className="absolute flex right-0 h-full items-center justify-center">
                <button
                    className="text-default-400 h-full px-2 hover:bg-default-400 hover:text-default-foreground cursor-default"
                    onMouseDown={(e) => e.stopPropagation()}
                    onMouseUp={onWindowMinimize}
                >
                    <Icon path={mdiWindowMinimize} size={1.25} />
                </button>
                <button
                    className="text-default-400 h-full px-2 hover:bg-default-400 hover:text-default-foreground cursor-default"
                    onMouseUp={onWindowMaximize}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <Icon
                        path={
                            isMaximized ? mdiWindowRestore : mdiWindowMaximize
                        }
                        size={1.25}
                    />
                </button>
                <button
                    className="text-default-400 h-full px-2 hover:bg-danger hover:text-default-foreground cursor-default"
                    onMouseUp={onWindowClose}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <Icon path={mdiWindowClose} size={1.25} />
                </button>
            </div>
            <div>
                <h1 className="text-default-400">Vultr Firewall Watcher</h1>
            </div>
        </div>
    );
}
