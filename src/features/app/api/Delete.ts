import { WebDelete } from "./apiClient"


export async function RemoveFavorite(userId: string, catalogId: number): Promise<boolean> {
    const response = await WebDelete<number>(["favorites", userId], catalogId)
    return response.status === 200
}