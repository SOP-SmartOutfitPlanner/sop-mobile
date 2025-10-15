import * as ImageManipulator from 'expo-image-manipulator';

/**
 * Image utility functions for processing and validation
 */

// Image compression config
const MAX_IMAGE_WIDTH = 1200;
const MAX_IMAGE_HEIGHT = 1600;
const COMPRESSION_QUALITY = 0.7; // 70% quality

/**
 * Extract filename from URI path
 */
export const getFilenameFromUri = (uri: string): string => {
  return uri.split("/").pop() || "photo.jpg";
};

/**
 * Get MIME type from filename
 */
export const getMimeTypeFromFilename = (filename: string): string => {
  const extension = /\.(\w+)$/.exec(filename);
  return extension ? `image/${extension[1]}` : "image/jpeg";
};

/**
 * Compress and resize image to reduce file size
 * This prevents 413 Payload Too Large errors
 */
export const compressImage = async (uri: string): Promise<string> => {
  try {
    console.log("🖼️ Compressing image...", uri);
    
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [
        // Resize if image is too large
        {
          resize: {
            width: MAX_IMAGE_WIDTH,
            height: MAX_IMAGE_HEIGHT,
          },
        },
      ],
      {
        compress: COMPRESSION_QUALITY,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );

    console.log("✅ Image compressed successfully:", result.uri);
    return result.uri;
  } catch (error) {
    console.error("❌ Error compressing image:", error);
    // Return original URI if compression fails
    return uri;
  }
};

/**
 * Prepare file object for multipart upload with compression
 */
export const prepareFileForUpload = async (uri: string) => {
  // Compress image first
  const compressedUri = await compressImage(uri);
  
  const filename = getFilenameFromUri(compressedUri);
  const mimeType = getMimeTypeFromFilename(filename);
  
  return {
    uri: compressedUri,
    type: mimeType,
    name: filename,
  };
};

/**
 * Validate image URI
 */
export const isValidImageUri = (uri: string | null): boolean => {
  if (!uri) return false;
  return uri.startsWith("file://") || uri.startsWith("content://") || uri.startsWith("http");
};
