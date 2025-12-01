
//=====================Request=========================//
export interface GetOccasionRequest {
    pageIndex: number;
    pageSize: number;
    takeAll: boolean;
    search?: string;
}
//=====================Response=========================//
export interface GetOccasionsResponse {
    statusCode: number;
    message: string;
    data: {
        data: Occasion[];
        metaData: {
            totalCount: number;
            pageSize: number;
            currentPage: number;
            totalPages: number;
            hasNext: boolean;
            hasPrevious: boolean;
        }
    };
}
export interface Occasion{
    id: number;
    name: string;
    createdDate: string;
    updatedDate: string | null;
}

export interface OccasionsListResponse {
    statusCode: number;
    message: string;
    data:{
        data: Occasion[];
        metaData: PaginationMetaData;
    };
}
export interface OccasionsListRequest {
    PageIndex: number;
    PageSize: number;
    takeAll?: boolean;
    Search?: string;
}
export interface CreateOccasionRequest {
    name: string;
}
export interface CreateOccasionResponse {
    statusCode: number;
    message: string;
    data: Occasion;
}
export interface UpdateOccasionRequest {
    id: number;
    name: string;
}
export interface UpdateOccasionResponse {
    statusCode: number;
    message: string;
    data: Occasion;
}

export interface PaginationMetaData {
    totalCount: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  }