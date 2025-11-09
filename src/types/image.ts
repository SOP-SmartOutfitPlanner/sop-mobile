export interface Image {
    fileName: string;
    downloadUrl?: string;
}

// Single file upload
export interface MinioUploadResponse {
    statusCode: number;
    message: string;
    data: Image | null;
}

export interface MinioUploadRequest {
    file: any;
}

// Bulk upload
export interface BulkMinioUploadResponse {
    statusCode: number;
    message: string;
    data: {
        successfulUploads: Image[];
        failedUploads: Array<{
            fileName: string;
            reason: string;
        }>;
        totalSuccess: number;
        totalFailed: number;
    } | null;
}

export interface BulkUploadAutoRequest {
    userId: number;
    imageURLs: string[];
}

export interface FailedItem {
    imageUrl: string;
    reason: string;
}

// For 201 response - all items successfully created
export interface BulkUploadAutoSuccessData {
    count: number;
    itemIds: number[];
}

// For 404 response - some items failed to classify
export interface BulkUploadAutoPartialData {
    successfulItems: {
        count: number;
        itemIds: number[];
    };
    failedItems: {
        count: number;
        items: FailedItem[];
    };
}

export interface BulkUploadAutoResponse {
    statusCode: number;
    message: string;
    data: BulkUploadAutoSuccessData | BulkUploadAutoPartialData | null;
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