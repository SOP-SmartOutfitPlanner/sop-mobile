import { getUserId } from './../services/api/apiClient';
import { useState, useMemo, useEffect, useCallback } from "react";
import { EditItemAPI, GetItem, DeleteItemAPI } from "../services/endpoint/wardorbe";
import { Item, ItemEdit } from "../types/item";

export const useWardrobe = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch items from API
  const fetchItems = async () => {
    try {
      const userId = await getUserId();``
      
      if (!userId) {
        console.log("⚠️ No userId found, skipping fetch");
        setLoading(false);
        return;
      }

      const response = await GetItem({
        pageIndex: 1,
        pageSize: 20, // Get all items
        userId: parseInt(userId),
      });

      if (response.statusCode === 200 && response.data?.data) {
        // Access nested data.data array
        setAllItems(response.data.data);
        setError(null);
        // console.log("✅ Fetched items:", response.data.data.length);
      }
    } catch (err: any) {
      console.error("❌ Error fetching wardrobe items:", err);
      setError(err.message || "Failed to fetch items");
      setAllItems([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchItems();
  }, []);

  const filteredItems = useMemo(() => {
    // Safety check
    if (!Array.isArray(allItems)) {
      console.warn("⚠️ allItems is not an array:", allItems);
      return [];
    }

    return allItems.filter((item: Item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.brand && item.brand.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesFilters =
        selectedFilters.length === 0 ||
        selectedFilters.some(
          (filter) => {
            // Match by category name
            if (item.categoryName?.toLowerCase() === filter.toLowerCase()) {
              return true;
            }
            // Match by weather suitable
            if (item.weatherSuitable?.toLowerCase().includes(filter.toLowerCase())) {
              return true;
            }
            // Match by tags
            if (item.tag?.toLowerCase().includes(filter.toLowerCase())) {
              return true;
            }
            return false;
          }
        );

      return matchesSearch && matchesFilters;
    });
  }, [searchQuery, selectedFilters, allItems]);

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const clearFilters = () => {
    setSelectedFilters([]);
  };

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
      setAllItems(prevItems => 
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
      setAllItems(prevItems => prevItems.filter(item => item.id !== id));
      
      console.log("✅ Item deleted successfully");
    } catch (error) {
      console.error("❌ Error deleting item:", error);
      throw error;
    }
  }, []);

  return {
    items: filteredItems,
    allItems,
    searchQuery,
    setSearchQuery,
    selectedFilters,
    toggleFilter,
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