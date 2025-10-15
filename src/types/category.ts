export interface GetCategoryRequest {
    pageIndex: number,
    pageSize: number
}
export interface GetCategoryResponse {
    statusCode: number;
    message: string;
    data: {
        data: Category[];
    };
}
export interface Category {
    id: number;
    name: string;
    parentId?: number;
    parentName?: string;
}