
export interface Heartbeat {
    status: boolean;
    time: number
}

export interface FcmPayload {
  data?: {
    [key: string]: string;
  };
}
