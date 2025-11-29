import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";

// Helper function to extract error message from API errors
const extractErrorMessage = (err: any, defaultMessage: string): string => {
  if (err?.response?.data?.message) {
    return err.response.data.message;
  }
  if (err?.message && !err.message.includes("Network Error")) {
    return err.message;
  }
  if (err?.response?.status) {
    return `Request failed with status ${err.response.status}`;
  }
  return defaultMessage;
};
import {
  getCollectionByIdAPI,
  getCollectionsAPI,
  getCollectionsByUserAPI,
  getSavedCollectionsAPI,
  likeCollectionAPI,
  saveCollectionAPI,
  toggleFollowStylistAPI,
  createCollectionAPI,
  updateCollectionAPI,
  togglePublishCollectionAPI,
  deleteCollectionAPI,
} from "../services/endpoint/collection";
import { CollectionRecord } from "../types/collection";
import { useAuth } from "./auth/useAuth";
import {
  emitCollectionUpdate,
  emitCollectionRecord,
  subscribeToCollectionUpdates,
  emitCollectionDelete,
  subscribeToCollectionDeletes,
} from "../lib/events/collectionEvents";

export type CollectionTab = "all" | "saved" | "published" | "drafts";

interface UseCollectionsGalleryResult {
  activeTab: CollectionTab;
  setActiveTab: (tab: CollectionTab) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  collections: CollectionRecord[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  count: number;
  requiresAuthMessage: string | null;
  handleRefresh: () => Promise<void>;
  refetch: () => Promise<void>;
  isStylist: boolean;
  isAuthenticated: boolean;
}

export const useCollectionsGallery = (): UseCollectionsGalleryResult => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<CollectionTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [collections, setCollections] = useState<CollectionRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = user?.id ? Number(user.id) : null;
  const roleValue = user?.role ? String(user.role) : "";
  const isStylist = roleValue.toUpperCase() === "STYLIST";

  const requiresStylistAccess =
    (activeTab === "published" || activeTab === "drafts") && !isStylist;
  const requiresLoginForSaved = activeTab === "saved" && !userId;

  const fetchCollections = useCallback(
    async (silent = false) => {
      if (requiresStylistAccess || requiresLoginForSaved) {
        setCollections([]);
        setError(null);
        return;
      }

      silent ? setRefreshing(true) : setLoading(true);

      try {
        let responseData: CollectionRecord[] = [];

        if (activeTab === "saved") {
          const response = await getSavedCollectionsAPI(userId!, {
            takeAll: true,
          });
          responseData = response.data?.data ?? [];
        } else if (activeTab === "published" || activeTab === "drafts") {
          const response = await getCollectionsByUserAPI(userId!, {
            takeAll: true,
          });
          responseData = response.data?.data ?? [];
        } else {
          const response = await getCollectionsAPI({ takeAll: true });
          responseData = response.data?.data ?? [];
        }

        const visibleCollections =
          activeTab === "published"
            ? responseData.filter((item) => item.isPublished)
            : activeTab === "drafts"
            ? responseData.filter((item) => !item.isPublished)
            : activeTab === "all" && !isStylist
            ? responseData.filter((item) => item.isPublished)
            : responseData;

        setCollections(visibleCollections);
        setError(null);
      } catch (err: any) {
        console.error("❌ Error loading collections:", err);
        setCollections([]);
        setError(err?.message ?? "Failed to load collections");
      } finally {
        silent ? setRefreshing(false) : setLoading(false);
      }
    },
    [
      activeTab,
      userId,
      isStylist,
      requiresStylistAccess,
      requiresLoginForSaved,
    ]
  );

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  useEffect(() => {
    const unsubscribeUpdates = subscribeToCollectionUpdates(({ id, changes }) => {
      setCollections((prev) => {
        let updated = false;
        const next = prev.map((item) => {
          if (item.id === id) {
            updated = true;
            return { ...item, ...changes };
          }
          return item;
        });
        return updated ? next : prev;
      });
    });

    const unsubscribeDeletes = subscribeToCollectionDeletes(({ id }) => {
      setCollections((prev) => prev.filter((item) => item.id !== id));
    });

    return () => {
      unsubscribeUpdates();
      unsubscribeDeletes();
    };
  }, []);

