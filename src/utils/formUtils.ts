/**
 * Form validation utilities
 */

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validate required fields for Add Item form
 */
export const validateAddItemForm = (data: {
  itemName: string;
  categoryId: number;
  imageRemBgURL: string;
}): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!data.itemName?.trim()) {
    errors.push({ field: "itemName", message: "Item name is required" });
  }

  if (!data.categoryId || data.categoryId === 0) {
    errors.push({ field: "categoryId", message: "Category is required" });
  }

  if (!data.imageRemBgURL?.trim()) {
    errors.push({ 
      field: "imageRemBgURL", 
      message: "Please detect image with AI first" 
    });
  }

  return errors;
};

/**
 * Filter object to remove empty string values
 */
export const removeEmptyFields = <T extends Record<string, any>>(
  obj: T
): Partial<T> => {
  const result: any = {};
  
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (typeof value === "string") {
        if (value.trim()) {
          result[key] = value.trim();
        }
      } else {
        result[key] = value;
      }
    }
  });
  
  return result;
};

/**
 * Generate tag from multiple fields
 */
export const generateTag = (fields: (string | undefined)[]): string => {
  return fields
    .filter(Boolean)
    .filter(v => v?.trim())
    .join(", ");
};
