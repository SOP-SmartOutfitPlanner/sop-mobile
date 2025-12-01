import { GetOccasionRequest, GetOccasionsResponse } from "../../types/occasion";
import apiClient from "../api/apiClient";

export const GetOccasionsAPI = async (data: GetOccasionRequest): Promise<GetOccasionsResponse> => {
    const params: Record<string, string | number | boolean> = {
        "page-index": data.pageIndex,
        "page-size": data.pageSize,
        "take-all": data.takeAll,
    };

    if (data.search) {
        params["search"] = data.search;
    }

    const response = await apiClient.get<GetOccasionsResponse>("/occasions", { params });
    return response.data;
}