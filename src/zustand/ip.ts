import { toast } from "react-toastify";
import { create, StoreApi } from "zustand";

import logging from "@/utils/log";

const IPv4Endpoints = [
    "https://api.ipify.org",
    "https://ipv4.seeip.org",
    "https://ipv4.ip.sb",
    "https://4.ipw.cn",
];
const IPv6Endpoints = [
    "https://api6.ipify.org",
    "https://ipv6.seeip.org",
    "https://ipv6.ip.sb",
    "https://6.ipw.cn",
];

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
    refresh: (
        ipVersion: Version,
        fetchClient: typeof fetch,
        timeout?: number
    ) => void;
};

function refresh(set: StoreApi<State>["setState"]): Action["refresh"] {
    return (ipVersion, fetchClient, timeout = 5000) => {
        const endpoints =
            ipVersion === Version.V4 ? IPv4Endpoints : IPv6Endpoints;
        set(() => ({
            [ipVersion]: {
                value: "",
                refreshing: true,
            },
        }));

        const exclusiveAbortController = new AbortController();

        const tasks = endpoints.map((endpoint) => {
            logging.info(`Fetching ${ipVersion} address from ${endpoint}.`);
            const timeoutSignal = AbortSignal.timeout(timeout);
            const mergedSignal = AbortSignal.any([
                exclusiveAbortController.signal,
                timeoutSignal,
            ]);

            return fetchClient(endpoint, { signal: mergedSignal })
                .then((response) => {
                    if (response.ok) return response.text();
                    throw new Error(`Failed to fetch ${ipVersion} address.`);
                })
                .then((ip) => {
                    exclusiveAbortController.abort(
                        "Request aborted due to other successful request"
                    );
                    return { ip, endpoint };
                })
                .catch((error) => {
                    if (timeoutSignal.aborted) {
                        logging.info(
                            `${endpoint} aborted: ${timeoutSignal.reason}`
                        );
                    } else if (exclusiveAbortController.signal.aborted) {
                        logging.info(
                            `${endpoint} aborted: ${exclusiveAbortController.signal.reason}`
                        );
                    } else {
                        logging.warn(`${endpoint} failed: ${error}`);
                    }
                    throw error;
                });
        });

        Promise.any(tasks)
            .then((res) => {
                set(() => ({
                    [ipVersion]: {
                        value: res.ip,
                        refreshing: false,
                    },
                }));
                logging.info(
                    `Fetched ${ipVersion} address ${res.ip} from ${res.endpoint}`
                );
            })
            .catch((err) => {
                set(() => ({
                    [ipVersion]: {
                        value: "",
                        refreshing: false,
                    },
                }));
                logging.error(
                    `Failed to fetch ${ipVersion} address: ${
                        err.name === "AggregateError"
                            ? "All requests failed"
                            : err
                    }`
                );
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
