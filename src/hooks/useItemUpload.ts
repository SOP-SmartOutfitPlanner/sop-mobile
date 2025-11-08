import { useState, useCallback } from 'react';
import { MinioUpload, BulkUploadAuto, BulkUploadManual, AnalyzeItems } from '../services/endpoint/upload';
import { UploadProgress, ItemUploadManual } from '../types/image';
import { getUserId } from '../services/api/apiClient';

export const useItemUpload = () => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    phase: 'uploading',
    current: 0,
    total: 0,
    message: '',
  });
  const [isUploading, setIsUploading] = useState(false);
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const [showManualCategoryModal, setShowManualCategoryModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Upload images to Minio and get download URLs
  const uploadImagesToMinio = useCallback(async (imageFiles: any[]) => {
    const uploadedUrls: string[] = [];
    const failedUploads: any[] = [];
    
    for (let i = 0; i < imageFiles.length; i++) {
      try {
        setUploadProgress({
          phase: 'uploading',
          current: i + 1,
          total: imageFiles.length,
          message: `Uploading image ${i + 1} of ${imageFiles.length}...`,
        });

        const response = await MinioUpload(imageFiles[i]);
        
        if (response.statusCode === 200 && response.data?.downloadUrl) {
          uploadedUrls.push(response.data.downloadUrl);
        } else {
          console.warn(`Upload failed for image ${i + 1}:`, response);
          failedUploads.push({ index: i, response });
        }
      } catch (err: any) {
        console.error(`Error uploading image ${i + 1}:`, err.message);
        failedUploads.push({ index: i, error: err.message });
      }
    }

    if (failedUploads.length > 0) {
      console.warn(`${failedUploads.length} image(s) failed to upload`);
    }

    return uploadedUrls;
  }, []);

  // Step 2: Auto classify and add items to wardrobe
  const autoClassifyItems = useCallback(async (userId: number, imageURLs: string[]) => {
    setUploadProgress({
      phase: 'analyzing',
      current: 0,
      total: imageURLs.length,
      message: 'Automatically classifying items...',
    });

    try {
      const response = await BulkUploadAuto(userId, imageURLs);
      
      // Success case (201): Items added to wardrobe
      if (response.statusCode === 201) {
        setUploadProgress({
          phase: 'complete',
          current: imageURLs.length,
          total: imageURLs.length,
          message: `Successfully added ${imageURLs.length} item${imageURLs.length > 1 ? 's' : ''}!`,
        });
        return { success: true, failedImages: [] };
      }
      
      // Failed case (404): Images not recognized as clothing
      if (response.statusCode === 404 && response.data) {
        const failedUrls = Array.isArray(response.data) ? response.data : [];
        setFailedImages(failedUrls);
        
        if (failedUrls.length > 0) {
          setShowManualCategoryModal(true);
          setUploadProgress({
            phase: 'analyzing',
            current: imageURLs.length - failedUrls.length,
            total: imageURLs.length,
            message: `${failedUrls.length} image${failedUrls.length > 1 ? 's' : ''} need manual category selection`,
          });
        }
        
        return { success: false, failedImages: failedUrls };
      }
      
      return { success: true, failedImages: [] };
    } catch (err: any) {
      console.error('Error in auto classification:', err);
      setError(err.message || 'Failed to classify items');
      throw err;
    }
  }, []);

  // Step 3: Manual category selection for failed items
  const submitManualCategories = useCallback(async (userId: number, itemsUpload: ItemUploadManual[]) => {
    try {
      setShowManualCategoryModal(false);
      
      setUploadProgress({
        phase: 'analyzing',
        current: 0,
        total: itemsUpload.length,
        message: 'Adding items with selected categories...',
      });

      const response = await BulkUploadManual(userId, itemsUpload);
      
      if (response.statusCode === 201) {
        setUploadProgress({
          phase: 'complete',
          current: itemsUpload.length,
          total: itemsUpload.length,
          message: 'All items added successfully!',
        });
        
        setFailedImages([]);
      }

      return response;
    } catch (err: any) {
      console.error('Error in manual upload:', err);
      setError(err.message || 'Failed to add items');
      throw err;
    }
  }, []);

  // Complete upload flow
  const uploadItems = useCallback(async (imageFiles: any[]) => {
    if (imageFiles.length === 0) {
      setError('No images selected');
      return;
    }

    if (imageFiles.length > 10) {
      setError('Maximum 10 images allowed per upload');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Get userId from storage
      const userId = await getUserId();
      if (!userId) {
        throw new Error('User not found. Please login again.');
      }

      // Step 1: Upload to Minio
      const imageURLs = await uploadImagesToMinio(imageFiles);
      
      if (imageURLs.length === 0) {
        throw new Error('All images failed to upload. Please check your images and try again.');
      }

      // Show partial success warning if some uploads failed
      if (imageURLs.length < imageFiles.length) {
        console.warn(`Only ${imageURLs.length}/${imageFiles.length} images uploaded successfully`);
      }

      // Step 2: Auto classify
      await autoClassifyItems(parseInt(userId), imageURLs);

    } catch (err: any) {
      console.error('Upload error:', err.message);
      setError(err.message || 'Upload failed');
      setUploadProgress({
        phase: 'failed',
        current: 0,
        total: 0,
        message: err.message || 'Upload failed',
      });
    } finally {
      setIsUploading(false);
    }
  }, [uploadImagesToMinio, autoClassifyItems]);

  const resetUpload = useCallback(() => {
    setUploadProgress({
      phase: 'uploading',
      current: 0,
      total: 0,
      message: '',
    });
    setIsUploading(false);
    setFailedImages([]);
    setShowManualCategoryModal(false);
    setError(null);
  }, []);

  return {
    uploadItems,
    uploadProgress,
    isUploading,
    failedImages,
    showManualCategoryModal,
    setShowManualCategoryModal,
    submitManualCategories,
    error,
    resetUpload,
  };
};
