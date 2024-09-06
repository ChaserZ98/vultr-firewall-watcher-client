import { lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";

const App = lazy(() => import("../App.tsx"));
const Home = lazy(() => import("@pages/Home.tsx"));
const Settings = lazy(() => import("@pages/Settings.tsx"));

export default function Router() {
    const routes = useRoutes([
        {
            path: "/",
            element: <App />,
            children: [
                {
                    path: "/",
                    element: <Home />,
                },
                {
                    path: "/settings",
                    element: <Settings />,
                },
            ],
        },
        {
            path: "*",
            element: <Navigate to="/404" replace />,
        },
    ]);
    return routes;
}
