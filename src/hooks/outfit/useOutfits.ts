import { useState, useEffect, useCallback } from "react";
import { GetOutFitAPI, CreateOutfitAPI, SaveFavoriteOutfitAPI } from "../../services/endpoint/outfit";
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
        pageSize: 100,
        takeAll: true,
        ...params,
      };

      const response = await GetOutFitAPI(request);
      
      if (response.statusCode === 200 && response.data?.data) {
        setOutfits(response.data.data);
        setMetadata(response.data.metaData);
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
  }, []);

  // Fetch favorite outfits
  const fetchFavoriteOutfits = useCallback(async () => {
    try {
      const request: GetOutfitsRequest = {
        pageIndex: 1,
        pageSize: 10,
        takeAll: true,
        isFavorite: true,
      };

      const response = await GetOutFitAPI(request);
      
      if (response.statusCode === 200 && response.data?.data) {
        setFavoriteOutfits(response.data.data);
        return response.data.data;
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
  }, []);

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

  // Refresh data
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([fetchOutfits(), fetchFavoriteOutfits()]);
    setIsRefreshing(false);
  }, [fetchOutfits, fetchFavoriteOutfits]);

  // Initial load
  useEffect(() => {
    fetchOutfits();
    fetchFavoriteOutfits();
  }, [fetchOutfits, fetchFavoriteOutfits]);

  return {
    outfits,
    favoriteOutfits,
    metadata,
    loading,
    isRefreshing,
    error,
    fetchOutfits,
    fetchFavoriteOutfits,
    createOutfit,
    toggleFavorite,
    handleRefresh,
    showError,
    showSuccess,
    visible,
    config,
    hideNotification,
  };
};
