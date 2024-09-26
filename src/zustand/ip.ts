import { toast } from "react-toastify";
import { create, StoreApi } from "zustand";

const IPv4Endpoints = ["https://api.ipify.org", "https://ipv4.seeip.org"];
const IPv6Endpoints = ["https://api6.ipify.org", "https://ipv6.seeip.org"];

export enum Version {
    V4 = "v4",
    V6 = "v6",
}

export type IPState = {
    value: string;
    refreshing: boolean;
};

type State = {
    [Version.V4]: IPState;
    [Version.V6]: IPState;
};

type Action = {
    refresh: (ipVersion: Version, fetchClient: typeof fetch) => void;
};

function refresh(set: StoreApi<State>["setState"]): Action["refresh"] {
    return (ipVersion, fetchClient) => {
        const endpoints =
            ipVersion === Version.V4 ? IPv4Endpoints : IPv6Endpoints;
        set(() => ({
            [ipVersion]: {
                value: "",
                refreshing: true,
            },
        }));

        const controller = new AbortController();

        const tasks: Promise<{ endpoint: string; data: string | null }>[] =
            endpoints.map((endpoint) => {
                console.log(`Fetching ${ipVersion} address from ${endpoint}.`);

                return fetchClient(endpoint, {
                    signal: controller.signal,
                })
                    .then((response) => {
                        if (response.ok) return response.text();
                        throw new Error(
                            `Failed to fetch ${ipVersion} address.`
                        );
                    })
                    .then((res) => {
                        set(() => ({
                            [ipVersion]: {
                                value: res,
                                refreshing: false,
                            },
                        }));
                        controller.abort();
                        return { endpoint, data: res };
                    })
                    .catch((err) => {
                        console.error(`${endpoint} failed: ${err}`);
                        return { endpoint, data: null };
                    });
            });

        Promise.allSettled(tasks).then((results) => {
            for (const res of results) {
                if (res.status === "rejected") {
                    console.error(res.reason);
                    continue;
                }
                const value = res.value;
                if (value.data) {
                    set(() => ({
                        [ipVersion]: {
                            value: value.data,
                            refreshing: false,
                        },
                    }));
                    console.log(
                        `Fetched ${ipVersion} address ${value.data} from ${value.endpoint}`
                    );
                    return;
                }
            }
            set(() => ({
                [ipVersion]: {
                    value: "",
                    refreshing: false,
                },
            }));
            toast.error(`Failed to fetch ${ipVersion} address.`);
        });
    };
}

export const useIPStore = create<State & Action>((set) => ({
    [Version.V4]: {
        value: "",
        refreshing: false,
    },
    [Version.V6]: {
        value: "",
        refreshing: false,
    },
    refresh: refresh(set),
}));
