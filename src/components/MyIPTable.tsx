import { useCallback } from "react";

import { mdiContentCopy, mdiRefresh } from "@mdi/js";
import Icon from "@mdi/react";
import {
    Button,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Tooltip,
} from "@nextui-org/react";
import { toast } from "react-toastify";

import { Version as IPVersion, useIPStore } from "@/zustand/ip";
import { useSettingsStore } from "@/zustand/settings";

export default function MyIPTable() {
    const ipv4 = useIPStore((state) => state[IPVersion.V4]);
    const ipv6 = useIPStore((state) => state[IPVersion.V6]);
    const refreshIP = useIPStore((state) => state.refresh);
    const settings = useSettingsStore((state) => state.settings);
    const setSettings = useSettingsStore((state) => state.setSettings);

    const refresh = useCallback(
        (version: IPVersion, useProxy: boolean) => {
            if (useProxy && settings.proxyAddress === "") {
                toast.error(
                    <>
                        <p>Proxy address is not set.</p>
                        <p>Please set it in settings before using a proxy.</p>
                    </>
                );
                return;
            }
            const proxy = useProxy
                ? {
                      http: settings.proxyAddress,
                      https: settings.proxyAddress,
                  }
                : undefined;
            refreshIP(version, proxy);
        },
        [settings]
    );

    return (
        <div className="flex flex-col px-8 gap-4 items-center select-none">
            <h2 className="text-lg font-bold text-foreground transition-colors-opacity sm:text-2xl">
                My Public IP Addresses
            </h2>
            <Table
                aria-label="IP Table"
                className="text-wrap"
                classNames={{
                    wrapper: "transition-colors-opacity",
                    th: "transition-colors-opacity text-xs sm:text-sm",
                    td: "transition-colors-opacity text-sm sm:text-base",
                }}
            >
                <TableHeader>
                    <TableColumn align="center">Version</TableColumn>
                    <TableColumn align="center">Address</TableColumn>
                    <TableColumn align="center" width={64}>
                        Action
                    </TableColumn>
                </TableHeader>
                <TableBody>
                    {Object.values(IPVersion).map((version) => (
                        <TableRow
                            key={version}
                            className={
                                (version === IPVersion.V4 && ipv4.refreshing) ||
                                (version === IPVersion.V6 && ipv6.refreshing)
                                    ? "animate-pulse"
                                    : ""
                            }
                        >
                            <TableCell className="text-foreground font-mono">
                                {version === IPVersion.V4 ? "IPv4" : "IPv6"}
                            </TableCell>
                            <TableCell className="text-foreground font-mono">
                                <span className="break-all">
                                    {version === IPVersion.V4
                                        ? ipv4.refreshing
                                            ? "Refreshing..."
                                            : ipv4.value || "Unknown"
                                        : ipv6.refreshing
                                        ? "Refreshing..."
                                        : ipv6.value || "Unknown"}
                                </span>
                            </TableCell>
                            <TableCell className="sm:flex sm:justify-center">
                                <div className="flex w-[64px] items-center justify-end">
                                    {((version === IPVersion.V4 &&
                                        ipv4.value) ||
                                        (version === IPVersion.V6 &&
                                            ipv6.value)) && (
                                        <Tooltip
                                            content="Copy"
                                            delay={1000}
                                            closeDelay={100}
                                        >
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                variant="light"
                                                color="primary"
                                                className="text-default-400 transition-colors-opacity hover:text-primary-500"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(
                                                        version === IPVersion.V4
                                                            ? ipv4.value
                                                            : ipv6.value
                                                    );
                                                    toast.success(
                                                        "Copied to clipboard",
                                                        {
                                                            autoClose: 1000,
                                                            hideProgressBar:
                                                                true,
                                                            pauseOnHover: false,
                                                            pauseOnFocusLoss:
                                                                false,
                                                            closeOnClick: false,
                                                            closeButton: false,
                                                        }
                                                    );
                                                }}
                                            >
                                                <Icon
                                                    path={mdiContentCopy}
                                                    size={0.75}
                                                    className="cursor-pointer"
                                                />
                                            </Button>
                                        </Tooltip>
                                    )}
                                    <Tooltip
                                        content="Refresh"
                                        delay={1000}
                                        closeDelay={100}
                                    >
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="light"
                                            color="primary"
                                            className="text-default-400 transition-colors-opacity hover:text-primary-500"
                                            onClick={() =>
                                                refresh(
                                                    version,
                                                    settings.useProxy
                                                )
                                            }
                                            disabled={
                                                (version === IPVersion.V4 &&
                                                    ipv4.refreshing) ||
                                                (version === IPVersion.V6 &&
                                                    ipv6.refreshing)
                                            }
                                        >
                                            <Icon
                                                path={mdiRefresh}
                                                size={0.75}
                                                className={
                                                    (version === IPVersion.V4 &&
                                                        ipv4.refreshing) ||
                                                    (version === IPVersion.V6 &&
                                                        ipv6.refreshing)
                                                        ? "animate-spin"
                                                        : ""
                                                }
                                            />
                                        </Button>
                                    </Tooltip>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Switch
                isSelected={settings.useProxy}
                onValueChange={() => {
                    setSettings({ ...settings, useProxy: !settings.useProxy });
                }}
                classNames={{
                    label: "text-foreground transition-colors-opacity",
                }}
            >
                {`Proxy ${settings.useProxy ? "On" : "Off"}`}
            </Switch>
        </div>
    );
}
