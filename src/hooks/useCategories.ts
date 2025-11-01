import { useState, useCallback } from "react";
import { GetParentCategory, GetCategoryByParentId } from "../services/endpoint/category";
import { Category } from "../types/category";

export const useCategories = () => {
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [childCategories, setChildCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingChildren, setIsLoadingChildren] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchParentCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const param = {
        pageIndex: 0,
        pageSize: 0,
        takeAll: true,
        search: "",
      };
      const response = await GetParentCategory(param);

      if (response.statusCode === 200 && response.data?.data) {
        setParentCategories(response.data.data);
      } else {
        setParentCategories([]);
        setError("Failed to load parent categories");
      }
    } catch (err: any) {
      console.error("Error loading parent categories:", err);
      setError(err.message || "Failed to load parent categories");
      setParentCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchChildCategories = useCallback(async (parentId: number) => {
    setIsLoadingChildren(true);
    setError(null);
    try {
      const response = await GetCategoryByParentId({
        parentId,
        pageIndex: 0,
        pageSize: 0,
        takeAll: true,
        search: "",
      });

      if (response.statusCode === 200 && response.data?.data) {
        setChildCategories(response.data.data);
        return response.data.data;
      } else {
        setChildCategories([]);
        setError("Failed to load child categories");
        return [];
      }
    } catch (err: any) {
      console.error("Error loading child categories:", err);
      setError(err.message || "Failed to load child categories");
      setChildCategories([]);
      return [];
    } finally {
      setIsLoadingChildren(false);
    }
  }, []);

  return {
    parentCategories,
    childCategories,
    isLoading,
    isLoadingChildren,
    error,
    fetchParentCategories,
    fetchChildCategories,
  };
};
