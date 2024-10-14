import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { NextUIProvider } from "@nextui-org/react";

import router from "@/routes/index";

import "@css/tailwind.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <NextUIProvider navigate={router.navigate}>
            <RouterProvider router={router} />
        </NextUIProvider>
    </React.StrictMode>
);
