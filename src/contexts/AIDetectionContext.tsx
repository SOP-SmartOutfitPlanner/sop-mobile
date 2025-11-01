import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { SummaryItem } from '../services/endpoint/wardorbe';
import { prepareFileForUpload } from '../utils/imageUtils';

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
}

const AIDetectionContext = createContext<AIDetectionContextType | undefined>(undefined);

export const AIDetectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionData, setDetectionData] = useState<AIDetectionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasCompletedDetection, setHasCompletedDetection] = useState(false);
  const [shouldOpenModal, setShouldOpenModal] = useState(false);

  const detectImage = useCallback(async (imageUri: string) => {
    setIsDetecting(true);
    setError(null);
    setHasCompletedDetection(false);

    try {
      const fileObject = await prepareFileForUpload(imageUri);
      console.log('📤 Uploading compressed image for AI detection...');

      const response = await SummaryItem({ file: fileObject });

      if (response.statusCode === 200 && response.data) {
        setDetectionData(response.data);
        setHasCompletedDetection(true);
        console.log('✅ AI detection completed successfully');
      } else {
        throw new Error('Failed to analyze image');
      }
    } catch (err: any) {
      console.error('❌ AI Detection Error:', err);
      
      if (err.response?.status === 413) {
        setError('The image is too large. Please try with a smaller image.');
      } else {
        setError(err.response?.data?.message || 'Failed to analyze image. Please try again.');
      }
    } finally {
      setIsDetecting(false);
    }
  }, []);

  const clearDetection = useCallback(() => {
    setDetectionData(null);
    setError(null);
    setHasCompletedDetection(false);
  }, []);

  const handleSetShouldOpenModal = useCallback((value: boolean) => {
    setShouldOpenModal(value);
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
