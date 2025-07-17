
export const NotificationStatus = {
  Default: "default",
  Granted: "granted",
  Denied: "denied"
} as const;

export type NotificationStatus = typeof NotificationStatus[keyof typeof NotificationStatus];
