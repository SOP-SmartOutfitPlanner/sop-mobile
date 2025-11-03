import { 
CreateOutfitRequest, 
CreateOutfitResponse, 
GetOutfitsFavoriteResponse, 
GetOutfitsRequest, 
GetOutfitsResponse, } from "../../types/outfit";
import apiClient from "../api/apiClient";

export const GetOutFitAPI = async(data: GetOutfitsRequest): Promise<GetOutfitsResponse> => {
    const response = await apiClient.get<GetOutfitsResponse>("/outfits/user", { params: data });
    return response.data;
}

export const CreateOutfitAPI = async(data: CreateOutfitRequest): Promise<CreateOutfitResponse> => {
    const response = await apiClient.post<CreateOutfitResponse>("/outfits", data);
    return response.data;
}

export const SaveFavoriteOutfitAPI = async(id: number): Promise<GetOutfitsFavoriteResponse> => {
    const response = await apiClient.put<GetOutfitsFavoriteResponse>(`/outfits/${id}/favorite`);
    return response.data;
}