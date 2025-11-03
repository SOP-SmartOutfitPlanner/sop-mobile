export interface Job {
    id: number;
    name: string;
    description: string;
    createdDate: string;
    updatedDate: string | null;
}

export interface MetaData {
    totalCount: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface GetJobsResponse {
    statusCode: number;
    message: string;
    data: {
        data: Job[];
        metaData: MetaData;
    }
}