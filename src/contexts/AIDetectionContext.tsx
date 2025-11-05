import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { SummaryItem, AddItem } from '../services/endpoint/wardorbe';
import { prepareFileForUpload } from '../utils/imageUtils';
import { getUserId } from '../services/api/apiClient';
import { AddItemRequest, Item } from '../types/item';

interface AIDetectionData {
  name: string;
  colors: Array<{ name: string; hex: string }>;
  category: { id: number; name: string };
  aiDescription: string;
  weatherSuitable: string;
  condition: string;
  pattern: string;
  fabric: string;
  imageRemBgURL: string;
  styles: Array<{ id: number; name: string }>;
  occasions: Array<{ id: number; name: string }>;
  seasons: Array<{ id: number; name: string }>;
}

interface AIDetectionContextType {
  isDetecting: boolean;
  detectionData: AIDetectionData | null;
  error: string | null;
  detectImage: (imageUri: string) => Promise<void>;
  clearDetection: () => void;
  hasCompletedDetection: boolean;
  shouldOpenModal: boolean;
  setShouldOpenModal: (value: boolean) => void;
  createdItem: Item | null;
  isCreatingItem: boolean;
  setOnItemCreated: (callback: (() => void) | null) => void;
}

const AIDetectionContext = createContext<AIDetectionContextType | undefined>(undefined);

export const AIDetectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionData, setDetectionData] = useState<AIDetectionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasCompletedDetection, setHasCompletedDetection] = useState(false);
  const [shouldOpenModal, setShouldOpenModal] = useState(false);
  const [createdItem, setCreatedItem] = useState<Item | null>(null);
  const [isCreatingItem, setIsCreatingItem] = useState(false);
  const [onItemCreated, setOnItemCreated] = useState<(() => void) | null>(null);

  // Helper function to validate SummaryItem response
  const isValidDetectionData = (data: any): boolean => {
    if (!data) return false;
    
    // Check for required fields
    if (!data.name || !data.category?.id || !data.imageRemBgURL) return false;
    
    // Check if arrays are not empty (at least one of them should have data)
    const hasValidArrays = 
      (Array.isArray(data.colors) && data.colors.length > 0) ||
      (Array.isArray(data.styles) && data.styles.length > 0) ||
      (Array.isArray(data.occasions) && data.occasions.length > 0) ||
      (Array.isArray(data.seasons) && data.seasons.length > 0);
    
    return hasValidArrays;
  };

  // Helper function to call SummaryItem with retry logic
  const callSummaryItemWithRetry = async (fileObject: any, maxRetries = 3): Promise<any> => {
    let lastError: any = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`📤 Attempt ${attempt}/${maxRetries}: Uploading compressed image...`);
        const response = await SummaryItem({ file: fileObject });
        
        if (response.statusCode === 200 && response.data) {
          // Validate response data
          if (isValidDetectionData(response.data)) {
            console.log('✅ Valid AI detection data received');
            return response;
          } else {
            console.warn('⚠️ AI detection returned incomplete data, retrying...');
            lastError = new Error('Incomplete detection data');
            // Continue to next retry
          }
        } else {
          throw new Error('Failed to analyze image');
        }
      } catch (err: any) {
        lastError = err;
        console.error(`❌ Attempt ${attempt}/${maxRetries} failed:`, err);
        
        // If it's a 500 error or incomplete data, retry
        if (err.response?.status === 500 || err.message === 'Incomplete detection data') {
          if (attempt < maxRetries) {
            console.log(`⏳ Waiting before retry ${attempt + 1}...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
            continue;
          }
        } else {
          // For other errors (413, network, etc.), don't retry
          throw err;
        }
      }
    }
    
    // All retries failed
    throw lastError || new Error('Failed to analyze image after multiple attempts');
  };

  const detectImage = useCallback(async (imageUri: string) => {
    setIsDetecting(true);
    setError(null);
    setHasCompletedDetection(false);
    setCreatedItem(null);

    try {
      const fileObject = await prepareFileForUpload(imageUri);
      
      // Call SummaryItem with retry logic
      const response = await callSummaryItemWithRetry(fileObject);

      if (response.statusCode === 200 && response.data) {
        setDetectionData(response.data);
        console.log('✅ AI detection completed successfully');

        setIsCreatingItem(true);
        try {
          const userId = await getUserId();
          if (!userId) {
            throw new Error('User not authenticated');
          }

          // Build AddItem request
          const addItemRequest: AddItemRequest = {
            userId: parseInt(userId, 10),
            name: response.data.name,
            categoryId: response.data.category.id,
            categoryName: response.data.category.name,
            imgUrl: response.data.imageRemBgURL,
            styleIds: response.data.styles?.map((s: any) => s.id) || [],
            occasionIds: response.data.occasions?.map((o: any) => o.id) || [],
            seasonIds: response.data.seasons?.map((s: any) => s.id) || [],
            color: response.data.colors?.map((c: any) => c.hex).join(', ') || undefined,
            aiDescription: response.data.aiDescription || undefined,
            weatherSuitable: response.data.weatherSuitable || undefined,
            condition: response.data.condition || undefined,
            pattern: response.data.pattern || undefined,
            fabric: response.data.fabric || undefined,
            // Send "null" string for brand field
            brand: "null",
            frequencyWorn: undefined,
            lastWornAt: undefined,
          };

          console.log('📤 Creating item automatically...');
          const addItemResponse = await AddItem(addItemRequest);

          if (addItemResponse.statusCode === 200 && addItemResponse.data) {
            setCreatedItem(addItemResponse.data);
            setHasCompletedDetection(true);
            console.log('✅ Item created successfully:', addItemResponse.data.id);
            
            // Call the callback if it exists to refresh wardrobe
            if (onItemCreated) {
              onItemCreated();
            }
          } else {
            throw new Error('Failed to create item');
          }
        } catch (addError: any) {
          console.error('❌ Error creating item:', addError);
          setError(addError.response?.data?.message || 'Failed to create item after analysis');
        } finally {
          setIsCreatingItem(false);
        }
      }
    } catch (err: any) {
      console.error('❌ AI Detection Error:', err);
      
      if (err.response?.status === 413) {
        setError('The image is too large. Please try with a smaller image.');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to analyze image. Please try again.');
      }
    } finally {
      setIsDetecting(false);
    }
  }, [onItemCreated]);

  const clearDetection = useCallback(() => {
    setDetectionData(null);
    setError(null);
    setHasCompletedDetection(false);
    setCreatedItem(null);
    setIsCreatingItem(false);
  }, []);

  const handleSetShouldOpenModal = useCallback((value: boolean) => {
    setShouldOpenModal(value);
  }, []);

  const handleSetOnItemCreated = useCallback((callback: (() => void) | null) => {
    setOnItemCreated(() => callback);
  }, []);

  return (
    <AIDetectionContext.Provider
      value={{
        isDetecting,
        detectionData,
        error,
        detectImage,
        clearDetection,
        hasCompletedDetection,
        shouldOpenModal,
        setShouldOpenModal: handleSetShouldOpenModal,
        createdItem,
        isCreatingItem,
        setOnItemCreated: handleSetOnItemCreated,
      }}
    >
      {children}
    </AIDetectionContext.Provider>
  );
};

export const useAIDetection = () => {
  const context = useContext(AIDetectionContext);
  if (!context) {
    throw new Error('useAIDetection must be used within AIDetectionProvider');
  }
  return context;
};
