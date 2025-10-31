import { GetOccasionRequest, GetOccasionsResponse } from "../../types/occasion";
import apiClient from "../api/apiClient";

export const GetOccasionsAPI = async (params: GetOccasionRequest): Promise<GetOccasionsResponse> => {
    const response = await apiClient.get<GetOccasionsResponse>("/occasions", { params });
    return response.data;
}