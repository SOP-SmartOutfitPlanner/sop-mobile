/**
 * Date utility functions for formatting and manipulation
 */

/**
 * Format ISO date string to readable format
 * Example: "2025-10-15T12:00:00.000Z" -> "Tuesday, 15 October 2025"
 */
export const formatDateDisplay = (isoDate: string): string => {
  try {
    return new Date(isoDate).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return isoDate;
  }
};

/**
 * Format ISO date to short format
 * Example: "2025-10-15T12:00:00.000Z" -> "15/10/2025"
 */
export const formatDateShort = (isoDate: string): string => {
  try {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return isoDate;
  }
};

/**
 * Check if date is valid
 */
export const isValidDate = (dateString: string): boolean => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

/**
 * Get current date in ISO format
 */
export const getCurrentISODate = (): string => {
  return new Date().toISOString();
};
