import { getUserId } from './../services/api/apiClient';
import { useState, useEffect, useCallback } from "react";
import { EditItemAPI, GetItems, DeleteItemAPI } from "../services/endpoint/wardorbe";
import { Item, ItemEdit, PaginationMeta } from "../types/item";

interface UseWardrobeOptions {
  takeAll?: boolean;
  pageSize?: number;
}

export const useWardrobe = (options?: UseWardrobeOptions) => {
  const takeAll = options?.takeAll ?? true;
  const pageSize = options?.pageSize ?? 20;
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
  const [pageIndex, setPageIndex] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [metaData, setMetaData] = useState<PaginationMeta | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch items from API with filters and search
  const fetchItems = useCallback(async (page = 1, append = false) => {
    try {
      append ? setIsLoadingMore(true) : setLoading(true);

      const userId = await getUserId();
      
      if (!userId) {
        console.log("No userId found, clearing items");
        setItems([]); // Clear items when no user is logged in
        setLoading(false);
        setIsLoadingMore(false);
        return;
      }

      const response = await GetItems({
        pageIndex: page,
        pageSize,
        userId: parseInt(userId),
        takeAll,
        search: searchQuery || undefined,
        categoryId: selectedCategoryId,
        seasonId: selectedSeasonId,
        styleId: selectedStyleId,
        occasionId: selectedOccasionId,
        isAnalyzed: isAnalyzedFilter,
        sortByDate: sortByDate,
      });

      if (response.statusCode === 200 && response.data?.data) {
        const incomingItems = response.data.data;
        let appendedCount = incomingItems.length;

        setItems(prev => {
          if (!append) {
            return incomingItems;
          }

          const existingIds = new Set(prev.map(item => item.id));
          const newItems = incomingItems.filter(item => !existingIds.has(item.id));
          appendedCount = newItems.length;
          return newItems.length ? [...prev, ...newItems] : prev;
        });

        const meta = response.data.metaData;
        setMetaData(meta);

        setTotalCount(prevTotal =>
          meta?.totalCount ?? (append ? prevTotal + appendedCount : incomingItems.length)
        );

        setHasMorePages(Boolean(!takeAll && meta?.hasNext));
        setPageIndex(page);
        setError(null);
        console.log("✅ Fetched items:", incomingItems.length);
      }
    } catch (err: any) {
      console.error("❌ Error fetching wardrobe items:", err);
      setError(err.message || "Failed to fetch items");
      if (!append) {
        setItems([]);
      }
    } finally {
      append ? setIsLoadingMore(false) : setLoading(false);
    }
  }, [
    searchQuery,
    selectedCategoryId,
    selectedSeasonId,
    selectedStyleId,
    selectedOccasionId,
    isAnalyzedFilter,
    sortByDate,
    takeAll,
    pageSize,
  ]);

  // Initial load and refetch when filters change
  useEffect(() => {
    setPageIndex(1);
    fetchItems(1, false);
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
    setPageIndex(1);
    setItems([]);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setPageIndex(1);
    await fetchItems(1, false);
    setIsRefreshing(false);
  };

  const loadMore = useCallback(async () => {
    if (takeAll || !hasMorePages || isLoadingMore) {
      return;
    }
    const nextPage = pageIndex + 1;
    await fetchItems(nextPage, true);
  }, [takeAll, hasMorePages, isLoadingMore, pageIndex, fetchItems]);

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

  const refetch = useCallback(() => {
    fetchItems(1, false);
  }, [fetchItems]);

  return {
    items,
    totalCount,
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
    loadMore,
    hasMorePages,
    isLoadingMore,
    pageIndex,
    metaData,
    error,
    refetch,
    editItem,
    deleteItem,
  };
};