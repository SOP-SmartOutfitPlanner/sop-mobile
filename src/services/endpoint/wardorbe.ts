import { AddItemRequest, AddItemResponse, AnalyzeItemResponse, GetItemResponse, GetItemRequest, ItemEdit,  } from "../../types/item";
import apiClient from "../api/apiClient";

export const AddItem = async (data: AddItemRequest): Promise<AddItemResponse> => {
    const response = await apiClient.post<AddItemResponse>("/items", data);
    return response.data;
  }
const buildQueryParams = (data: GetItemRequest) => {
  const params: Record<string, any> = {};

  if (data.pageIndex !== undefined) params["page-index"] = data.pageIndex;
  if (data.pageSize !== undefined) params["page-size"] = data.pageSize;
  if (data.takeAll !== undefined) params["take-all"] = data.takeAll;
  if (data.search) params.search = data.search;
  if (data.isAnalyzed !== undefined) params.IsAnalyzed = data.isAnalyzed;
  if (data.categoryId !== undefined) params.CategoryId = data.categoryId;
  if (data.seasonId !== undefined) params.SeasonId = data.seasonId;
  if (data.styleId !== undefined) params.StyleId = data.styleId;
  if (data.occasionId !== undefined) params.OccasionId = data.occasionId;
  if (data.sortByDate) params.SortByDate = data.sortByDate;

  return params;
};

export const GetItems = async (data: GetItemRequest): Promise<GetItemResponse> => {
  const params = buildQueryParams(data);
  const response = await apiClient.get<GetItemResponse>(
    `/items/user/${data.userId}`,
    { params }
  );
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