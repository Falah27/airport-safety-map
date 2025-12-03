// src/services/api.js
import axios from 'axios';

// ✅ Perbaikan: Pastikan URL tidak ada double /api
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Debug: Log API URL yang digunakan
console.log('🔗 API Base URL:', API_BASE_URL);

// Create axios instance dengan config default
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 detik timeout
});

// Interceptor untuk handle error global
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// ========================================
// AIRPORT APIs
// ========================================
export const airportAPI = {
  /**
   * GET ALL AIRPORTS - Dengan Hierarki
   * Backend akan return Cabang beserta sub_units-nya
   */
  getAll: async () => {
    try {
      console.log('📡 Fetching airports from:', `${API_BASE_URL}/airports`);
      
      const response = await apiClient.get('/airports', {
        params: {
          type: 'cabang'
        }
      });
      
      console.log('✅ Response received:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('❌ API Error Details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      
      // Lebih spesifik error message
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Tidak dapat terhubung ke server Laravel. Pastikan Laravel sudah jalan di http://localhost:8000');
      }
      
      if (error.response?.status === 404) {
        throw new Error('Endpoint API tidak ditemukan. Cek route di Laravel');
      }
      
      if (error.response?.status === 500) {
        throw new Error('Server error: ' + (error.response?.data?.message || 'Internal server error'));
      }
      
      throw new Error(error.response?.data?.error || error.message || 'Gagal mengambil data airports');
    }
  },

  /**
   * GET AIRPORT STATS
   * @param {string} airportId - ID airport
   * @param {string} startDate - YYYY-MM-DD (optional)
   * @param {string} endDate - YYYY-MM-DD (optional)
   */
  getStats: async (airportId, startDate = null, endDate = null) => {
    try {
      const params = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const response = await apiClient.get(`/airports/${airportId}/stats`, { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Gagal mengambil statistik');
    }
  },

  /**
   * GET REPORTS BY MONTH
   * @param {string} airportId - ID airport
   * @param {string} month - Format: YYYY-MM
   */
  getReportsByMonth: async (airportId, month) => {
    try {
      const response = await apiClient.get(`/airports/${airportId}/reports`, {
        params: { month }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Gagal mengambil laporan');
    }
  },

  /**
   * GET CHILDREN AIRPORTS (Unit-unit di bawah Cabang)
   * @param {string} parentId - ID cabang induk
   */
  getChildren: async (parentId) => {
    try {
      const response = await apiClient.get('/airports', {
        params: {
          parent_id: parentId
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Gagal mengambil data unit');
    }
  }
};

// ========================================
// REPORT UPLOAD APIs
// ========================================
export const reportAPI = {
  /**
   * UPLOAD EXCEL/CSV FILE
   * @param {File} file - File Excel/CSV
   * @param {Function} onProgress - Callback untuk progress (0-100)
   */
  upload: async (file, onProgress = null) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post('/upload-reports', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        }
      });

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Gagal upload file');
    }
  },

  /**
   * DELETE REPORTS BY DATE RANGE
   * @param {string} startDate - YYYY-MM-DD
   * @param {string} endDate - YYYY-MM-DD
   */
  deleteRange: async (startDate, endDate) => {
    try {
      const response = await apiClient.post('/delete-reports', {
        start_date: startDate,
        end_date: endDate
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Gagal menghapus data');
    }
  }
};

export default apiClient;