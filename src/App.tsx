import Navbar from "@components/Navbar";
import AppContextProviders from "@hooks/providers";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TauriTitleBar from "./components/TauriTitleBar";

export default function App() {
    return (
        <AppContextProviders>
            <div className="w-full h-screen">
                <TauriTitleBar />
                <Navbar />
                <ToastContainer position="bottom-left" theme="dark" />
                <Outlet />
            </div>
        </AppContextProviders>
    );
}
