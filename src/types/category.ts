//===================Request======================//
export interface GetCategoryRequest {
    pageIndex: number,
    pageSize: number,
    takeAll : boolean,
    search: string
}
export interface getParentCategoriesRequest{
    pageIndex: number,
    pageSize: number,
    takeAll : boolean,
    search: string
}
export interface GetCategoryByParentIdRequest {
    pageIndex: number,
    pageSize: number,
    takeAll ?: boolean,
    search: string
    parentId: number
}
//===================Response======================//
export interface GetCategoryResponse {
    statusCode: number;
    message: string;
    data: {
        data: Category[];
    };
}
export interface getParentCategoriesResponse{
    statusCode: number;
    message: string;
    data: {
        data: Category[];
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
export interface GetCategoryByParentIdResponse {
    statusCode: number;
    message: string;
    data: {
        data: Category[];
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
export interface Category {
    id: number;
    name: string;
    parentId?: number;
    parentName?: string;
}


