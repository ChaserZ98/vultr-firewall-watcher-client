import { useCallback, useState } from "react";

import { mdiContentCopy, mdiRefresh } from "@mdi/js";
import Icon from "@mdi/react";
import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Tooltip,
} from "@nextui-org/react";
import { toast } from "react-toastify";

export default function MyIPTable() {
    const [ipv4, setIPv4] = useState("");
    const [isIpv4Refreshing, setIsIPv4Refreshing] = useState(false);
    const [ipv6, setIPv6] = useState("");
    const [isIpv6Refreshing, setIsIPv6Refreshing] = useState(false);

    const onAddressRefresh = useCallback(async (version: string) => {
        const endpoint =
            version === "IPv4"
                ? "https://api.ipify.org"
                : "https://api6.ipify.org";
        version === "IPv4"
            ? setIsIPv4Refreshing(true)
            : setIsIPv6Refreshing(true);
        await fetch(`${endpoint}?format=json`)
            .then((res) => {
                res.json().then((data) => {
                    version === "IPv4" ? setIPv4(data.ip) : setIPv6(data.ip);
                });
            })
            .catch((err) => {
                version === "IPv4" ? setIPv4("") : setIPv6("");
                toast.error(
                    `Failed to fetch ${version} address. Error: ${err}`
                );
            });
        version === "IPv4"
            ? setIsIPv4Refreshing(false)
            : setIsIPv6Refreshing(false);
    }, []);
    const onAddressCopy = useCallback(
        (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            const res =
                e.currentTarget.parentElement?.parentElement?.firstChild
                    ?.textContent;
            if (!res || res === "Unknown") return;
            navigator.clipboard.writeText(res);
            toast.success("Copied to clipboard", {
                autoClose: 1000,
                hideProgressBar: true,
                pauseOnHover: false,
                pauseOnFocusLoss: false,
                closeOnClick: false,
                closeButton: false,
            });
        },
        []
    );

    return (
        <div className="flex flex-col px-8 gap-4 items-center select-none">
            <h2 className="text-2xl font-bold">My Public IP Addresses</h2>
            <Table aria-label="IP Table">
                <TableHeader className="select-none">
                    <TableColumn align="center">
                        IP Protocol Version
                    </TableColumn>
                    <TableColumn align="center">Address</TableColumn>
                </TableHeader>
                <TableBody>
                    {["IPv4", "IPv6"].map((version) => (
                        <TableRow
                            key={version}
                            className={
                                version === "IPv4"
                                    ? isIpv4Refreshing
                                        ? "animate-pulse"
                                        : ""
                                    : isIpv6Refreshing
                                    ? "animate-pulse"
                                    : ""
                            }
                        >
                            <TableCell className="select-none">
                                {version}
                            </TableCell>
                            <TableCell className="select-none">
                                <div className="flex items-center justify-center gap-2">
                                    <span className="flex-1">
                                        {version === "IPv4"
                                            ? ipv4 || "Unknown"
                                            : ipv6 || "Unknown"}
                                    </span>
                                    <div className="flex items-center justify-center gap-1">
                                        {(version === "IPv4" && ipv4) ||
                                        (version === "IPv6" && ipv6) ? (
                                            <>
                                                <Tooltip
                                                    content="Copy"
                                                    delay={1000}
                                                >
                                                    <button
                                                        className="text-default-400 transition-colors-opacity duration-300 ease hover:text-primary-500"
                                                        onClick={onAddressCopy}
                                                    >
                                                        <Icon
                                                            path={
                                                                mdiContentCopy
                                                            }
                                                            size={0.75}
                                                            className="cursor-pointer"
                                                        />
                                                    </button>
                                                </Tooltip>
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                        <Tooltip content="Refresh" delay={1000}>
                                            <button
                                                className="text-default-400 transition-colors-opacity duration-300 ease hover:text-primary-500"
                                                onClick={() =>
                                                    onAddressRefresh(version)
                                                }
                                                disabled={
                                                    (version === "IPv4" &&
                                                        isIpv4Refreshing) ||
                                                    (version === "IPv6" &&
                                                        isIpv6Refreshing)
                                                }
                                            >
                                                <Icon
                                                    path={mdiRefresh}
                                                    size={0.75}
                                                    className={
                                                        (version === "IPv4" &&
                                                            isIpv4Refreshing) ||
                                                        (version === "IPv6" &&
                                                            isIpv6Refreshing)
                                                            ? "animate-spin"
                                                            : ""
                                                    }
                                                />
                                            </button>
                                        </Tooltip>
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
