import {
  CollectionActionResponse,
  CollectionComment,
  CollectionCommentPayload,
  CollectionCommentsResponse,
  CollectionDetailResponse,
  CollectionLikeData,
  CollectionListResponse,
  CollectionRecord,
  CollectionSaveData,
} from "../../types/collection";
import apiClient from "../api/apiClient";

interface CollectionListParams {
  takeAll?: boolean;
  pageIndex?: number;
  pageSize?: number;
}

const resolveEndpoint = (path: string) => {
  const baseURL = apiClient.defaults.baseURL ?? "";
  const normalized = baseURL.replace(/\/$/, "");
  const hasVersion = /\/v\d+(\/)?$/.test(normalized);

  if (hasVersion) {
    return path.startsWith("/") ? path : `/${path}`;
  }

  return path.startsWith("/") ? `/v1${path}` : `/v1/${path}`;
};

const buildPaginationParams = (params?: CollectionListParams) => ({
  "take-all": params?.takeAll ?? true,
  "page-index": params?.takeAll ? undefined : params?.pageIndex,
  "page-size": params?.takeAll ? undefined : params?.pageSize,
});

export const getCollectionsAPI = async (
  params?: CollectionListParams
): Promise<CollectionListResponse> => {
  const response = await apiClient.get<CollectionListResponse>(
    resolveEndpoint("/collections"),
    {
      params: buildPaginationParams(params),
    }
  );
  return response.data;
};

export const getCollectionByIdAPI = async (
  collectionId: number
): Promise<CollectionRecord> => {
  const response = await apiClient.get<CollectionDetailResponse>(
    resolveEndpoint(`/collections/${collectionId}`)
  );
  return response.data.data;
};

export const getCollectionsByUserAPI = async (
  userId: number,
  params?: CollectionListParams
): Promise<CollectionListResponse> => {
  const response = await apiClient.get<CollectionListResponse>(
    resolveEndpoint(`/collections/user/${userId}`),
    {
      params: buildPaginationParams(params),
    }
  );
  return response.data;
};

export const getSavedCollectionsAPI = async (
  userId: number,
  params?: CollectionListParams
): Promise<CollectionListResponse> => {
  const response = await apiClient.get<CollectionListResponse>(
    resolveEndpoint(`/save-collections/user/${userId}`),
    {
      params: buildPaginationParams(params),
    }
  );
  return response.data;
};

export const likeCollectionAPI = async (
  collectionId: number,
  userId: number
): Promise<CollectionActionResponse<CollectionLikeData>> => {
  const response = await apiClient.post<
    CollectionActionResponse<CollectionLikeData>
  >(resolveEndpoint("/like-collections"), {
    collectionId,
    userId,
  });
  return response.data;
};

export const saveCollectionAPI = async (
  collectionId: number,
  userId: number
): Promise<CollectionActionResponse<CollectionSaveData>> => {
  const response = await apiClient.post<
    CollectionActionResponse<CollectionSaveData>
  >(resolveEndpoint("/save-collections"), {
    collectionId,
    userId,
  });
  return response.data;
};

export const togglePublishCollectionAPI = async (
  collectionId: number
): Promise<CollectionDetailResponse> => {
  const response = await apiClient.put<CollectionDetailResponse>(
    resolveEndpoint(`/collections/${collectionId}/toggle-publish`)
  );
  return response.data;
};

export const deleteCollectionAPI = async (
  collectionId: number
): Promise<CollectionActionResponse<null>> => {
  const response = await apiClient.delete<CollectionActionResponse<null>>(
    resolveEndpoint(`/collections/${collectionId}`)
  );
  return response.data;
};

export const getCollectionCommentsAPI = async (
  collectionId: number,
  params?: CollectionListParams
): Promise<CollectionCommentsResponse> => {
  const response = await apiClient.get<CollectionCommentsResponse>(
    resolveEndpoint(`/comment-collections/collection/${collectionId}`),
    {
      params: buildPaginationParams(params),
    }
  );
  return response.data;
};

export const createCollectionCommentAPI = async (
  payload: CollectionCommentPayload
): Promise<CollectionActionResponse<CollectionComment>> => {
  const response = await apiClient.post<
    CollectionActionResponse<CollectionComment>
  >(resolveEndpoint("/comment-collections"), {
    collectionId: payload.collectionId,
    userId: payload.userId,
    comment: payload.comment,
  });
  return response.data;
};

export const updateCollectionCommentAPI = async (
  commentId: number,
  comment: string
): Promise<CollectionActionResponse<CollectionComment>> => {
  const response = await apiClient.put<
    CollectionActionResponse<CollectionComment>
  >(resolveEndpoint(`/comment-collections/${commentId}`), { comment });
  return response.data;
};

export const deleteCollectionCommentAPI = async (
  commentId: number
): Promise<CollectionActionResponse<null>> => {
  const response = await apiClient.delete<CollectionActionResponse<null>>(
    resolveEndpoint(`/comment-collections/${commentId}`)
  );
  return response.data;
};

export const toggleFollowStylistAPI = async (
  followerId: number,
  followingId: number
): Promise<CollectionActionResponse<any>> => {
  const response = await apiClient.post(resolveEndpoint("/followers"), {
    followerId,
    followingId,
  });
  return response.data;
};

export interface CreateCollectionPayload {
  title: string;
  shortDescription?: string;
  thumbnailImg?: {
    uri: string;
    type: string;
    name: string;
  };
  outfits: Array<{
    outfitId: number;
    description?: string;
  }>;
}

export const createCollectionAPI = async (
  formData: FormData
): Promise<CollectionDetailResponse> => {
  const response = await apiClient.post<CollectionDetailResponse>(
    resolveEndpoint("/collections"),
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const updateCollectionAPI = async (
  collectionId: number,
  formData: FormData
): Promise<CollectionDetailResponse> => {
  const response = await apiClient.put<CollectionDetailResponse>(
    resolveEndpoint(`/collections/${collectionId}`),
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