  const filteredCollections = useMemo(() => {
    if (!searchQuery.trim()) {
      return collections;
    }
    const normalizedQuery = searchQuery.toLowerCase();
    return collections.filter(
      (collection) =>
        collection.title.toLowerCase().includes(normalizedQuery) ||
        collection.shortDescription
          .toLowerCase()
          .includes(normalizedQuery) ||
        collection.userDisplayName.toLowerCase().includes(normalizedQuery)
    );
  }, [collections, searchQuery]);

  const handleRefresh = useCallback(async () => {
    await fetchCollections(true);
  }, [fetchCollections]);

  const requiresAuthMessage = useMemo(() => {
    if (requiresStylistAccess) {
      return "Stylist role is required to manage collections.";
    }
    if (requiresLoginForSaved) {
      return "Please log in to view or manage saved collections.";
    }
    return null;
  }, [requiresStylistAccess, requiresLoginForSaved]);

  return {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    collections: filteredCollections,
    loading,
    refreshing,
    error,
    count: filteredCollections.length,
    requiresAuthMessage,
    handleRefresh,
    refetch: () => fetchCollections(),
    isStylist,
    isAuthenticated: !!userId,
  };
};

interface UseCollectionDetailResult {
  collection: CollectionRecord | null;
  loading: boolean;
  error: string | null;
  toggleLike: () => Promise<void>;
  toggleSave: () => Promise<void>;
  toggleFollow: () => Promise<void>;
  togglePublish: () => Promise<void>;
  deleteCollection: (onSuccess?: () => void) => Promise<void>;
  refetch: () => Promise<void>;
  isOwner: boolean;
  setCommentCount: (count: number) => void;
}

