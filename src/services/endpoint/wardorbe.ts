import { AddItemRequest, AddItemResponse, GetItemResponse, Item, SummaryItemRequest, SummaryItemResponse } from "../../types/item";
import apiClient from "../api/apiClient";

export const AddItem = async (data: AddItemRequest): Promise<AddItemResponse> => {
    const response = await apiClient.post<AddItemResponse>("/items", data);
    return response.data;
  }
export const GetItem = async (data: {pageIndex: number, pageSize: number, userId: number}): Promise<GetItemResponse> => {
  const response = await apiClient.get<GetItemResponse>(`/items/user/${data.userId}`, {params: data});
  return response.data;
}

export const SummaryItem = async (data: SummaryItemRequest): Promise<SummaryItemResponse> => {
  const formData = new FormData();
  
  // Log the file object being uploaded
  console.log("📤 SummaryItem - File object:", data.file);
  
  // Validate MIME type before upload
  const validMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const mimeType = data.file.type?.toLowerCase();
  
  if (!mimeType || !validMimeTypes.includes(mimeType)) {
    const error = `MIME type validation failed: "${data.file.type}" is not in allowed list: ${validMimeTypes.join(', ')}`;
    console.error("❌", error);
    throw new Error(error);
  }
  
  console.log("✅ MIME type valid:", mimeType);
  
  // Append file to FormData
  // @ts-ignore - FormData typing issue with React Native
  formData.append('file', data.file);
  
  const response = await apiClient.post<SummaryItemResponse>("/items/analysis", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  console.log("✅ SummaryItem response:", response.data);
  return response.data;
}