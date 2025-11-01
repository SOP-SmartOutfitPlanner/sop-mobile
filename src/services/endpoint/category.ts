import { GetCategoryByParentIdRequest, GetCategoryByParentIdResponse, GetCategoryRequest, GetCategoryResponse, getParentCategoriesRequest, getParentCategoriesResponse } from "../../types/category";
import apiClient from "../api/apiClient";

export const GetCategory = async (data: GetCategoryRequest): Promise<GetCategoryResponse> => {
  const response = await apiClient.get<GetCategoryResponse>("/categories", {params: data});
  return response.data;
}

export const GetParentCategory = async (data: getParentCategoriesRequest): Promise<getParentCategoriesResponse> => {
  const response = await apiClient.get<getParentCategoriesResponse>("/categories/root", {params: data});
  return response.data;
}

export const GetCategoryByParentId = async (params: GetCategoryByParentIdRequest): Promise<GetCategoryByParentIdResponse> => {
  const { parentId, ...queryParams } = params;
  const response = await apiClient.get<GetCategoryByParentIdResponse>(
    `/categories/parent/${parentId}`,
    { params: queryParams }
  );
  return response.data;
}