import { useRouteError } from "react-router-dom";

import logging from "./utils/log";

export default function AppError() {
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
