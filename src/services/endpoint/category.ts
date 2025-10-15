import { GetCategoryRequest, GetCategoryResponse } from "../../types/category";
import apiClient from "../api/apiClient";

export const GetCategory = async (data: GetCategoryRequest): Promise<GetCategoryResponse> => {
  const response = await apiClient.get<GetCategoryResponse>("/categories", {params: data});
  return response.data;
}