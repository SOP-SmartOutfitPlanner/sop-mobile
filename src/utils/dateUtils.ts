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

/**
 * Convert ISO date to relative time string ("1m ago")
 */
export const formatRelativeTime = (isoDate: string): string => {
  try {
    const target = new Date(isoDate).getTime();
    const now = Date.now();
    if (Number.isNaN(target)) {
      return isoDate;
    }
    const diff = Math.max(now - target, 0);
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) {
      return `${seconds || 1}s ago`;
    }
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes}m ago`;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours}h ago`;
    }
    const days = Math.floor(hours / 24);
    if (days < 7) {
      return `${days}d ago`;
    }
    const weeks = Math.floor(days / 7);
    if (weeks < 4) {
      return `${weeks}w ago`;
    }
    const months = Math.floor(days / 30);
    if (months < 12) {
      return `${months}mo ago`;
    }
    const years = Math.floor(days / 365);
    return `${years}y ago`;
  } catch {
    return isoDate;
  }
};