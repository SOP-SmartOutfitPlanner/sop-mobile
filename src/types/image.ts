export interface Image {
    fileName: string;
    downloadUrl?: string;
}
export interface MinioUploadResponse {
    statusCode: number;
    message: string;
    data: Image | null;
    
}
export interface MinioUploadRequest {
    file: any;
}

export interface BulkUploadAutoRequest {
    userId: number;
    imageURLs: string[];
}

export interface BulkUploadAutoResponse {
    statusCode: number;
    message: string;
    data: string[] | null; // Array of failed image URLs (404) or null (201 success)
}

export interface ItemUploadManual {
    imageURLs: string;
    categoryId: number;
}

export interface BulkUploadManualRequest {
    userId: number;
    itemsUpload: ItemUploadManual[];
}

export interface BulkUploadManualResponse {
    statusCode: number;
    message: string;
    data: null;
}

export interface AnalysisRequest {
    itemIds: number[];
}

export interface AnalysisResponse {
    statusCode: number;
    message: string;
    data: null;
}

export interface UploadProgress {
    phase: 'uploading' | 'analyzing' | 'complete' | 'failed';
    current: number;
    total: number;
    message: string;
}