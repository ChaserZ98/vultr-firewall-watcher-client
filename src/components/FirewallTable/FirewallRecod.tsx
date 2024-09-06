import { mdiPlus, mdiTrashCan } from "@mdi/js";
import Icon from "@mdi/react";
import {
    Input,
    Select,
    Selection,
    SelectItem,
    SelectSection,
    Textarea,
} from "@nextui-org/react";
import { useCallback, useState } from "react";

const ipTypes = [
    { title: "IPv4", value: "v4" },
    { title: "IPv6", value: "v6" },
];
const protocols = [
    {
        title: "Protocols",
        items: [
            {
                title: "ICMP",
                description: "Internet Control Message Protocol",
            },
            {
                title: "TCP",
                description: "Transmission Control Protocol",
            },
            {
                title: "UDP",
                description: "User Datagram Protocol",
            },
            {
                title: "GRE",
                description: "Generic Routing Encapsulation",
            },
            {
                title: "ESP",
                description: "Encapsulating Security Payload",
            },
            {
                title: "AH",
                description: "Authentication Header",
            },
        ],
    },
    {
        title: "Common Applications",
        items: [
            {
                title: "SSH",
                description: "Secure Shell",
            },
            {
                title: "HTTP",
                description: "HyperText Transfer Protocol",
            },
            {
                title: "HTTPS",
                description: "HyperText Transfer Protocol Secure",
            },
            {
                title: "MySQL",
                description: "MySQL Database Server",
            },
            {
                title: "PostgreSQL",
                description: "PostgreSQL Database Server",
            },
            {
                title: "DNS (UDP)",
                description: "Domain Name System (UDP)",
            },
            {
                title: "DNS (TCP)",
                description: "Domain Name System (TCP)",
            },
            {
                title: "MS RDP",
                description: "Microsoft Remote Desktop Protocol",
            },
        ],
    },
];
const sourceTypes = [
    {
        title: "Cloudflare",
        value: "cloudflare",
    },
    {
        title: "Custom",
        value: "custom",
    },
    {
        title: "Anywhere",
        value: "anywhere",
    },
];

type FirewallRecordProps =
    | {
          isNewRecord: true;
          test?: never;
      }
    | {
          isNewRecord?: false;
          test?: boolean;
      };

export default function FirewallRecord(
    props: React.PropsWithChildren<FirewallRecordProps>
) {
    const [selectedIPType, setSelectedIPType] = useState<Selection>(
        new Set(["v4"])
    );
    const [selectedProtocol, setSelectedProtocol] = useState<Selection>(
        new Set(["SSH"])
    );
    const [port, setPort] = useState("22");
    const [sourceType, setSourceType] = useState<Selection>(
        new Set(["anywhere"])
    );
    const [sourceAddress, setSourceAddress] = useState("");
    const [notes, setNotes] = useState("");

    const onPortInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            e.target.value.match(/^[0-9]{0,5}$/)
                ? setPort(e.target.value)
                : e.preventDefault();
        },
        []
    );

    const onSourceAddressInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setSourceAddress(e.target.value);
        },
        []
    );
    return (
        <tr className="group outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2">
            <td className="py-2 px-3 relative align-middle whitespace-normal text-small font-normal [&>*]:z-1 [&>*]:relative outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 before:content-[''] before:absolute before:z-0 before:inset-0 before:opacity-0 data-[selected=true]:before:opacity-100 group-data-[disabled=true]:text-foreground-300 group-data-[disabled=true]:cursor-not-allowed before:bg-default/60 data-[selected=true]:text-default-foreground first:before:rounded-l-lg rtl:first:before:rounded-r-lg rtl:first:before:rounded-l-[unset] last:before:rounded-r-lg rtl:last:before:rounded-l-lg rtl:last:before:rounded-r-[unset] text-start">
                <Select
                    items={ipTypes}
                    variant="faded"
                    selectionMode="single"
                    placeholder="IP Version"
                    aria-label="IP Type"
                    selectedKeys={selectedIPType}
                    onSelectionChange={setSelectedIPType}
                    className="min-w-[100px]"
                >
                    {(type) => (
                        <SelectItem key={type.value} textValue={type.title}>
                            <span className="text-sm">{type.title}</span>
                        </SelectItem>
                    )}
                </Select>
            </td>
            <td className="py-2 px-3 relative align-middle whitespace-normal text-small font-normal [&>*]:z-1 [&>*]:relative outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 before:content-[''] before:absolute before:z-0 before:inset-0 before:opacity-0 data-[selected=true]:before:opacity-100 group-data-[disabled=true]:text-foreground-300 group-data-[disabled=true]:cursor-not-allowed before:bg-default/60 data-[selected=true]:text-default-foreground first:before:rounded-l-lg rtl:first:before:rounded-r-lg rtl:first:before:rounded-l-[unset] last:before:rounded-r-lg rtl:last:before:rounded-l-lg rtl:last:before:rounded-r-[unset] text-start">
                <Select
                    items={protocols}
                    variant="faded"
                    selectionMode="single"
                    placeholder="SSH"
                    aria-label="Protocol"
                    selectedKeys={selectedProtocol}
                    onSelectionChange={setSelectedProtocol}
                    className="min-w-[150px]"
                >
                    {(type) => (
                        <SelectSection
                            title={type.title}
                            showDivider
                            key={type.title}
                        >
                            {type.items.map((protocol) => (
                                <SelectItem
                                    key={protocol.title}
                                    textValue={protocol.title}
                                >
                                    <div className="flex flex-col">
                                        <span className="text-sm">
                                            {protocol.title}
                                        </span>
                                        <span className="text-xs text-default-400 text-wrap">
                                            {protocol.description}
                                        </span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectSection>
                    )}
                </Select>
            </td>
            <td className="py-2 px-3 relative align-middle whitespace-normal text-small font-normal [&>*]:z-1 [&>*]:relative outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 before:content-[''] before:absolute before:z-0 before:inset-0 before:opacity-0 data-[selected=true]:before:opacity-100 group-data-[disabled=true]:text-foreground-300 group-data-[disabled=true]:cursor-not-allowed before:bg-default/60 data-[selected=true]:text-default-foreground first:before:rounded-l-lg rtl:first:before:rounded-r-lg rtl:first:before:rounded-l-[unset] last:before:rounded-r-lg rtl:last:before:rounded-l-lg rtl:last:before:rounded-r-[unset] text-start">
                <Input
                    placeholder="Port"
                    aria-label="Port"
                    value={port}
                    onChange={onPortInput}
                    className="min-w-[80px]"
                />
            </td>
            <td className="py-2 px-3 relative align-middle whitespace-normal text-small font-normal [&>*]:z-1 [&>*]:relative outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 before:content-[''] before:absolute before:z-0 before:inset-0 before:opacity-0 data-[selected=true]:before:opacity-100 group-data-[disabled=true]:text-foreground-300 group-data-[disabled=true]:cursor-not-allowed before:bg-default/60 data-[selected=true]:text-default-foreground first:before:rounded-l-lg rtl:first:before:rounded-r-lg rtl:first:before:rounded-l-[unset] last:before:rounded-r-lg rtl:last:before:rounded-l-lg rtl:last:before:rounded-r-[unset] text-start">
                <Select
                    items={sourceTypes}
                    variant="faded"
                    selectionMode="single"
                    placeholder="Source Type"
                    aria-label="Source Type"
                    selectedKeys={sourceType}
                    onSelectionChange={setSourceType}
                    className="min-w-[130px]"
                >
                    {(type) => (
                        <SelectItem key={type.value} textValue={type.title}>
                            <span className="text-sm">{type.title}</span>
                        </SelectItem>
                    )}
                </Select>
            </td>
            <td className="py-2 px-3 relative align-middle whitespace-normal text-small font-normal [&>*]:z-1 [&>*]:relative outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 before:content-[''] before:absolute before:z-0 before:inset-0 before:opacity-0 data-[selected=true]:before:opacity-100 group-data-[disabled=true]:text-foreground-300 group-data-[disabled=true]:cursor-not-allowed before:bg-default/60 data-[selected=true]:text-default-foreground first:before:rounded-l-lg rtl:first:before:rounded-r-lg rtl:first:before:rounded-l-[unset] last:before:rounded-r-lg rtl:last:before:rounded-l-lg rtl:last:before:rounded-r-[unset] text-start">
                <Textarea
                    minRows={1}
                    maxRows={4}
                    variant="faded"
                    placeholder="Source Address"
                    value={sourceAddress}
                    classNames={{
                        base: "min-w-[150px]",
                        input: "resize-none h-5",
                        inputWrapper: "px-2",
                        innerWrapper: "h-full",
                    }}
                    onChange={onSourceAddressInput}
                />
            </td>
            <td className="py-2 px-3 relative align-middle whitespace-normal text-small font-normal [&>*]:z-1 [&>*]:relative outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 before:content-[''] before:absolute before:z-0 before:inset-0 before:opacity-0 data-[selected=true]:before:opacity-100 group-data-[disabled=true]:text-foreground-300 group-data-[disabled=true]:cursor-not-allowed before:bg-default/60 data-[selected=true]:text-default-foreground first:before:rounded-l-lg rtl:first:before:rounded-r-lg rtl:first:before:rounded-l-[unset] last:before:rounded-r-lg rtl:last:before:rounded-l-lg rtl:last:before:rounded-r-[unset] text-start">
                <Textarea
                    minRows={1}
                    variant="faded"
                    placeholder="Add note"
                    value={notes}
                    classNames={{
                        base: "min-w-[120px]",
                        input: "resize-none overflow-y-auto h-5 text-balance",
                        inputWrapper: "px-2",
                        innerWrapper: "h-full",
                    }}
                    onChange={(e) => setNotes(e.target.value)}
                />
            </td>
            <td className="py-2 px-3 relative align-middle whitespace-normal text-small font-normal [&>*]:z-1 [&>*]:relative outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 before:content-[''] before:absolute before:z-0 before:inset-0 before:opacity-0 data-[selected=true]:before:opacity-100 group-data-[disabled=true]:text-foreground-300 group-data-[disabled=true]:cursor-not-allowed before:bg-default/60 data-[selected=true]:text-default-foreground first:before:rounded-l-lg rtl:first:before:rounded-r-lg rtl:first:before:rounded-l-[unset] last:before:rounded-r-lg rtl:last:before:rounded-l-lg rtl:last:before:rounded-r-[unset]">
                <div className="flex w-full h-full items-center justify-center">
                    {props.isNewRecord ? (
                        <Icon
                            path={mdiPlus}
                            size={1}
                            className="text-primary transition-colors duration-300 ease hover:text-primary-300"
                        />
                    ) : (
                        <Icon
                            path={mdiTrashCan}
                            size={1}
                            className="text-danger transition-colors duration-300 ease hover:text-danger-300"
                        />
                    )}
                </div>
            </td>
        </tr>
    );
}
