import { getUserId } from './../services/api/apiClient';
import { useState, useEffect, useCallback } from "react";
import { EditItemAPI, GetItem, DeleteItemAPI } from "../services/endpoint/wardorbe";
import { Item, ItemEdit } from "../types/item";

export const useWardrobe = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>();
  const [selectedSeasonId, setSelectedSeasonId] = useState<number | undefined>();
  const [selectedStyleId, setSelectedStyleId] = useState<number | undefined>();
  const [selectedOccasionId, setSelectedOccasionId] = useState<number | undefined>();
  const [isAnalyzedFilter, setIsAnalyzedFilter] = useState<boolean | undefined>();
  const [sortByDate, setSortByDate] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch items from API with filters and search
  const fetchItems = useCallback(async () => {
    try {
      const userId = await getUserId();
      
      if (!userId) {
        console.log("No userId found, clearing items");
        setItems([]); // Clear items when no user is logged in
        setLoading(false);
        return;
      }

      const response = await GetItem({
        pageIndex: 1,
        pageSize: 20,
        userId: parseInt(userId),
        takeAll: true,
        search: searchQuery || undefined,
        categoryId: selectedCategoryId,
        seasonId: selectedSeasonId,
        styleId: selectedStyleId,
        occasionId: selectedOccasionId,
        isAnalyzed: isAnalyzedFilter,
        sortByDate: sortByDate,
      });

      if (response.statusCode === 200 && response.data?.data) {
        setItems(response.data.data);
        setError(null);
        console.log("✅ Fetched items:", response.data.data.length);
      }
    } catch (err: any) {
      console.error("❌ Error fetching wardrobe items:", err);
      setError(err.message || "Failed to fetch items");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategoryId, selectedSeasonId, selectedStyleId, selectedOccasionId, isAnalyzedFilter, sortByDate]);

  // Initial load and refetch when filters change
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Filter functions
  const setCategoryFilter = useCallback((categoryId?: number) => {
    setSelectedCategoryId(categoryId);
  }, []);

  const setSeasonFilter = useCallback((seasonId?: number) => {
    setSelectedSeasonId(seasonId);
  }, []);

  const setStyleFilter = useCallback((styleId?: number) => {
    setSelectedStyleId(styleId);
  }, []);

  const setOccasionFilter = useCallback((occasionId?: number) => {
    setSelectedOccasionId(occasionId);
  }, []);

  const setAnalyzedFilter = useCallback((isAnalyzed?: boolean) => {
    setIsAnalyzedFilter(isAnalyzed);
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedCategoryId(undefined);
    setSelectedSeasonId(undefined);
    setSelectedStyleId(undefined);
    setSelectedOccasionId(undefined);
    setIsAnalyzedFilter(undefined);
    setSortByDate(undefined);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchItems();
    setIsRefreshing(false);
  };

  // Edit item function
  const editItem = useCallback(async (id: number, data: Partial<ItemEdit>) => {
    try {
      const response = await EditItemAPI(id, data);
      
      // Update local state with edited item
      setItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? { ...item, ...response } : item
        )
      );
      
      return response;
    } catch (error) {
      console.error("❌ Error editing item:", error);
      throw error;
    }
  }, []);

  // Delete item function
  const deleteItem = useCallback(async (id: number) => {
    try {
      await DeleteItemAPI(id);
      
      // Remove item from local state
      setItems(prevItems => prevItems.filter(item => item.id !== id));
      
      console.log("✅ Item deleted successfully");
    } catch (error) {
      console.error("❌ Error deleting item:", error);
      throw error;
    }
  }, []);

  return {
    items,
    searchQuery,
    setSearchQuery,
    selectedCategoryId,
    selectedSeasonId,
    selectedStyleId,
    selectedOccasionId,
    isAnalyzedFilter,
    sortByDate,
    setCategoryFilter,
    setSeasonFilter,
    setStyleFilter,
    setOccasionFilter,
    setAnalyzedFilter,
    setSortByDate,
    clearFilters,
    loading,
    isRefreshing,
    handleRefresh,
    error,
    refetch: fetchItems,
    editItem,
    deleteItem,
  };
};