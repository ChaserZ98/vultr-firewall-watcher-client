import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import { Spinner } from "@nextui-org/react";

import { AppErrorElement } from "@/App.tsx";

const App = lazy(() =>
    import("@/App.tsx").then((module) => ({ default: module.App }))
);
const Home = lazy(() => import("@/pages/Home.tsx"));
const Settings = lazy(() => import("@/pages/Settings.tsx"));
const MyIP = lazy(() => import("@/pages/MyIP.tsx"));

const Rules = lazy(() => import("@/pages/Rules.tsx"));

const Loading = ({ children }: { children: React.ReactNode }) => (
    <Suspense
        fallback={
            <div className="w-full h-full flex flex-col items-center justify-center">
                <Spinner label="Loading..." />
            </div>
        }
    >
        {children}
    </Suspense>
);

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <Loading>
                <App />
            </Loading>
        ),
        errorElement: <AppErrorElement />,
        children: [
            {
                path: "/",
                element: (
                    <Loading>
                        <Home />
                    </Loading>
                ),
            },
            {
                path: "/groups/:id",
                element: (
                    <Loading>
                        <Rules />
                    </Loading>
                ),
            },
            {
                path: "/my-ip",
                element: (
                    <Loading>
                        <MyIP />
                    </Loading>
                ),
            },
            {
                path: "/settings",
                element: (
                    <Loading>
                        <Settings />
                    </Loading>
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
