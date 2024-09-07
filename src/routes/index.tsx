import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import { Spinner } from "@nextui-org/react";

const App = lazy(() => import("../App.tsx"));
const Home = lazy(() => import("@pages/Home.tsx"));
const Settings = lazy(() => import("@pages/Settings.tsx"));

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <Suspense fallback={<Spinner />}>
                <App />
            </Suspense>
        ),
        children: [
            {
                path: "/",
                element: (
                    <Suspense fallback={<Spinner />}>
                        <Home />
                    </Suspense>
                ),
            },
            {
                path: "/settings",
                element: (
                    <Suspense
                        fallback={
                            <div className="w-full h-full flex flex-col items-center justify-center">
                                <Spinner label="Loading..." />
                            </div>
                        }
                    >
                        <Settings />
                    </Suspense>
                ),
            },
        ],
    },
    {
        path: "*",
        element: <Navigate to="/404" replace />,
    },
]);

export default router;
