import { useEffect } from "react";
import { Outlet, useRouteError } from "react-router-dom";

import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import Navbar from "@/components/Navbar";
import TauriTitleBar from "@/components/TauriTitleBar";
import { useScreenStore } from "@/zustand/screen";
import checkCompatibility from "./utils/compatibility";

import logging from "./utils/log";

export function App() {
    const addScreenSizeListener = useScreenStore(
        (state) => state.addEventListener
    );
    useEffect(() => {
        checkCompatibility();
        const removeScreenSizeListener = addScreenSizeListener();
        return () => removeScreenSizeListener();
    }, []);
    return (
        <div className="flex flex-col w-full h-screen">
            <div className="w-full sticky top-0">
                <TauriTitleBar />
                <Navbar />
            </div>
            <div className="flex-1 overflow-auto ">
                <Outlet />
            </div>
            <ToastContainer
                position="bottom-left"
                theme="dark"
                className="select-none"
                toastClassName="!bg-default-200 transition-colors-opacity"
                bodyClassName="text-foreground transition-colors-opacity"
            />
        </div>
    );
}

export function AppErrorElement() {
    const error = useRouteError();
    let errorName = "Error";
    let message = "An error occurred while loading the page.";
    if (error instanceof Error) {
        errorName = error.name;
        message = error.message;
    }
    logging.error(`${error}`);
    return (
        <div className="w-full h-screen px-4 flex flex-col items-center justify-center gap-2">
            <h1 className="text-2xl sm:text-4xl sm:font-bold">{errorName}</h1>
            <p className="text-base text-center sm:text-lg">{message}</p>
        </div>
    );
}
