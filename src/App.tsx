import { Outlet } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import TauriTitleBar from "./components/TauriTitleBar";
import AppContextProviders from "./hooks/providers";

export default function App() {
    return (
        <AppContextProviders>
            <div className="flex flex-col w-full h-screen">
                <div className="w-full sticky top-0">
                    <TauriTitleBar />
                    <Navbar />
                </div>
                <div className="flex-1 overflow-auto ">
                    <Outlet />
                </div>
                <ToastContainer position="bottom-left" theme="dark" />
            </div>
        </AppContextProviders>
    );
}
