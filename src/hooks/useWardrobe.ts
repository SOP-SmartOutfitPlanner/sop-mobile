import { getUserId } from './../services/api/apiClient';
import { useState, useMemo, useEffect } from "react";
import { GetItem } from "../services/endpoint/wardorbe";
import { Item } from "../types/item";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
        pageSize: 100, // Get all items
        userId: parseInt(userId),
      });

      if (response.statusCode === 200 && response.data?.data) {
        // Access nested data.data array
        setAllItems(response.data.data);
        setError(null);
        console.log("✅ Fetched items:", response.data.data.length);
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
  };
};