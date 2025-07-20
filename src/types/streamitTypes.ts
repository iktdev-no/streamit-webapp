
export interface Heartbeat {
    status: boolean;
    time: number
}

export interface FcmPayload {
  data?: {
    [key: string]: string;
  };
}

export interface PfnsObject {
  pfnsReceiverId: string,
  pin: string
}