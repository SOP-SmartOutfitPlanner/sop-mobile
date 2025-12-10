import { 
CreateOutfitRequest, 
CreateOutfitResponse, 
DeleteOutfitResponse,
EditOutfitResponse,
GetOutfitResponse, 
GetOutfitsFavoriteResponse, 
GetOutfitsRequest, 
GetOutfitsResponse,
OutfitSuggestionResponse,
OutfitSuggestionV2Response,
MassCreateOutfitRequest,
MassCreateOutfitResponse, } from "../../types/outfit";
import apiClient, { getAccessToken } from "../api/apiClient";

export const GetOutFitsAPI = async(data: GetOutfitsRequest): Promise<GetOutfitsResponse> => {
    const params: Record<string, string | number | boolean> = {
        'page-index': data.pageIndex,
        'page-size': data.pageSize,
      };
    
    if (data.searchTerm !== undefined) {
        params['search'] = data.searchTerm;
    }
    if (data.isFavorite !== undefined) {
        params['is-favorite'] = data.isFavorite;
    }
    if (data.isSaved !== undefined) {
        params['is-saved'] = data.isSaved;
    }
    
    const response = await apiClient.get<GetOutfitsResponse>("/outfits/user", { params });
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
    
    try {
        const response = await apiClient.get<OutfitSuggestionResponse>("/outfits/suggestion", {
            params
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

/**
 * Get AI outfit suggestion V2 - Returns multiple outfit options
 * @param userId - User ID
 * @param totalOutfit - Number of outfit suggestions to generate (1-4)
 * @param occasionId - Optional occasion ID for filtering suggestions
 * @param weather - Optional weather string (format: "description, Temperature: X°C, Feels like: Y°C")
 * @param gapDay - Optional number of days to avoid recently worn items (0-14)
 * @param targetDate - Optional target date for the outfit suggestion (format: yyyy-MM-dd)
 * @param userOccasionId - Optional user's specific occasion/event ID
 * @returns Promise with array of suggested outfits
 */
export const GetOutfitSuggestionV2API = async(
    userId: number,
    totalOutfit: number,
    occasionId?: number,
    weather?: string,
    gapDay?: number,
    targetDate?: string,
    userOccasionId?: number
): Promise<OutfitSuggestionV2Response> => {
    const params: Record<string, string | number> = {
        userId,
        totalOutfit,
    };

    if (occasionId !== undefined) {
        params.occasionId = occasionId;
    }

    if (weather) {
        params.weather = weather;
    }

    if (gapDay !== undefined) {
        params.gapDay = gapDay;
    }

    if (targetDate) {
        params.targetDate = targetDate;
    }

    if (userOccasionId !== undefined) {
        params.userOccasionId = userOccasionId;
    }

    try {
        const response = await apiClient.get<OutfitSuggestionV2Response>("/outfits/suggestionV2", {
            params,
            timeout: 120000, // 120 seconds timeout for V2 API
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
        console.error("❌ [API] GET /outfits/suggestionV2 - Error Details:", errorDetails);
        
        // Log subscription limit error specifically
        if (error.response?.data?.data?.message?.includes("Subscription limit")) {
            console.warn("⚠️ [API] Subscription limit reached - User needs to upgrade");
        }
        
        throw error;
    }
}

/**
 * Mass create multiple outfits at once
 * @param data - Array of outfit creation data
 * @returns Promise with mass creation results
 */
export const MassCreateOutfitsAPI = async(
    data: MassCreateOutfitRequest
): Promise<MassCreateOutfitResponse> => {
    try {
        const response = await apiClient.post<MassCreateOutfitResponse>("/outfits/mass", {
            outfits: data.outfits,
        });
        
        return response.data;
    } catch (error: any) {
        const errorDetails = {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            serverMessage: error.response?.data?.message || error.response?.data?.data?.message,
        };
        console.error("❌ [API] POST /outfits/mass - Error Details:", errorDetails);
        
        throw error;
    }
}