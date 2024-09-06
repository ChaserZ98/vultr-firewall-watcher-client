import FirewallTable from "@/components/FirewallTable/FirewallTable";
import MyIPTable from "@/components/MyIPTable";
import { Button } from "@nextui-org/react";

import {
    isPermissionGranted,
    requestPermission,
    sendNotification,
} from "@tauri-apps/api/notification";
import { useCallback } from "react";

export default function Home() {
    const notificationOnClick = useCallback(async () => {
        let permissionGranted = await isPermissionGranted();
        if (!permissionGranted) {
            const permission = await requestPermission();
            permissionGranted = permission === "granted";
        }
        if (permissionGranted) {
            setTimeout(() => {
                sendNotification({ title: "TAURI", body: "Tauri is awesome!" });
            }, 3000);
        }
    }, []);

    return (
        <main
            className="
                flex flex-col items-center justify-center gap-4 px-4
                md:m-auto md:max-w-5xl md:gap-10
                lg:max-w-7xl
                xl:max-w-[1536px]
                "
        >
            <div className="flex flex-col gap-4 items-center">
                <MyIPTable />
                <FirewallTable />
                <Button onClick={notificationOnClick}>Notification</Button>
            </div>
        </main>
    );
}
