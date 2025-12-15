import React, { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { MdCloudUpload } from 'react-icons/md';
import axios from 'axios';
import toast from 'react-hot-toast';
import './UploadButton.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
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
      const response = await axios.post(`${API_BASE_URL}/upload-reports`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setProgress(percentCompleted);
          
          if (percentCompleted === 100) {
            setStatusText("Sedang memproses database... Mohon tunggu.");
          }
        }
      });

      toast.success(response.data.message || 'Upload berhasil!', { duration: 4000 });
      setTimeout(() => {
        window.location.reload();
      }, RELOAD_DELAY);

    } catch (error) {
      console.error('Upload error:', error);
      const errorMsg = error.response?.data?.error || 
                       error.response?.data?.message ||
                       'Terjadi kesalahan koneksi.';
      toast.error('Gagal: ' + errorMsg, { duration: 5000 });
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