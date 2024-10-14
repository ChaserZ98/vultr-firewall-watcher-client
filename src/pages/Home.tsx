import GroupTable from "@/components/Firewall/Group/GroupTable";

export default function Home() {
    return (
        <main
            className="flex flex-col items-center justify-center gap-4 px-4
            md:m-auto md:max-w-5xl md:gap-10
            lg:max-w-7xl
            xl:max-w-[1536px]"
        >
            <GroupTable />
        </main>
    );
}
