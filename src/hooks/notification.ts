import {
    isPermissionGranted,
    requestPermission,
    sendNotification,
} from "@tauri-apps/plugin-notification";

type Content = string | { title: string; body: string };

export default async function tauriNotify(content: Content) {
    let permissionGranted = await isPermissionGranted();
    if (!permissionGranted) {
        const permission = await requestPermission();
        permissionGranted = permission === "granted";
    }
    if (permissionGranted) {
        sendNotification(content);
    }
}
