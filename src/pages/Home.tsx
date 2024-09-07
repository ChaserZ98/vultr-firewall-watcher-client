import FirewallTable from "@/components/FirewallTable/FirewallTable";
import MyIPTable from "@/components/MyIPTable";
import { Button } from "@nextui-org/react";

import { useCallback } from "react";

import tauriNotify from "@/hooks/notification";

export default function Home() {
    const notificationOnClick = useCallback(async () => {
        await tauriNotify("Hello, World!");
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
