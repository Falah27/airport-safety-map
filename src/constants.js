// src/constants.js - CENTRALIZED CONFIGURATION

// ===== API CONFIGURATION =====
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  TIMEOUT: 15000, // 15 seconds
  UPLOAD_TIMEOUT: 60000, // 60 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

// ===== CACHE CONFIGURATION =====
export const CACHE_CONFIG = {
  DURATION: 5 * 60 * 1000, // 5 minutes
  MAX_SIZE: 100, // Maximum number of cached items
  KEYS: {
    AIRPORTS_ALL: 'airports_all',
    STATS: (id, start, end) => `stats_${id}_${start || 'none'}_${end || 'none'}`,
    HIERARCHY: (id) => `hierarchy_${id}`,
    REPORTS: (id, month) => `reports_${id}_${month}`,
  }
};

// ===== MAP CONFIGURATION =====
export const MAP_CONFIG = {
  INDONESIA_CENTER: [-2.5489, 118.0149],
  DEFAULT_ZOOM: 5,
  ZOOMED_IN_ZOOM: 13,
  MIN_ZOOM: 4,
  MAX_ZOOM: 18,
  SIDEBAR_WIDTH: 420, // pixels
  ANIMATION_DURATION: 1.0, // seconds
  TILE_URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
};

// ===== HEATMAP CONFIGURATION =====
export const HEATMAP_CONFIG = {
  RADIUS: 30,
  BLUR: 20,
  MAX_ZOOM: 10,
  GRADIENT: {
    0.4: 'blue',
    0.6: 'lime',
    0.8: 'yellow',
    1.0: 'red'
  }
};

// ===== FILE UPLOAD CONFIGURATION =====
export const UPLOAD_CONFIG = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ACCEPTED_TYPES: [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv'
  ],
  ACCEPTED_EXTENSIONS: ['.csv', '.xlsx', '.xls'],
};

// ===== UI CONFIGURATION =====
export const UI_CONFIG = {
  TOAST_DURATION: 4000, // 4 seconds
  LOADING_DELAY: 300, // Show loading after 300ms
  DEBOUNCE_DELAY: 500, // For search/filter
  SIDEBAR_ANIMATION_DURATION: 500, // milliseconds
  CHART_HEIGHT: 200, // pixels
  CHART_MIN_WIDTH: 400, // pixels
};

// ===== DATE FILTER PRESETS =====
export const DATE_FILTERS = {
  LAST_7_DAYS: '7d',
  LAST_30_DAYS: '30d',
  LAST_6_MONTHS: '6m',
  LAST_12_MONTHS: '12m',
  ALL_TIME: 'all',
};

// ===== QUICK FILTER OPTIONS =====
export const QUICK_FILTERS = [
  { value: '6m', label: '6 Bulan' },
  { value: '12m', label: '1 Tahun' },
  { value: 'all', label: 'Semua' },
];

// ===== AIRPORT LEVELS =====
export const AIRPORT_LEVELS = {
  CABANG_UTAMA: 'cabang_utama',
  CABANG_PEMBANTU: 'cabang_pembantu',
  UNIT: 'unit',
};

// ===== REPORT STATUS =====
export const REPORT_STATUS = {
  OPEN: 'Open',
  IN_PROGRESS: 'Analysis On Process',
  SENT_TO_ANALYST: 'Send to Analyst',
  COMPLETED: 'Analysis Completed',
};

// ===== MONTH MAPPING =====
export const MONTH_MAP = {
  'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
  'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
  'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
};

// ===== ERROR MESSAGES =====
export const ERROR_MESSAGES = {
  NETWORK: 'Tidak dapat terhubung ke server. Pastikan Laravel sudah berjalan.',
  TIMEOUT: 'Request timeout. Server membutuhkan waktu terlalu lama.',
  NOT_FOUND: 'Data tidak ditemukan.',
  INVALID_DATA: 'Data yang dikirim tidak valid.',
  TOO_MANY_REQUESTS: 'Terlalu banyak request. Mohon tunggu sebentar.',
  SERVER_ERROR: 'Terjadi kesalahan di server.',
  MAINTENANCE: 'Server sedang maintenance.',
  INVALID_FILE_TYPE: 'Format file tidak didukung. Gunakan Excel (.xlsx, .xls) atau CSV.',
  FILE_TOO_LARGE: 'Ukuran file terlalu besar. Maksimal 10MB.',
  INVALID_DATE_RANGE: 'Tanggal mulai tidak boleh lebih besar dari tanggal selesai.',
};

// ===== SUCCESS MESSAGES =====
export const SUCCESS_MESSAGES = {
  UPLOAD_SUCCESS: 'Data berhasil diupload!',
  DELETE_SUCCESS: 'Data berhasil dihapus!',
  DATA_LOADED: 'Data berhasil dimuat',
};

// ===== ENVIRONMENT =====
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// ===== FEATURE FLAGS =====
export const FEATURES = {
  ENABLE_CACHING: true,
  ENABLE_DEBUG_LOGS: IS_DEVELOPMENT,
  ENABLE_PERFORMANCE_MONITORING: IS_DEVELOPMENT,
  ENABLE_ERROR_REPORTING: IS_PRODUCTION,
};

// ===== Z-INDEX LEVELS =====
export const Z_INDEX = {
  MAP: 1,
  SIDEBAR: 1000,
  SEARCH_BAR: 999,
  ADMIN_MENU: 998,
  MODAL: 9999,
  TOAST: 10000,
};

// ===== BREAKPOINTS (untuk future responsive design) =====
export const BREAKPOINTS = {
  MOBILE: 480,
  TABLET: 768,
  DESKTOP: 1024,
  WIDE: 1440,
};

// ===== LOCAL STORAGE KEYS =====
export const STORAGE_KEYS = {
  LAST_SELECTED_AIRPORT: 'last_selected_airport',
  MAP_VIEW_STATE: 'map_view_state',
  USER_PREFERENCES: 'user_preferences',
};

// ===== ANIMATION EASINGS =====
export const EASINGS = {
  LINEAR: 'linear',
  EASE_IN: 'ease-in',
  EASE_OUT: 'ease-out',
  EASE_IN_OUT: 'ease-in-out',
};

export default {
  API_CONFIG,
  CACHE_CONFIG,
  MAP_CONFIG,
  HEATMAP_CONFIG,
  UPLOAD_CONFIG,
  UI_CONFIG,
  DATE_FILTERS,
  QUICK_FILTERS,
  AIRPORT_LEVELS,
  REPORT_STATUS,
  MONTH_MAP,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  IS_DEVELOPMENT,
  IS_PRODUCTION,
  FEATURES,
  Z_INDEX,
  BREAKPOINTS,
  STORAGE_KEYS,
  EASINGS,
};