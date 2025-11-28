export interface CollectionMeta {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface CollectionItemDetail {
  itemId: number;
  name: string;
  categoryId: number;
  categoryName: string;
  color: string | null;
  aiDescription: string | null;
  brand: string | null;
  frequencyWorn: string | null;
  lastWornAt: string | null;
  imgUrl: string | null;
  weatherSuitable: string | null;
  condition: string | null;
  pattern: string | null;
  fabric: string | null;
  occasions?: { id: number; name: string }[];
  seasons?: { id: number; name: string }[];
  styles?: { id: number; name: string }[];
}

export interface CollectionOutfitItem {
  outfitId: number;
  name: string;
  description: string | null;
  isFavorite: boolean;
  isSaved: boolean;
  itemCount: number;
  createdDate: string;
  items: CollectionItemDetail[];
}

export interface CollectionOutfit {
  outfit: CollectionOutfitItem;
  description: string | null;
}

export interface CollectionRecord {
  id: number;
  userId: number;
  userDisplayName: string;
  avtUrl?: string | null;
  thumbnailURL?: string | null;
  title: string;
  shortDescription: string;
  isPublished: boolean;
  likeCount: number;
  commentCount: number;
  savedCount?: number;
  isFollowing: boolean;
  isSaved: boolean;
  isLiked: boolean;
  outfits: CollectionOutfit[];
  createdDate: string;
  updatedDate: string | null;
}

export interface CollectionComment {
  id: number;
  collectionId: number;
  userId: number;
  userDisplayName: string;
  userAvatarUrl: string | null;
  comment: string;
  createdDate: string;
  updatedDate: string | null;
}

export interface CollectionListResponse {
  statusCode: number;
  message: string;
  data: {
    data: CollectionRecord[];
    metaData: CollectionMeta;
  };
}

export interface CollectionDetailResponse {
  statusCode: number;
  message: string;
  data: CollectionRecord;
}

export interface CollectionCommentsResponse {
  statusCode: number;
  message: string;
  data: {
    data: CollectionComment[];
    metaData: CollectionMeta;
  };
}

export interface CollectionCommentPayload {
  collectionId: number;
  userId: number;
  comment: string;
}

export interface CollectionActionResponse<TData = any> {
  statusCode: number;
  message: string;
  data: TData;
}

export interface CollectionLikeData {
  id: number;
  collectionId: number;
  userId: number;
  isDeleted: boolean;
}

export interface CollectionSaveData {
  id: number;
  collectionId: number;
  userId: number;
  isDeleted: boolean;
  createdDate: string;
}

