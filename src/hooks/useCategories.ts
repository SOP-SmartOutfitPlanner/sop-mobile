import { useState, useEffect, useCallback } from "react";
import { GetCategory } from "../services/endpoint/category";
import { Category } from "../types/category";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await GetCategory({
        pageIndex: 1,
        pageSize: 20,
      });

      if (response.statusCode === 200 && response.data?.data) {
        setCategories(response.data.data);
      } else {
        setCategories([]);
        setError("Failed to load categories");
      }
    } catch (err: any) {
      console.error("Error loading categories:", err);
      setError(err.message || "Failed to load categories");
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    isLoading,
    error,
    refetch: fetchCategories,
  };
};
