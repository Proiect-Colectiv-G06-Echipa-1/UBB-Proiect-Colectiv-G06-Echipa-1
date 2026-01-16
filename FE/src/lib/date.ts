/**
 * @file date.ts
 * @brief Utility functions for date formatting.
 */

/**
 * @brief Formats a Date object or date string into DD/MM/YYYY format.
 * @param date The date to format.
 * @return The formatted date string.
 */
export const formatDate = (date: Date | string) => {
    const d = date instanceof Date ? date : new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };