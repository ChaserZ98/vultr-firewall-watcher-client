import FirewallRecord from "./FirewallRecod";

export default function FirewallTable() {
    return (
        <div className="flex flex-col px-8 gap-4 items-center select-none">
            <h2 className="text-2xl font-bold">Vultr Firewall Rules</h2>
            <div className="flex flex-col relative justify-between gap-4 bg-content1 p-4 overflow-auto rounded-large shadow-small w-full">
                <table className="min-w-full h-auto table-auto w-full">
                    <thead className="[&>tr]:first:rounded-lg">
                        <tr className="group outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2">
                            {[
                                "IP Version",
                                "Protocol",
                                "Port",
                                "Source Type",
                                "Source",
                                "Notes",
                                "Actions",
                            ].map((head) => (
                                <th
                                    className="group px-3 h-10 align-middle bg-default-100 whitespace-nowrap text-foreground-500 text-tiny font-semibold first:rounded-l-lg rtl:first:rounded-r-lg rtl:first:rounded-l-[unset] last:rounded-r-lg rtl:last:rounded-l-lg rtl:last:rounded-r-[unset] data-[sortable=true]:cursor-pointer data-[hover=true]:text-foreground-400 outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-start"
                                    key={head}
                                >
                                    {head}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <FirewallRecord isNewRecord />
                        <FirewallRecord />
                        <FirewallRecord />
                    </tbody>
                </table>
            </div>
        </div>
    );
}
