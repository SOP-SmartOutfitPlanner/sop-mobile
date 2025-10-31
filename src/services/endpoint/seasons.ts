import { GetSeasonsRequest, GetSeasonsResponse } from "../../types/seasons";
import apiClient from "../api/apiClient";

export const GetSeasonsAPI = async (params: GetSeasonsRequest): Promise<GetSeasonsResponse> => {
    const response = await apiClient.get<GetSeasonsResponse>("/seasons", { params });
    return response.data;
}