export const useCollectionDetail = (
  collectionId?: number
): UseCollectionDetailResult => {
  const { user } = useAuth();
  const [collection, setCollection] = useState<CollectionRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = user?.id ? Number(user.id) : null;
  const isOwner = collection ? userId === collection.userId : false;

  const fetchDetail = useCallback(async () => {
    if (!collectionId) {
      return;
    }
    setLoading(true);
    try {
      const record = await getCollectionByIdAPI(collectionId);
      setCollection(record);
      emitCollectionRecord(record);
      setError(null);
    } catch (err: any) {
      console.error("❌ Error loading collection detail:", err);
      setError(err?.message ?? "Failed to load collection");
      setCollection(null);
    } finally {
      setLoading(false);
    }
  }, [collectionId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const ensureAuthenticated = useCallback(() => {
    if (!userId) {
      Alert.alert("Sign in required", "Please log in to continue.");
      return false;
    }
    return true;
  }, [userId]);

  const toggleLike = useCallback(async () => {
    if (!collection || !ensureAuthenticated()) {
      return;
    }
    const optimisticNext = !collection.isLiked;
    const previous = collection;
    const nextCount = Math.max(
      0,
      collection.likeCount + (optimisticNext ? 1 : -1)
    );
    setCollection((prev) => {
      if (!prev) return prev;
      const next = { ...prev, isLiked: optimisticNext, likeCount: nextCount };
      emitCollectionUpdate(next.id, next);
      return next;
    });
    try {
      await likeCollectionAPI(collection.id, userId!);
    } catch (err) {
      console.error("❌ Failed to toggle like:", err);
      setCollection(previous);
      emitCollectionUpdate(previous.id, previous);
      Alert.alert("Oops", "Unable to update like status. Please try again.");
    }
  }, [collection, ensureAuthenticated, userId]);

  const toggleSave = useCallback(async () => {
    if (!collection || !ensureAuthenticated()) {
      return;
    }
    const optimisticNext = !collection.isSaved;
    const previous = collection;
    const nextCount = Math.max(
      0,
      (collection.savedCount ?? 0) + (optimisticNext ? 1 : -1)
    );
    setCollection((prev) => {
      if (!prev) return prev;
      const next = {
        ...prev,
        isSaved: optimisticNext,
        savedCount: nextCount,
      };
      emitCollectionUpdate(next.id, next);
      return next;
    });
    try {
      await saveCollectionAPI(collection.id, userId!);
    } catch (err) {
      console.error("❌ Failed to toggle save:", err);
      setCollection(previous);
      emitCollectionUpdate(previous.id, previous);
      Alert.alert("Oops", "Unable to update save status. Please try again.");
    }
  }, [collection, ensureAuthenticated, userId]);

  const toggleFollow = useCallback(async () => {
    if (!collection || !ensureAuthenticated()) {
      return;
    }
    const optimisticNext = !collection.isFollowing;
    const previous = collection;
    setCollection((prev) => {
      if (!prev) return prev;
      const next = { ...prev, isFollowing: optimisticNext };
      emitCollectionUpdate(next.id, next);
      return next;
    });
    try {
      await toggleFollowStylistAPI(userId!, collection.userId);
    } catch (err) {
      console.error("❌ Failed to toggle follow:", err);
      setCollection(previous);
      emitCollectionUpdate(previous.id, previous);
      Alert.alert(
        "Oops",
        "Unable to update follow status. Please try again later."
      );
    }
  }, [collection, ensureAuthenticated, userId]);

  const setCommentCount = useCallback(
    (count: number) => {
      setCollection((prev) => {
        if (!prev) {
          return prev;
        }
        const next = { ...prev, commentCount: count };
        emitCollectionUpdate(next.id, next);
        return next;
      });
    },
    []
  );

  const togglePublish = useCallback(async () => {
    if (!collection || !isOwner) {
      Alert.alert("Error", "Only collection owner can publish/unpublish");
      return;
    }
    const optimisticNext = !collection.isPublished;
    const previous = collection;
    setCollection((prev) => {
      if (!prev) return prev;
      const next = { ...prev, isPublished: optimisticNext };
      emitCollectionUpdate(next.id, next);
      return next;
    });
    try {
      const response = await togglePublishCollectionAPI(collection.id);
      if (response.data) {
        setCollection(response.data);
        emitCollectionUpdate(response.data.id, response.data);
        Alert.alert(
          "Success",
          optimisticNext
            ? "Collection published successfully"
            : "Collection unpublished successfully"
        );
      }
    } catch (err) {
      console.error("❌ Failed to toggle publish:", err);
      setCollection(previous);
      emitCollectionUpdate(previous.id, previous);
      Alert.alert("Error", "Failed to update publish status. Please try again.");
    }
  }, [collection, isOwner]);

  const deleteCollection = useCallback(async (onSuccess?: () => void) => {
    if (!collection || !isOwner) {
      Alert.alert("Error", "Only collection owner can delete");
      return;
    }
    Alert.alert(
      "Delete Collection",
      "Are you sure you want to delete this collection? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCollectionAPI(collection.id);
              emitCollectionDelete(collection.id);
              Alert.alert("Success", "Collection deleted successfully", [
                {
                  text: "OK",
                  onPress: () => {
                    onSuccess?.();
                  },
                },
              ]);
            } catch (err) {
              console.error("❌ Failed to delete collection:", err);
              Alert.alert("Error", "Failed to delete collection. Please try again.");
            }
          },
        },
      ]
    );
  }, [collection, isOwner]);

  return {
    collection,
    loading,
    error,
    toggleLike,
    toggleSave,
    toggleFollow,
    togglePublish,
    deleteCollection,
    refetch: fetchDetail,
    isOwner,
    setCommentCount,
  };
};

export const useCreateCollection = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCollection = useCallback(
    async (formData: FormData) => {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      try {
        setLoading(true);
        setError(null);

        const response = await createCollectionAPI(formData);

        const isSuccess =
          response.statusCode >= 200 &&
          response.statusCode < 300 &&
          response.data;

        if (isSuccess) {
          emitCollectionRecord(response.data);
          return response.data;
        }

        const errorMsg =
          response.message || `Failed to create collection (status: ${response.statusCode})`;
        throw new Error(errorMsg);
      } catch (err: any) {
        const errorMessage = extractErrorMessage(err, "Failed to create collection");
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [user?.id]
  );

  return {
    createCollection,
    loading,
    error,
  };
};

export const useUpdateCollection = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCollection = useCallback(
    async (collectionId: number, formData: FormData) => {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      try {
        setLoading(true);
        setError(null);

        const response = await updateCollectionAPI(collectionId, formData);

        const isSuccess =
          response.statusCode >= 200 &&
          response.statusCode < 300 &&
          response.data;

        if (isSuccess) {
          emitCollectionRecord(response.data);
          return response.data;
        }

        const errorMsg =
          response.message || `Failed to update collection (status: ${response.statusCode})`;
        throw new Error(errorMsg);
      } catch (err: any) {
        const errorMessage = extractErrorMessage(err, "Failed to update collection");
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [user?.id]
  );

  return {
    updateCollection,
    loading,
    error,
  };
};

