// Centralized API and Backend configuration for Wanderly
export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "https://travel-website-3hqh.onrender.com";

export const API_BASE_URL = `${BACKEND_URL}/api`;

/**
 * Normalizes image URLs so both remote URLs and local upload paths resolve correctly
 */
export const getImageUrl = (imagePath, fallback = "") => {
  if (!imagePath) return fallback;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${BACKEND_URL}${cleanPath}`;
};
