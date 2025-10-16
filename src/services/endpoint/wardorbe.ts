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
  formData.append('file', data.file as any);
  
  const response = await apiClient.post<SummaryItemResponse>("/items/summary", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}