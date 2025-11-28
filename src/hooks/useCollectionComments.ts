import { useAuth } from "./auth/useAuth";
import { useCallback, useEffect, useState } from "react";
import {
  CollectionComment,
  CollectionMeta,
} from "../types/collection";
import {
  createCollectionCommentAPI,
  deleteCollectionCommentAPI,
  getCollectionCommentsAPI,
  updateCollectionCommentAPI,
} from "../services/endpoint/collection";
import { Alert } from "react-native";
import { emitCollectionUpdate } from "../lib/events/collectionEvents";

const PAGE_SIZE = 10;

export interface UseCollectionCommentsOptions {
  collectionId?: number;
  initialCount?: number;
  onCountChange?: (count: number) => void;
}

interface UseCollectionCommentsResult {
  comments: CollectionComment[];
  loading: boolean;
  refreshing: boolean;
  loadingMore: boolean;
  canLoadMore: boolean;
  posting: boolean;
  error: string | null;
  fetchComments: (page?: number, append?: boolean) => Promise<void>;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  addComment: (text: string) => Promise<void>;
  editComment: (commentId: number, text: string) => Promise<void>;
  deleteComment: (commentId: number) => Promise<void>;
  totalCount: number;
}

export const useCollectionComments = ({
  collectionId,
  initialCount = 0,
  onCountChange,
}: UseCollectionCommentsOptions): UseCollectionCommentsResult => {
  const { user } = useAuth();
  const userId = user?.id ? Number(user.id) : null;

  const [comments, setComments] = useState<CollectionComment[]>([]);
  const [meta, setMeta] = useState<CollectionMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(initialCount);

  const updateCount = useCallback(
    (count: number) => {
      setTotalCount(count);
      onCountChange?.(count);
      if (collectionId) {
        emitCollectionUpdate(collectionId, { commentCount: count });
      }
    },
    [collectionId, onCountChange]
  );

  const fetchComments = useCallback(
    async (page = 1, append = false) => {
      if (!collectionId) {
        return;
      }
      append ? setLoadingMore(true) : setLoading(true);
      try {
        const response = await getCollectionCommentsAPI(collectionId, {
          pageIndex: page,
          pageSize: PAGE_SIZE,
          takeAll: false,
        });
        const incoming = response.data.data ?? [];
        setComments((prev) =>
          append ? [...prev, ...incoming] : incoming
        );
        setMeta(response.data.metaData);
        updateCount(response.data.metaData.totalCount);
        setError(null);
      } catch (err: any) {
        console.error("❌ Error fetching comments:", err);
        if (!append) {
          setComments([]);
        }
        setError(err?.message ?? "Failed to load comments");
      } finally {
        append ? setLoadingMore(false) : setLoading(false);
      }
    },
    [collectionId, updateCount]
  );

  useEffect(() => {
    if (collectionId) {
      fetchComments(1, false);
    }
  }, [collectionId, fetchComments]);

  const refresh = useCallback(async () => {
    if (!collectionId) {
      return;
    }
    setRefreshing(true);
    await fetchComments(1, false);
    setRefreshing(false);
  }, [collectionId, fetchComments]);

  const loadMore = useCallback(async () => {
    if (!meta?.hasNext || loadingMore || loading) {
      return;
    }
    const nextPage = (meta.currentPage ?? 1) + 1;
    await fetchComments(nextPage, true);
  }, [meta, loadingMore, loading, fetchComments]);

  const ensureAuthenticated = useCallback(() => {
    if (!userId) {
      Alert.alert("Sign in required", "Please log in to continue.");
      return false;
    }
    return true;
  }, [userId]);

  const addComment = useCallback(
    async (text: string) => {
      if (!collectionId || !text.trim()) {
        return;
      }
      if (!ensureAuthenticated()) {
        return;
      }
      setPosting(true);
      try {
        const response = await createCollectionCommentAPI({
          collectionId,
          userId: userId!,
          comment: text.trim(),
        });
        const created = response.data;
        setComments((prev) => [created, ...prev]);
        const nextCount = totalCount + 1;
        updateCount(nextCount);
        setMeta((prev) =>
          prev ? { ...prev, totalCount: nextCount } : prev
        );
      } catch (err) {
        console.error("❌ Failed to add comment:", err);
        Alert.alert("Oops", "Unable to post comment. Please try again.");
      } finally {
        setPosting(false);
      }
    },
    [collectionId, ensureAuthenticated, totalCount, updateCount, userId]
  );

  const editComment = useCallback(
    async (commentId: number, text: string) => {
      if (!collectionId || !text.trim()) {
        return;
      }
      if (!ensureAuthenticated()) {
        return;
      }
      try {
        const response = await updateCollectionCommentAPI(commentId, text.trim());
        const updated = response.data;
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === commentId ? { ...comment, comment: updated.comment } : comment
          )
        );
      } catch (err) {
        console.error("❌ Failed to update comment:", err);
        Alert.alert("Oops", "Unable to update comment.");
      }
    },
    [collectionId, ensureAuthenticated]
  );

  const deleteComment = useCallback(
    async (commentId: number) => {
      if (!collectionId) {
        return;
      }
      if (!ensureAuthenticated()) {
        return;
      }
      try {
        await deleteCollectionCommentAPI(commentId);
        setComments((prev) => prev.filter((comment) => comment.id !== commentId));
        const nextCount = Math.max(0, totalCount - 1);
        updateCount(nextCount);
        setMeta((prev) =>
          prev ? { ...prev, totalCount: nextCount } : prev
        );
      } catch (err) {
        console.error("❌ Failed to delete comment:", err);
        Alert.alert("Oops", "Unable to delete comment.");
      }
    },
    [collectionId, ensureAuthenticated, totalCount, updateCount]
  );

  return {
    comments,
    loading,
    refreshing,
    loadingMore,
    canLoadMore: Boolean(meta?.hasNext),
    posting,
    error,
    fetchComments,
    refresh,
    loadMore,
    addComment,
    editComment,
    deleteComment,
    totalCount,
  };
};

