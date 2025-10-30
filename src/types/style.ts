export interface Style {
    id: number;
    name: string;
    description: string;
    createdDate: string;
    updatedDate: string | null;
}


export interface GetStylesResponse {
    statusCode: number;
    message: string;
    data: {
        data: Style[];
        metaData: {
            totalCount: number;
            pageSize: number;
            currentPage: number;
            totalPages: number;
            hasNext: boolean
            hasPrevious: boolean;
        };
    }
}