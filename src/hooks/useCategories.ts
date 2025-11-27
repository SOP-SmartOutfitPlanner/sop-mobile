import { useState, useCallback, useRef, useEffect } from "react";
import { GetParentCategory, GetCategoryByParentId } from "../services/endpoint/category";
import { Category } from "../types/category";

let parentCategoryCache: Category[] | null = null;
let parentCategoriesPromise: Promise<Category[]> | null = null;
const childCategoryCache: Record<number, Category[]> = {};
const childCategoryPromises: Record<number, Promise<Category[]>> = {};

export const useCategories = () => {
  const [parentCategories, setParentCategories] = useState<Category[]>(parentCategoryCache ?? []);
  const [childCategories, setChildCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(!parentCategoryCache);
  const [isLoadingChildren, setIsLoadingChildren] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchParentCategories = useCallback(async () => {
    if (parentCategoryCache) {
      setParentCategories(parentCategoryCache);
      return parentCategoryCache;
    }

    setIsLoading(true);
    setError(null);
    try {
      if (!parentCategoriesPromise) {
        parentCategoriesPromise = GetParentCategory({
          pageIndex: 0,
          pageSize: 0,
          takeAll: true,
          search: "",
        }).then((response) => {
          if (response.statusCode === 200 && response.data?.data) {
            parentCategoryCache = response.data.data;
            return response.data.data;
          }
          throw new Error("Failed to load parent categories");
        }).finally(() => {
          parentCategoriesPromise = null;
        });
      }

      const data = await parentCategoriesPromise;
      if (isMountedRef.current) {
        setParentCategories(data);
      }
      return data;
    } catch (err: any) {
      if (isMountedRef.current) {
        console.error("Error loading parent categories:", err);
        setError(err.message || "Failed to load parent categories");
        setParentCategories([]);
      }
      return [];
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  const fetchChildCategories = useCallback(async (parentId: number) => {
    if (childCategoryCache[parentId]) {
      setChildCategories(childCategoryCache[parentId]);
      return childCategoryCache[parentId];
    }

    setIsLoadingChildren(true);
    setError(null);
    try {
      if (!childCategoryPromises[parentId]) {
        childCategoryPromises[parentId] = GetCategoryByParentId({
          parentId,
          pageIndex: 0,
          pageSize: 0,
          takeAll: true,
          search: "",
        }).then((response) => {
          if (response.statusCode === 200 && response.data?.data) {
            childCategoryCache[parentId] = response.data.data;
            return response.data.data;
          }
          throw new Error("Failed to load child categories");
        }).finally(() => {
          delete childCategoryPromises[parentId];
        });
      }

      const data = await childCategoryPromises[parentId];
      if (isMountedRef.current) {
        setChildCategories(data);
      }
      return data;
    } catch (err: any) {
      if (isMountedRef.current) {
        console.error("Error loading child categories:", err);
        setError(err.message || "Failed to load child categories");
        setChildCategories([]);
      }
      return [];
    } finally {
      if (isMountedRef.current) {
        setIsLoadingChildren(false);
      }
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
