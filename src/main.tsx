import "@css/tailwind.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import BaseRouter from "./routes/index";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <BaseRouter />
        </BrowserRouter>
    </React.StrictMode>
);
