import { ProfileResponse } from "../../types/user";
import apiClient from "../api/apiClient";

export const getUserProfile = async (UserId: number): Promise<ProfileResponse> => {
    const response = await apiClient.get<ProfileResponse>(`/user/profile/${UserId}`);
    return response.data;
}