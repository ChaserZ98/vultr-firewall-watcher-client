import { create, type StoreApi } from "zustand";

export enum Screen {
    SM = "sm",
    MD = "md",
    LG = "lg",
    XL = "xl",
    XXL = "2xl",
}
type State = {
    size: Screen;
};

type Action = {
    addEventListener: () => () => void;
};

// const xsQuery = window.matchMedia("(max-width: 639px)");
const smQuery = window.matchMedia("(max-width: 767px)");
const mdQuery = window.matchMedia("(min-width: 768px) and (max-width: 1023px)");
const lgQuery = window.matchMedia(
    "(min-width: 1024px) and (max-width: 1279px)"
);
const xlQuery = window.matchMedia(
    "(min-width: 1280px) and (max-width: 1535px)"
);
const xxlQuery = window.matchMedia("(min-width: 1536px)");

function addEventListener(set: StoreApi<State>["setState"]) {
    return () => () => {
        const smQueryFunction = (e: MediaQueryListEvent) => {
            e.matches && set({ size: Screen.SM });
        };
        const mdQueryFunction = (e: MediaQueryListEvent) => {
            e.matches && set({ size: Screen.MD });
        };
        const lgQueryFunction = (e: MediaQueryListEvent) => {
            e.matches && set({ size: Screen.LG });
        };
        const xlQueryFunction = (e: MediaQueryListEvent) => {
            e.matches && set({ size: Screen.XL });
        };
        const xxlQueryFunction = (e: MediaQueryListEvent) => {
            e.matches && set({ size: Screen.XXL });
        };

        smQuery.addEventListener("change", (e) => smQueryFunction(e));
        mdQuery.addEventListener("change", (e) => mdQueryFunction(e));
        lgQuery.addEventListener("change", (e) => lgQueryFunction(e));
        xlQuery.addEventListener("change", (e) => xlQueryFunction(e));
        xxlQuery.addEventListener("change", (e) => xxlQueryFunction(e));

        return () => {
            smQuery.removeEventListener("change", (e) => smQueryFunction(e));
            mdQuery.removeEventListener("change", (e) => mdQueryFunction(e));
            lgQuery.removeEventListener("change", (e) => lgQueryFunction(e));
            xlQuery.removeEventListener("change", (e) => xlQueryFunction(e));
            xxlQuery.removeEventListener("change", (e) => xxlQueryFunction(e));
        };
    };
}

export const useScreenStore = create<State & Action>()((set) => ({
    size: smQuery.matches
        ? Screen.SM
        : mdQuery.matches
        ? Screen.MD
        : lgQuery.matches
        ? Screen.LG
        : xlQuery.matches
        ? Screen.XL
        : Screen.XXL,
    addEventListener: addEventListener(set),
}));
