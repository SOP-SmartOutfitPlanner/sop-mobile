import { AnalysisRequest, AnalysisResponse, BulkUploadAutoRequest, BulkUploadAutoResponse, BulkUploadManualRequest, BulkUploadManualResponse, ItemUploadManual, MinioUploadResponse } from "../../types/image";
import apiClient from "../api/apiClient";

// Step 1: Upload image to Minio
export const MinioUpload = async (file: any): Promise<MinioUploadResponse> => {
  // Validate file type
  const validMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  const mimeType = file.type?.toLowerCase() || file.mimeType?.toLowerCase();
  
  if (mimeType && !validMimeTypes.includes(mimeType)) {
    const error = `Invalid file type: "${mimeType}". Allowed types: ${validMimeTypes.join(', ')}`;
    console.error(error);
    throw new Error(error);
  }
  
  // Create FormData for React Native
  const formData = new FormData();
  formData.append('file', {
    uri: file.uri,
    type: file.mimeType || file.type || 'image/jpeg',
    name: file.fileName || file.name || `photo_${Date.now()}.jpg`,
  } as any);
  
  const response = await apiClient.post<MinioUploadResponse>("/minio/upload", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
}

// Step 2: Auto classify and add items (max 10 images)
export const BulkUploadAuto = async (userId: number, imageURLs: string[]): Promise<BulkUploadAutoResponse> => {
    if (imageURLs.length > 10) {
        throw new Error("Maximum 10 images allowed per upload");
    }
    
    const requestData: BulkUploadAutoRequest = {
        userId: userId,
        imageURLs: imageURLs
    };
    
    // Accept both 201 (success) and 404 (category not found) as valid responses
    const response = await apiClient.post<BulkUploadAutoResponse>("/items/bulk-upload/auto", requestData, {
        validateStatus: (status) => status === 201 || status === 404
    });
    return response.data;
}

// Step 3: Manual category selection for failed items
export const BulkUploadManual = async (
    userId: number, 
    itemsUpload: ItemUploadManual[]
): Promise<BulkUploadManualResponse> => {
    const requestData: BulkUploadManualRequest = {
        userId: userId,
        itemsUpload: itemsUpload
    };
    
    const response = await apiClient.post<BulkUploadManualResponse>("/items/bulk-upload/manual", requestData);
    return response.data;
}

// Step 4: Analyze items to get AI confidence
export const AnalyzeItems = async (itemIds: number[]): Promise<AnalysisResponse> => {
    const requestData: AnalysisRequest = {
        itemIds: itemIds
    };
    
    const response = await apiClient.post<AnalysisResponse>("/items/analysis", requestData);
    return response.data;
}
