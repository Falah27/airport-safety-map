// src/utils/utils.js - HELPER FUNCTIONS

import { MONTH_MAP } from '../constants';

// ===== DATE UTILITIES =====

/**
 * Format date to Indonesian locale
 * @param {string|Date} dateString - Date string or Date object
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '-';
  
  try {
    const date = typeof dateString === 'string' 
      ? new Date(dateString.replace(' ', 'T'))
      : dateString;

    const defaultOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      ...options
    };

    return date.toLocaleDateString('id-ID', defaultOptions);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Format date to display format (long)
 * @param {string} dateString - Date string (YYYY-MM-DD)
 * @returns {string} Formatted date (e.g., "15 Desember 2024")
 */
export const formatDateDisplay = (dateString) => {
  return formatDate(dateString, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Convert month label to YYYY-MM format
 * @param {string} monthLabel - Month label (e.g., "Jan 2024")
 * @returns {string} Formatted month (e.g., "2024-01")
 */
export const convertMonthLabel = (monthLabel) => {
  const [month, year] = monthLabel.split(' ');
  const monthNumber = MONTH_MAP[month] || '01';
  return `${year}-${monthNumber}`;
};

/**
 * Get date range for quick filters
 * @param {string} filterType - Filter type ('7d', '30d', '6m', '12m')
 * @returns {object} { startDate, endDate }
 */
export const getDateRangeFromFilter = (filterType) => {
  const now = new Date();
  const endDate = now.toISOString().split('T')[0];
  
  let startDate;
  switch (filterType) {
    case '7d':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case '30d':
      startDate = new Date(now.setDate(now.getDate() - 30));
      break;
    case '6m':
      startDate = new Date(now.setMonth(now.getMonth() - 6));
      break;
    case '12m':
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      return { startDate: null, endDate: null };
  }
  
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate
  };
};

/**
 * Check if date is valid
 * @param {string} dateString - Date string
 * @returns {boolean}
 */
export const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

// ===== NUMBER UTILITIES =====

/**
 * Format number with thousand separators
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  if (typeof num !== 'number') return '0';
  return num.toLocaleString('id-ID');
};

/**
 * Calculate percentage
 * @param {number} value - Value
 * @param {number} total - Total
 * @returns {number} Percentage (0-100)
 */
export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Clamp number between min and max
 * @param {number} num - Number
 * @param {number} min - Minimum
 * @param {number} max - Maximum
 * @returns {number}
 */
export const clamp = (num, min, max) => {
  return Math.min(Math.max(num, min), max);
};

// ===== STRING UTILITIES =====

/**
 * Truncate string with ellipsis
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string}
 */
export const truncate = (str, maxLength = 50) => {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
};

/**
 * Capitalize first letter
 * @param {string} str - String
 * @returns {string}
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Generate slug from string
 * @param {string} str - String
 * @returns {string}
 */
export const slugify = (str) => {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// ===== ARRAY UTILITIES =====

/**
 * Sort array by key
 * @param {Array} arr - Array
 * @param {string} key - Key to sort by
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array}
 */
export const sortBy = (arr, key, order = 'asc') => {
  return [...arr].sort((a, b) => {
    const valA = a[key];
    const valB = b[key];
    
    if (valA < valB) return order === 'asc' ? -1 : 1;
    if (valA > valB) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Group array by key
 * @param {Array} arr - Array
 * @param {string} key - Key to group by
 * @returns {Object}
 */
export const groupBy = (arr, key) => {
  return arr.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

/**
 * Remove duplicates from array
 * @param {Array} arr - Array
 * @param {string} key - Key to check for duplicates (optional)
 * @returns {Array}
 */
export const removeDuplicates = (arr, key = null) => {
  if (!key) {
    return [...new Set(arr)];
  }
  
  const seen = new Set();
  return arr.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

// ===== OBJECT UTILITIES =====

/**
 * Deep clone object
 * @param {Object} obj - Object to clone
 * @returns {Object}
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (error) {
    console.error('Error cloning object:', error);
    return obj;
  }
};

/**
 * Check if object is empty
 * @param {Object} obj - Object
 * @returns {boolean}
 */
export const isEmpty = (obj) => {
  if (!obj) return true;
  if (Array.isArray(obj)) return obj.length === 0;
  return Object.keys(obj).length === 0;
};

/**
 * Pick specific keys from object
 * @param {Object} obj - Source object
 * @param {Array} keys - Keys to pick
 * @returns {Object}
 */
export const pick = (obj, keys) => {
  return keys.reduce((result, key) => {
    if (obj.hasOwnProperty(key)) {
      result[key] = obj[key];
    }
    return result;
  }, {});
};

// ===== VALIDATION UTILITIES =====

/**
 * Validate coordinates
 * @param {Array} coords - [lat, lng]
 * @returns {boolean}
 */
export const isValidCoordinates = (coords) => {
  if (!Array.isArray(coords) || coords.length !== 2) return false;
  
  const [lat, lng] = coords;
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 && lat <= 90 &&
    lng >= -180 && lng <= 180
  );
};

/**
 * Validate file type
 * @param {File} file - File object
 * @param {Array} acceptedTypes - Array of accepted MIME types
 * @returns {boolean}
 */
export const isValidFileType = (file, acceptedTypes) => {
  return acceptedTypes.includes(file.type);
};

/**
 * Validate file size
 * @param {File} file - File object
 * @param {number} maxSize - Maximum size in bytes
 * @returns {boolean}
 */
export const isValidFileSize = (file, maxSize) => {
  return file.size <= maxSize;
};

/**
 * Validate email
 * @param {string} email - Email address
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// ===== PERFORMANCE UTILITIES =====

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function}
 */
export const debounce = (func, delay = 300) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function}
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Wait/sleep function
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise}
 */
export const wait = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// ===== STORAGE UTILITIES =====

/**
 * Get from localStorage with JSON parse
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if not found
 * @returns {*}
 */
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from storage:', error);
    return defaultValue;
  }
};

/**
 * Save to localStorage with JSON stringify
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} Success
 */
export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Error saving to storage:', error);
    return false;
  }
};

/**
 * Remove from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} Success
 */
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from storage:', error);
    return false;
  }
};

// ===== MISC UTILITIES =====

/**
 * Generate unique ID
 * @returns {string}
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>}
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
};

/**
 * Download data as file
 * @param {string} data - Data to download
 * @param {string} filename - Filename
 * @param {string} type - MIME type
 */
export const downloadFile = (data, filename, type = 'text/plain') => {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Check if device is mobile
 * @returns {boolean}
 */
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Get browser name
 * @returns {string}
 */
export const getBrowserName = () => {
  const userAgent = navigator.userAgent;
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  return 'Unknown';
};

export default {
  formatDate,
  formatDateDisplay,
  convertMonthLabel,
  getDateRangeFromFilter,
  isValidDate,
  formatNumber,
  calculatePercentage,
  clamp,
  truncate,
  capitalize,
  slugify,
  sortBy,
  groupBy,
  removeDuplicates,
  deepClone,
  isEmpty,
  pick,
  isValidCoordinates,
  isValidFileType,
  isValidFileSize,
  isValidEmail,
  debounce,
  throttle,
  wait,
  getFromStorage,
  saveToStorage,
  removeFromStorage,
  generateId,
  copyToClipboard,
  downloadFile,
  isMobile,
  getBrowserName,
};