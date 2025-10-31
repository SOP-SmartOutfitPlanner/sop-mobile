export interface GetSeasonsRequest{
    pageIndex: number;
    pageSize: number;
    takeAll: boolean;
    search?: string;
}
export interface GetSeasonsResponse{
    statusCode: number;
    message: string;
    data: {
        data: Season[];
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
export interface Season{
    id: number;
    name: string;
}