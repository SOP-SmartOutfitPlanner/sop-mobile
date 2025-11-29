import { 
CreateOutfitRequest, 
CreateOutfitResponse, 
DeleteOutfitResponse,
EditOutfitResponse,
GetOutfitResponse, 
GetOutfitsFavoriteResponse, 
GetOutfitsRequest, 
GetOutfitsResponse,
OutfitSuggestionResponse, } from "../../types/outfit";
import apiClient, { getAccessToken } from "../api/apiClient";

export const GetOutFitsAPI = async(data: GetOutfitsRequest): Promise<GetOutfitsResponse> => {
    const response = await apiClient.get<GetOutfitsResponse>("/outfits/user", { params: data });
    return response.data;
}
export const GetOutFitAPI = async(id: number): Promise<GetOutfitResponse> => {
    const response = await apiClient.get<GetOutfitResponse>(`/outfits/${id}`);
    return response.data;
}

export const CreateOutfitAPI = async(data: CreateOutfitRequest): Promise<CreateOutfitResponse> => {
    const response = await apiClient.post<CreateOutfitResponse>("/outfits", data);
    return response.data;
}

export const EditOutfitAPI = async(id: number, data: Partial<CreateOutfitRequest>): Promise<EditOutfitResponse> => {
    const response = await apiClient.put<EditOutfitResponse>(`/outfits/${id}`, data);
    return response.data;
}
export const SaveFavoriteOutfitAPI = async(id: number): Promise<GetOutfitsFavoriteResponse> => {
    const response = await apiClient.put<GetOutfitsFavoriteResponse>(`/outfits/${id}/favorite`);
    return response.data;
}

export const DeleteOutfitAPI = async(id: number): Promise<DeleteOutfitResponse> => {
    const response = await apiClient.delete<DeleteOutfitResponse>(`/outfits/${id}`);
    return response.data;
}

export const GetOutfitSuggestionAPI = async(weather: string, userId: number): Promise<OutfitSuggestionResponse> => {
    const params = { weather, userId };
    console.log("📤 [API] GET /outfits/suggestion - Params:", JSON.stringify(params, null, 2));
    
    // Check token before making request
    const token = await getAccessToken();
    console.log("🔑 [API] Access Token exists:", !!token);
    if (token) {
        console.log("🔑 [API] Token preview:", token.substring(0, 20) + "...");
    }
    
    try {
        const response = await apiClient.get<OutfitSuggestionResponse>("/outfits/suggestion", {
            params
        });
        
        console.log("📥 [API] GET /outfits/suggestion - Response:", {
            statusCode: response.data?.statusCode,
            message: response.data?.message,
            hasData: !!response.data?.data,
            itemsCount: response.data?.data?.suggestedItems?.length || 0,
        });
        
        return response.data;
    } catch (error: any) {
        const errorDetails = {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            serverMessage: error.response?.data?.message || error.response?.data?.data?.message,
            url: error.config?.url,
            params: error.config?.params,
        };
        console.error("❌ [API] GET /outfits/suggestion - Error Details:", errorDetails);
        
        // Log subscription limit error specifically
        if (error.response?.data?.data?.message?.includes("Subscription limit")) {
            console.warn("⚠️ [API] Subscription limit reached - User needs to upgrade");
        }
        
        throw error;
    }
}