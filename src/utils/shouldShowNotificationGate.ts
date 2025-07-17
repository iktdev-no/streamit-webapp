import { notificationStorage } from "../features/app/useStorage";
import type { NotificationStatus } from "../types/notification";

export function shouldShowNotificationGate(): boolean {
  const stored = notificationStorage.get();
  const current = Notification.permission as NotificationStatus;

  if (!stored) return true; // aldri spurt
  if (stored !== current) return true; // mismatch
  if (stored === "default") return true; // default state

  return false; // alt OK
}

