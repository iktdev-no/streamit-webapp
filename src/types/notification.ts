
export const NotificationStatus = {
  Default: "default",
  Granted: "granted",
  Denied: "denied"
} as const;

export type NotificationStatus = typeof NotificationStatus[keyof typeof NotificationStatus];


export interface AuthInitiateRequest {
  pin: string;
  deviceInfo: RequestDeviceInfo;
}

export interface RequestDeviceInfo {
  name: string;
  model: string;
  manufacturer: string;
  clientOrOsVersion: string;
  clientOrOsPlatform: string;
}

export interface RequestCreatedResponse {
  expiry: number
  sessionId: string
}