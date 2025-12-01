import { useState, useEffect, useCallback } from "react";
import {  CreateOutfitAPI, DeleteOutfitAPI, EditOutfitAPI, GetOutFitsAPI, SaveFavoriteOutfitAPI } from "../../services/endpoint/outfit";
import { 
  Outfit, 
  GetOutfitsRequest, 
  CreateOutfitRequest,
  MetaData 
} from "../../types/outfit";
import { useNotification } from "../notification/useNotification";

export const useOutfits = () => {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [favoriteOutfits, setFavoriteOutfits] = useState<Outfit[]>([]);
  const [metadata, setMetadata] = useState<MetaData | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { 
    showError, 
    showSuccess, 
    visible, 
    config, 
    hideNotification 
  } = useNotification();

  // Fetch all outfits
  const fetchOutfits = useCallback(async (params?: Partial<GetOutfitsRequest>) => {
    try {
      setLoading(true);
      setError(null);

      const request: GetOutfitsRequest = {
        pageIndex: 1,
        pageSize: 5,
        takeAll: false,
        ...params,
      };

      const response = await GetOutFitsAPI(request);
      
      if (response.statusCode === 200 && response.data?.data) {
        setOutfits(response.data.data);
        setMetadata(response.data.metaData);
        setCurrentPage(1);
        return response.data.data;
      } else {
        throw new Error(response.message || "Failed to fetch outfits");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch outfits";
      setError(errorMessage);
      showError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Load more outfits (pagination)
  const loadMoreOutfits = useCallback(async (params?: Partial<GetOutfitsRequest>) => {
    if (loadingMore || !metadata?.hasNext) {
      return [];
    }

    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;

      const request: GetOutfitsRequest = {
        pageIndex: nextPage,
        pageSize: 5,
        takeAll: false,
        ...params,
      };

      const response = await GetOutFitsAPI(request);
      
      if (response.statusCode === 200 && response.data?.data) {
        setOutfits((prev) => {
          // Filter out duplicates by id
          const existingIds = new Set(prev.map((o) => o.id));
          const newOutfits = response.data.data.filter((o: Outfit) => !existingIds.has(o.id));
          return [...prev, ...newOutfits];
        });
        setMetadata(response.data.metaData);
        setCurrentPage(nextPage);
        return response.data.data;
      } else {
        throw new Error(response.message || "Failed to load more outfits");
      }
    } catch (err: any) {
      console.error("Failed to load more outfits:", err);
      return [];
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, metadata, currentPage]);

  // Fetch favorite outfits
  const fetchFavoriteOutfits = useCallback(async () => {
    try {
      const request: GetOutfitsRequest = {
        pageIndex: 1,
        pageSize: 10,
        takeAll: true,
        isFavorite: true,
      };

      const response = await GetOutFitsAPI(request);
      
      if (response.statusCode === 200 && response.data?.data) {
        const favoritesOnly = response.data.data.filter((outfit) => outfit.isFavorite);
        setFavoriteOutfits(favoritesOnly);
        return favoritesOnly;
      }
      return [];
    } catch (err: any) {
      console.error("Failed to fetch favorite outfits:", err);
      return [];
    }
  }, []);

  // Create new outfit
  const createOutfit = useCallback(async (data: CreateOutfitRequest) => {
    try {
      setLoading(true);
      setError(null);

      const response = await CreateOutfitAPI(data);
      
      if (response.statusCode === 200 && response.data) {
        // Add new outfit to list
        setOutfits((prev) => [response.data, ...prev]);
        showSuccess("Outfit created successfully!");
        return response.data;
      } else {
        throw new Error(response.message || "Failed to create outfit");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to create outfit";
      setError(errorMessage);
      showError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError]);

  // Toggle favorite status
  const toggleFavorite = useCallback(async (outfitId: number) => {
    try {
      const response = await SaveFavoriteOutfitAPI(outfitId);
      
      if (response.statusCode === 200) {
        // Update outfit in list
        setOutfits((prev) =>
          prev.map((outfit) =>
            outfit.id === outfitId
              ? { ...outfit, isFavorite: !outfit.isFavorite }
              : outfit
          )
        );
        
        // Refresh favorite outfits
        await fetchFavoriteOutfits();
        
        return true;
      }
      return false;
    } catch (err: any) {
      console.error("Failed to toggle favorite:", err);
      showError("Failed to update favorite status");
      return false;
    }
  }, [fetchFavoriteOutfits, showError]);

  // Edit outfit
  const editOutfit = useCallback(async (outfitId: number, data: Partial<CreateOutfitRequest>) => {
    try {
      setLoading(true);
      setError(null);

      const response = await EditOutfitAPI(outfitId, data);
      
      if (response.statusCode === 200 && response.data) {
        // Update outfit in list
        setOutfits((prev) =>
          prev.map((outfit) =>
            outfit.id === outfitId ? response.data : outfit
          )
        );
        
        // Update favorite outfits if needed
        setFavoriteOutfits((prev) =>
          prev.map((outfit) =>
            outfit.id === outfitId ? response.data : outfit
          )
        );
        
        showSuccess("Outfit updated successfully!");
        return response.data;
      } else {
        throw new Error(response.message || "Failed to update outfit");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to update outfit";
      setError(errorMessage);
      showError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [showError, showSuccess]);

  const deleteOutfit = useCallback(async (outfitId: number) => {
    try {
      setLoading(true);
      const response = await DeleteOutfitAPI(outfitId);

      if (response.statusCode === 200) {
        setOutfits((prev) => prev.filter((outfit) => outfit.id !== outfitId));
        setFavoriteOutfits((prev) => prev.filter((outfit) => outfit.id !== outfitId));
        showSuccess("Outfit deleted successfully");
        return true;
      } else {
        throw new Error(response.message || "Failed to delete outfit");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to delete outfit";
      showError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [showError, showSuccess]);

  // Refresh data
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setCurrentPage(1);
    await Promise.all([fetchOutfits(), fetchFavoriteOutfits()]);
    setIsRefreshing(false);
  }, [fetchOutfits, fetchFavoriteOutfits]);

  // Initial load
  useEffect(() => {
    fetchOutfits();
    fetchFavoriteOutfits();
  }, [fetchOutfits, fetchFavoriteOutfits]);

  // Ensure loadMoreOutfits is always defined
  const safeLoadMoreOutfits = useCallback(async (params?: Partial<GetOutfitsRequest>) => {
    return loadMoreOutfits(params);
  }, [loadMoreOutfits]);

  return {
    outfits,
    favoriteOutfits,
    metadata,
    loading,
    loadingMore,
    isRefreshing,
    error,
    fetchOutfits,
    loadMoreOutfits: safeLoadMoreOutfits,
    fetchFavoriteOutfits,
    createOutfit,
    editOutfit,
    toggleFavorite,
    deleteOutfit,
    handleRefresh,
    showError,
    showSuccess,
    visible,
    config,
    hideNotification,
  };
};
