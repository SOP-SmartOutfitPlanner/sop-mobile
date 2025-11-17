import { 
CreateOutfitRequest, 
CreateOutfitResponse, 
DeleteOutfitResponse,
GetOutfitResponse, 
GetOutfitsFavoriteResponse, 
GetOutfitsRequest, 
GetOutfitsResponse, } from "../../types/outfit";
import apiClient from "../api/apiClient";

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

export const SaveFavoriteOutfitAPI = async(id: number): Promise<GetOutfitsFavoriteResponse> => {
    const response = await apiClient.put<GetOutfitsFavoriteResponse>(`/outfits/${id}/favorite`);
    return response.data;
}

export const DeleteOutfitAPI = async(id: number): Promise<DeleteOutfitResponse> => {
    const response = await apiClient.delete<DeleteOutfitResponse>(`/outfits/${id}`);
    return response.data;
}