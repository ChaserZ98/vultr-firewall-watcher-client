import { produce } from "immer";
import { toast } from "react-toastify";
import { StoreApi } from "zustand";

import { Version as IPVersion } from "../ip";
import { type FirewallState } from "./firewall";
import {
    initialNewRuleIPv4,
    initialNewRuleIPv6,
    NewRuleState,
    RulesMeta,
    RuleState,
} from "./rules";

import logging from "@/utils/log";

const endpoint = new URL("https://api.vultr.com/v2/firewalls");

type GroupInfo = {
    id: string;
    description: string;
    date_created: string;
    date_modified: string;
    instance_count: number;
    rule_count: number;
    max_rule_count: number;
};

const initialGroupInfo = {
    id: "",
    description: "",
    date_created: "",
    date_modified: "",
    instance_count: 0,
    rule_count: 0,
    max_rule_count: 0,
};

export type GroupState = GroupInfo & {
    deleting: boolean;
    refreshing: boolean;
    newRule: Record<IPVersion, NewRuleState>;
    rules: Record<number, RuleState>;
    meta: RulesMeta | undefined | null;
};

export const initialGroupState: GroupState = {
    ...initialGroupInfo,
    deleting: false,
    refreshing: false,
    newRule: {
        [IPVersion.V4]: initialNewRuleIPv4,
        [IPVersion.V6]: initialNewRuleIPv6,
    },
    rules: {},
    meta: undefined,
};

export type GroupsMeta = {
    links: {
        prev: string;
        next: string;
    };
    total: number;
};

export type GroupsAction = {
    refreshGroups: (
        apiToken: string,
        fetchClient: typeof fetch,
        timeout?: number
    ) => void;
    deleteGroupById: (
        id: string,
        apiToken: string,
        fetchClient: typeof fetch,
        timeout?: number
    ) => void;
};

function refreshGroups(
    set: StoreApi<FirewallState>["setState"]
): GroupsAction["refreshGroups"] {
    return (apiToken, fetchClient, timeout = 5000) => {
        logging.info(`Fetching firewall groups.`);
        set(() => ({ refreshing: true }));

        const timeoutSignal = AbortSignal.timeout(timeout);
        fetchClient(endpoint, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${apiToken}`,
            },
            signal: timeoutSignal,
        })
            .then(async (res) => {
                return {
                    status: res.status,
                    statusText: res.statusText,
                    data: await res.json(),
                };
            })
            .then((res) => {
                if (res.status < 400) {
                    const firewall_groups: GroupInfo[] =
                        res.data.firewall_groups;
                    logging.info(
                        `Successfully fetched ${res.data.meta.total} firewall groups.`
                    );
                    set((state) => {
                        return {
                            meta: res.data.meta,
                            groups: firewall_groups.reduce((acc, group) => {
                                acc[group.id] =
                                    group.id in state.groups &&
                                    state.groups[group.id].date_modified ===
                                        group.date_modified
                                        ? state.groups[group.id]
                                        : {
                                              ...initialGroupState,
                                              ...group,
                                          };
                                return acc;
                            }, {} as Record<string, GroupState>),
                        };
                    });
                } else if (res.status < 500)
                    throw new Error(
                        `${res.data.error ? res.data.error : res.statusText}`
                    );
                else throw new Error(`${res.status} ${res.statusText}`);
            })
            .catch((err: Error) => {
                if (timeoutSignal.aborted) {
                    logging.warn(
                        `Failed to fetch firewall groups: ${timeoutSignal.reason}`
                    );
                } else {
                    logging.error(`Failed to fetch firewall groups: ${err}`);
                }
                toast.error(
                    `Failed to fetch firewall groups: ${
                        timeoutSignal.aborted
                            ? timeoutSignal.reason.message
                            : err.message
                    }`
                );

                set(() => ({ groups: {}, meta: null }));
            })
            .finally(() => set(() => ({ refreshing: false })));
    };
}

function deleteGroupById(
    set: StoreApi<FirewallState>["setState"]
): GroupsAction["deleteGroupById"] {
    return (id, apiToken, fetchClient, timeout = 5000) => {
        logging.info(`Deleting group with ID ${id}.`);
        set(
            produce((state: FirewallState) => {
                state.groups[id].deleting = true;
            })
        );
        const timeoutSignal = AbortSignal.timeout(timeout);
        fetchClient(new URL(`${endpoint}/${id}`), {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${apiToken}`,
            },
            signal: timeoutSignal,
        })
            .then(async (res) => {
                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(
                        `Failed to delete firewall group: ${res.status} ${
                            data.error ? data.error : res.statusText
                        }`
                    );
                }
                set(
                    produce((state: FirewallState) => {
                        delete state.groups[id];
                    })
                );
                logging.info(`Successfully deleted group with ID ${id}`);
                toast.success(`Successfully deleted group with ID ${id}`);
            })
            .catch((err: Error) => {
                if (timeoutSignal.aborted) {
                    logging.error(
                        `Failed to delete group: ${timeoutSignal.reason}`
                    );
                    toast.error(
                        `Failed to delete group: ${timeoutSignal.reason.message}`
                    );
                } else {
                    logging.error(`${err}`);
                    toast.error(err.message);
                }
                set(
                    produce((state: FirewallState) => {
                        state.groups[id].deleting = false;
                    })
                );
            });
    };
}

export const groupsAction = {
    refreshGroups,
    deleteGroupById,
};
