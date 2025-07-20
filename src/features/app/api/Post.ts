import type { AuthInitiateRequest, RequestCreatedResponse } from "../../../types/notification";
import type { Profile } from "../../../types/profile";
import { getWebClientDeviceInfo } from "../../../utils/getWebDeviceInfo";
import { WebPost } from "./apiClient";


export async function InitMethodBasedDelegateRequest(serverAddress: string, method: string, pin: string): Promise<RequestCreatedResponse> {
    const deviceInfo = getWebClientDeviceInfo();
    const data : AuthInitiateRequest = {
        pin: pin,
        deviceInfo: deviceInfo,
    }
    console.log("InitMethodBasedDelegateRequest", serverAddress, method, data);
    const response = await WebPost<RequestCreatedResponse>(serverAddress, ["auth", "delegate", "request", method], data);
    return response.data;
}

export async function UpdateOrCreateProfile(data: Profile): Promise<boolean> {
    const response = await WebPost<string>(["user"], data)
    return response.status === 200
}