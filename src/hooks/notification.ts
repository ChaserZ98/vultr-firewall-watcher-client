import {
    isPermissionGranted,
    requestPermission,
    sendNotification,
} from "@tauri-apps/plugin-notification";

type param = string | { title: string; body: string };

export default async function tauriNotify(param: param) {
    let permissionGranted = await isPermissionGranted();
    if (!permissionGranted) {
        const permission = await requestPermission();
        permissionGranted = permission === "granted";
    }
    if (permissionGranted) {
        sendNotification(param);
    }
}
