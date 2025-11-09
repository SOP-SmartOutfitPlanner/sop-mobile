import { useState, useCallback } from 'react';
import { MinioUpload, BulkMinioUpload, BulkUploadAuto, BulkUploadManual, AnalyzeItems } from '../services/endpoint/upload';
import { UploadProgress, ItemUploadManual, FailedItem } from '../types/image';
import { getUserId } from '../services/api/apiClient';

export const useItemUpload = () => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    phase: 'uploading',
    current: 0,
    total: 0,
    message: '',
  });
  const [isUploading, setIsUploading] = useState(false);
  const [failedImages, setFailedImages] = useState<FailedItem[]>([]);
  const [successfulItemIds, setSuccessfulItemIds] = useState<number[]>([]);
  const [showManualCategoryModal, setShowManualCategoryModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Upload images to Minio and get download URLs
  const uploadImagesToMinio = useCallback(async (imageFiles: any[]) => {
    const uploadedUrls: string[] = [];
    
    try {
      setUploadProgress({
        phase: 'uploading',
        current: 0,
        total: imageFiles.length,
        message: `Uploading ${imageFiles.length} image${imageFiles.length > 1 ? 's' : ''}...`,
      });

      // Use bulk upload API
      const response = await BulkMinioUpload(imageFiles);
      
      if (response.data) {
        const { successfulUploads, failedUploads, totalSuccess, totalFailed } = response.data;
        
        // Collect successful URLs
        uploadedUrls.push(...successfulUploads.map(img => img.downloadUrl || '').filter(Boolean));
        
        // Log results
        console.log(`Minio upload results: ${totalSuccess} success, ${totalFailed} failed`);
        
        if (failedUploads.length > 0) {
          console.warn('Failed uploads:', failedUploads);
          failedUploads.forEach(failed => {
            console.warn(`- ${failed.fileName}: ${failed.reason}`);
          });
        }
        
        // Update progress
        setUploadProgress({
          phase: 'uploading',
          current: totalSuccess,
          total: imageFiles.length,
          message: totalFailed > 0 
            ? `${totalSuccess} uploaded, ${totalFailed} failed`
            : `All ${totalSuccess} images uploaded successfully!`,
        });
      }
    } catch (err: any) {
      console.error('Bulk upload error:', err.message);
      // If bulk upload fails completely, show error
      setUploadProgress({
        phase: 'failed',
        current: 0,
        total: imageFiles.length,
        message: err.message || 'Upload failed',
      });
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
      
      // Success case (201): All items successfully added
      if (response.statusCode === 201 && response.data) {
        // Check if it's the success format (has count and itemIds directly)
        if ('count' in response.data && 'itemIds' in response.data) {
          const { count, itemIds } = response.data;
          setSuccessfulItemIds(itemIds);
          
          setUploadProgress({
            phase: 'complete',
            current: count,
            total: imageURLs.length,
            message: `Successfully added ${count} item${count > 1 ? 's' : ''}!`,
          });
          return { success: true, failedImages: [] };
        }
      }

      // Partial success case (404/207): Some items need manual category selection
      if ((response.statusCode === 404 || response.statusCode === 207) && response.data) {
        // Check if it's the partial format (has successfulItems and failedItems)
        if ('successfulItems' in response.data && 'failedItems' in response.data) {
          const { successfulItems, failedItems } = response.data;
          
          // Store successful item IDs
          setSuccessfulItemIds(successfulItems.itemIds);
          
          // Store failed items with reasons
          setFailedImages(failedItems.items);
          
          if (failedItems.count > 0) {
            setShowManualCategoryModal(true);
            setUploadProgress({
              phase: 'analyzing',
              current: successfulItems.count,
              total: imageURLs.length,
              message: `${successfulItems.count} item${successfulItems.count !== 1 ? 's' : ''} added. ${failedItems.count} need${failedItems.count === 1 ? 's' : ''} manual category selection`,
            });
          } else {
            // All successful
            setUploadProgress({
              phase: 'complete',
              current: successfulItems.count,
              total: imageURLs.length,
              message: `Successfully added ${successfulItems.count} item${successfulItems.count > 1 ? 's' : ''}!`,
            });
          }
          
          return { success: failedItems.count === 0, failedImages: failedItems.items };
        }
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
    setSuccessfulItemIds([]);
    setShowManualCategoryModal(false);
    setError(null);
  }, []);

  return {
    uploadItems,
    uploadProgress,
    isUploading,
    failedImages,
    successfulItemIds,
    showManualCategoryModal,
    setShowManualCategoryModal,
    submitManualCategories,
    error,
    resetUpload,
  };
};
