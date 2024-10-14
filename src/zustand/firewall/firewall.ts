import { create } from "zustand";

import {
    groupsAction,
    type GroupsAction,
    type GroupsMeta,
    type GroupState,
} from "./groups";
import { rulesAction, type RulesAction } from "./rules";

export type FirewallState = {
    groups: Record<string, GroupState>;
    meta: GroupsMeta | undefined | null; // undefined -> not fetched, null -> failed to fetch
    refreshing: boolean;
};

const initialState: FirewallState = {
    groups: {},
    meta: undefined,
    refreshing: false,
};

type FirewallAction = GroupsAction & RulesAction;

export const useFirewallStore = create<FirewallState & FirewallAction>(
    (set) => ({
        ...initialState,
        refreshGroups: groupsAction.refreshGroups(set),
        deleteGroupById: groupsAction.deleteGroupById(set),
        setNewRule: rulesAction.setNewRule(set),
        refreshRules: rulesAction.refreshRules(set),
        deleteRuleById: rulesAction.deleteRuleById(set),
        createRule: rulesAction.createRule(set),
    })
);
