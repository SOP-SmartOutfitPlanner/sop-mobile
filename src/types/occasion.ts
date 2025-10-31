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