import { WebPut } from "./apiClient";


export async function AddFavorite(userId: string, catalogId: number): Promise<boolean> {
    const response = await WebPut<number>(["favorites", userId], catalogId)
    return response.status === 200
}