import React, { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { MdCloudUpload } from 'react-icons/md';
import axios from 'axios';
import toast from 'react-hot-toast';
import './UploadButton.css';

const getApiBaseUrl = () => {
  let url = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  url = url.replace(/\/$/, "");
  if (!url.endsWith('/api')) {
    url += '/api';
  }
  return url;
};

const API_BASE_URL = getApiBaseUrl();
const RELOAD_DELAY = 2000;

const UploadButton = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  
  const fileInputRef = useRef(null);

  const handleFileChange = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['.csv', '.xlsx', '.xls'];
    const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!validTypes.includes(fileExt)) {
      toast.error('Format file tidak valid. Gunakan CSV atau Excel.');
      return;
    }

    setUploading(true);
    setProgress(0);
    setStatusText("Mengirim file ke server...");

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_BASE_URL}/reports/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 1800000, // 30 menit timeout untuk file sangat besar (data setahun)
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setProgress(percentCompleted);
          
          if (percentCompleted === 100) {
            setStatusText("✅ File terkirim. Memproses database...");
          }
        }
      });

      // Cek status response
      if (response.status === 200 && response.data.status === 'completed') {
        // Upload langsung selesai (sync queue)
        const result = response.data;
        const successMsg = `Upload selesai! ✅ ${result.success_count} berhasil${result.skipped_count > 0 ? `, ⚠️ ${result.skipped_count} dilewati` : ''}${result.error_count > 0 ? `, ❌ ${result.error_count} error` : ''}`;
        
        toast.success(successMsg, { duration: 6000 });
        
        if (result.error_count > 0 && result.errors?.length > 0) {
          console.warn('Upload errors:', result.errors.slice(0, 10));
        }
        
        setTimeout(() => window.location.reload(), RELOAD_DELAY);
      }
      // Cek apakah processing di background (status 202)
      else if (response.status === 202 && response.data.upload_id) {
        const uploadId = response.data.upload_id;
        setStatusText(`⏳ Processing ${response.data.total_rows} rows di server...`);
        
        let pollAttempts = 0;
        const maxPollAttempts = 200; // Max 200 attempts = 10 menit
        
        // Polling status setiap 3 detik
        const pollStatus = async () => {
          if (pollAttempts >= maxPollAttempts) {
            toast.error('Timeout menunggu hasil upload. Data mungkin sudah masuk, coba refresh halaman.', { duration: 8000 });
            setUploading(false);
            return;
          }
          
          pollAttempts++;
          
          try {
            const statusRes = await axios.get(`${API_BASE_URL}/reports/upload-status/${uploadId}`, {
              timeout: 30000 // 30 detik untuk data besar
            });
            
            if (statusRes.data.status === 'completed') {
              const result = statusRes.data;
              const successMsg = `Upload selesai! ✅ ${result.success_count} berhasil${result.skipped_count > 0 ? `, ⚠️ ${result.skipped_count} dilewati` : ''}${result.error_count > 0 ? `, ❌ ${result.error_count} error` : ''}`;
              
              toast.success(successMsg, { duration: 6000 });
              
              if (result.error_count > 0 && result.errors?.length > 0) {
                console.warn('Upload errors:', result.errors.slice(0, 10));
              }
              
              setTimeout(() => window.location.reload(), RELOAD_DELAY);
            } else if (statusRes.data.status === 'processing') {
              const prog = statusRes.data.progress;
              if (prog) {
                const percent = Math.round((prog.processed / prog.total) * 100);
                setProgress(percent);
                setStatusText(`⏳ Processing: ${prog.processed}/${prog.total} rows (${prog.percentage}%)`);
              }
              setTimeout(pollStatus, 3000); // Poll lagi setelah 3 detik
            } else if (statusRes.data.status === 'not_found') {
              // Cache expired tapi data mungkin sudah masuk
              toast.warning('Status upload tidak ditemukan. Data mungkin sudah tersimpan, silakan refresh halaman.', { duration: 6000 });
              setUploading(false);
            } else {
              throw new Error('Upload status tidak dikenal: ' + statusRes.data.status);
            }
          } catch (pollError) {
            console.error('Status polling error:', pollError);
            
            // Handle specific errors
            if (pollError.response?.status === 404) {
              toast.warning('Status upload sudah expired. Data mungkin sudah masuk, silakan refresh halaman.', { duration: 6000 });
              setUploading(false);
            } else if (pollError.code === 'ECONNABORTED' || pollError.message?.includes('timeout')) {
              // Retry on timeout
              console.log(`Polling timeout, retry attempt ${pollAttempts}/${maxPollAttempts}`);
              setTimeout(pollStatus, 5000); // Retry after 5 seconds
            } else {
              toast.error('Gagal cek status upload. Refresh halaman untuk lihat hasil.', { duration: 5000 });
              setUploading(false);
            }
          }
        };
        
        setTimeout(pollStatus, 2000); // Mulai polling setelah 2 detik
        
      } else {
        // Response langsung (bukan background job)
        toast.success(response.data.message || 'Upload berhasil!', { duration: 4000 });
        setTimeout(() => window.location.reload(), RELOAD_DELAY);
      }

    } catch (error) {
      console.error('Upload error:', error);
      
      let errorMsg = 'Terjadi kesalahan koneksi.';
      
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        errorMsg = '⏱️ Upload timeout (>10 menit). File terlalu besar atau koneksi lambat. Coba pecah file per bulan atau kurangi data.';
      } else if (error.code === 'ERR_NETWORK') {
        errorMsg = '🔌 Koneksi terputus. Pastikan Laravel server masih berjalan.';
      } else if (error.response?.status === 413) {
        errorMsg = '📦 File terlalu besar (max 50MB). Pecah file menjadi beberapa bagian.';
      } else if (error.response?.status === 422) {
        errorMsg = '❌ Validasi gagal: ' + (error.response.data?.message || 'Format file salah');
      } else if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }
      
      toast.error('Gagal: ' + errorMsg, { duration: 7000 });
    } finally {
      setUploading(false);
      setProgress(0);
      setStatusText('');
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, []);

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <>
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange} 
        style={{ display: 'none' }} 
        accept=".csv, .xlsx, .xls"
      />
      
      <button 
        className="btn-upload"
        onClick={handleButtonClick}
        disabled={uploading}
        title="Upload Data Excel/CSV"
      >
        <MdCloudUpload size={22} />
      </button>

      {/* Upload Progress Modal (Portal) */}
      {uploading && createPortal(
        <div className="progress-overlay">
          <div className="progress-box">
            <div className="progress-title">Mengupload Data</div>
            
            <span className="progress-percent">{progress}%</span>
            
            <div className="progress-track">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="progress-text">
              {statusText}
            </div>
          </div>
        </div>,
        document.body 
      )}
    </>
  );
};

export default UploadButton;