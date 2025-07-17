// src/hooks/useNotificationPermission.ts
import { useState } from "react";
import type { NotificationStatus } from "../../../types/notification";
import { notificationStorage } from "../useStorage";


export function useNotificationPermission() {
  const [status, setStatus] = useState<NotificationStatus>(() => {
    return notificationStorage.get();
  });

  const requestPermission = async (): Promise<NotificationStatus> => {
    const result = await Notification.requestPermission();
    const updatedStatus = result as NotificationStatus;
    console.log("Notification permission status:", updatedStatus);
    notificationStorage.set(updatedStatus);
    setStatus(updatedStatus);
    return updatedStatus; // 🔥 Returner den ferske statusen!
  };

  return { status, requestPermission };
}
