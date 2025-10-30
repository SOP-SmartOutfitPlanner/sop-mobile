export interface Job {
    id: number;
    name: string;
    description: string;
    createdDate: string;
    updatedDate: string | null;
}
export interface GetJobsResponse {
    statusCode: number;
    message: string;
    data: Job[];
}