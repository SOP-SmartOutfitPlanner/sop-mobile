import { AddItemRequest, AddItemResponse, GetItemResponse, Item, SummaryItemRequest, SummaryItemResponse } from "../../types/item";
import apiClient from "../api/apiClient";

export const AddItem = async (data: AddItemRequest): Promise<AddItemResponse> => {
  try {
    console.log("=== AddItem API Call ===");
    console.log("Request URL: /items");
    console.log("Request Data:", JSON.stringify(data, null, 2));
    
    const response = await apiClient.post<AddItemResponse>("/items", data);
    
    console.log("=== AddItem Success ===");
    console.log("Response:", JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error: any) {
    console.error("=== AddItem API Error ===");
    console.error("Error Message:", error.message);
    console.error("Error Response:", JSON.stringify(error.response?.data, null, 2));
    console.error("Error Status:", error.response?.status);
    console.error("Request Data:", JSON.stringify(data, null, 2));
    throw error;
  }
}
export const GetItem = async (data: {pageIndex: number, pageSize: number, userId: number}): Promise<GetItemResponse> => {
  const response = await apiClient.get<GetItemResponse>(`/items/user/${data.userId}`, {params: data});
  return response.data;
}

export const SummaryItem = async (data: SummaryItemRequest): Promise<SummaryItemResponse> => {
  const formData = new FormData();
  formData.append('file', data.file as any);
  
  const response = await apiClient.post<SummaryItemResponse>("/items/summary", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}