import { AddItemRequest, AddItemResponse, AnalyzeItemResponse, GetItemResponse, ItemEdit,  } from "../../types/item";
import apiClient from "../api/apiClient";

export const AddItem = async (data: AddItemRequest): Promise<AddItemResponse> => {
    const response = await apiClient.post<AddItemResponse>("/items", data);
    return response.data;
  }
export const GetItem = async (data: {pageIndex: number, pageSize: number, userId: number}): Promise<GetItemResponse> => {
  const response = await apiClient.get<GetItemResponse>(`/items/user/${data.userId}`, {params: data});
  return response.data;
}

export const AnalysisItem = async (itemIds: number[]): Promise<AnalyzeItemResponse> => {
  const response = await apiClient.post<AnalyzeItemResponse>("/items/analysis/confirm", {itemIds});
  return response.data;
}
export const EditItemAPI = async (id: number, data: Partial<ItemEdit>): Promise<ItemEdit> => {
  const response = await apiClient.put<ItemEdit>(`/items/${id}`, data);
  return response.data;
}
export const DeleteItemAPI = async (id: number): Promise<void> => {
  await apiClient.delete<void>(`/items/${id}`);
}