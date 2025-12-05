import { useState, useEffect, useCallback } from "react";
import {  CreateOutfitAPI, DeleteOutfitAPI, EditOutfitAPI, GetOutFitsAPI, SaveFavoriteOutfitAPI } from "../../services/endpoint/outfit";
import { 
  Outfit, 
  GetOutfitsRequest, 
  CreateOutfitRequest,
  MetaData 
} from "../../types/outfit";
import { useNotification } from "../notification/useNotification";
import { getUserId } from "../../services/api/apiClient";

const getApiErrorMessage = (err: any, fallback: string) => {
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.message) return err.message;
  return fallback;
};

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

      const userId = await getUserId();
      
      if (!userId) {
        console.log("No userId found, clearing outfits");
        setOutfits([]);
        setFavoriteOutfits([]);
        setMetadata(null);
        setLoading(false);
        return [];
      }

      const request: GetOutfitsRequest = {
        pageIndex: 1,
        pageSize: 5,
        ...params,
      };

      const response = await GetOutFitsAPI(request);
      
      if (response.statusCode === 200 && response.data?.data) {
        // API đã tôn trọng pageSize=5 nên ta dùng trực tiếp dữ liệu & metaData từ server
        setOutfits(response.data.data);
        setMetadata(response.data.metaData);
        setCurrentPage(1);
        return response.data.data;
      } else {
        throw new Error(response.message || "Failed to fetch outfits");
      }
    } catch (err: any) {
      // Don't show error if it's due to missing userId (already handled above)
      if (err.message && !err.message.includes("userId")) {
        const errorMessage = err.message || "Failed to fetch outfits";
        setError(errorMessage);
        // Only show error for non-authentication issues
        if (err.response?.status !== 401 && err.response?.status !== 403) {
          showError(errorMessage);
        }
      }
      return [];
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Load more outfits (pagination)
  const loadMoreOutfits = useCallback(
    async (params?: Partial<GetOutfitsRequest>) => {
      // Nếu đang load hoặc đã load đủ totalCount thì không gọi thêm
      if (loadingMore) {
        return [];
      }

      if (metadata && outfits.length >= (metadata.totalCount ?? outfits.length)) {
        return [];
      }

      try {
        const userId = await getUserId();
        
        if (!userId) {
          console.log("No userId found, cannot load more outfits");
          return [];
        }

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
          const allData: Outfit[] = response.data.data;
          // Loại bỏ trùng id rồi append
          setOutfits((prev) => {
            const existingIds = new Set(prev.map((o) => o.id));
            const freshData = allData.filter((o) => !existingIds.has(o.id));
            return [...prev, ...freshData];
          });

          // Cập nhật metaData, đồng thời tự tính hasNext dựa trên totalCount
          const serverMeta = response.data.metaData as MetaData | undefined;
          const newTotal =
            serverMeta?.totalCount !== undefined
              ? serverMeta.totalCount
              : metadata?.totalCount ?? outfits.length + response.data.data.length;

          const newOutfitCount = Math.min(
            outfits.length + response.data.data.length,
            newTotal
          );

          setMetadata(
            serverMeta
              ? {
                  ...serverMeta,
                  totalCount: newTotal,
                  hasNext: newOutfitCount < newTotal,
                }
              : metadata
          );

          setCurrentPage(nextPage);
          return response.data.data;
        } else {
          throw new Error(response.message || "Failed to load more outfits");
        }
      } catch (err: any) {
        console.error("Failed to load more outfits:", err);
        // Don't show error for authentication issues
        if (err.response?.status === 401 || err.response?.status === 403) {
          setOutfits([]);
          setFavoriteOutfits([]);
        }
        return [];
      } finally {
        setLoadingMore(false);
      }
    },
    [loadingMore, metadata, outfits.length, currentPage]
  );

  // Fetch favorite outfits
  const fetchFavoriteOutfits = useCallback(async () => {
    try {
      const userId = await getUserId();
      
      if (!userId) {
        console.log("No userId found, clearing favorite outfits");
        setFavoriteOutfits([]);
        return [];
      }

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
      // Don't show error for authentication issues
      if (err.response?.status === 401 || err.response?.status === 403) {
        setFavoriteOutfits([]);
      }
      return [];
    }
  }, []);

  // Create new outfit
  const createOutfit = useCallback(async (data: CreateOutfitRequest) => {
    try {
      const userId = await getUserId();
      
      if (!userId) {
        console.log("No userId found, cannot create outfit");
        return null;
      }

      setLoading(true);
      setError(null);

      const response = await CreateOutfitAPI(data);
      
      if (response.statusCode === 201 && response.data) {
        // Add new outfit to list
        setOutfits((prev) => [response.data, ...prev]);
        showSuccess("Outfit created successfully!");
        return response.data;
      } else {
        throw new Error(response.message || "Failed to create outfit");
      }
    } catch (err: any) {
      const errorMessage = getApiErrorMessage(err, "Failed to create outfit");
      setError(errorMessage);
      // Don't show error for authentication issues
      if (err.response?.status !== 401 && err.response?.status !== 403) {
        showError(errorMessage);
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError]);

  // Toggle favorite status
  const toggleFavorite = useCallback(async (outfitId: number) => {
    try {
      const userId = await getUserId();
      
      if (!userId) {
        console.log("No userId found, cannot toggle favorite");
        return false;
      }

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
      // Don't show error for authentication issues
      if (err.response?.status !== 401 && err.response?.status !== 403) {
        showError("Failed to update favorite status");
      }
      return false;
    }
  }, [fetchFavoriteOutfits, showError]);

  // Edit outfit
  const editOutfit = useCallback(async (outfitId: number, data: Partial<CreateOutfitRequest>) => {
    try {
      const userId = await getUserId();
      
      if (!userId) {
        console.log("No userId found, cannot edit outfit");
        return null;
      }

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
      const errorMessage = getApiErrorMessage(err, "Failed to update outfit");
      setError(errorMessage);
      // Don't show error for authentication issues
      if (err.response?.status !== 401 && err.response?.status !== 403) {
        showError(errorMessage);
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [showError, showSuccess]);

  const deleteOutfit = useCallback(async (outfitId: number) => {
    try {
      const userId = await getUserId();
      
      if (!userId) {
        console.log("No userId found, cannot delete outfit");
        return false;
      }

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
      const errorMessage = getApiErrorMessage(err, "Failed to delete outfit");
      // Don't show error for authentication issues
      if (err.response?.status !== 401 && err.response?.status !== 403) {
        showError(errorMessage);
      }
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
