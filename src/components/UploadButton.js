import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom'; // <-- 1. JANGAN LUPA INI
import { MdCloudUpload } from 'react-icons/md';
import axios from 'axios';
import toast from 'react-hot-toast';
import './UploadButton.css'; 

const UploadButton = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0); 
  const [statusText, setStatusText] = useState(''); 
  
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setStatusText("Mengirim file ke server...");

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/api/upload-reports', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
          
          if (percentCompleted === 100) {
            setStatusText("Sedang memproses database... Mohon tunggu.");
          }
        }
      });

      toast.success(response.data.message, { duration: 4000 });
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.error || 'Terjadi kesalahan koneksi.';
      toast.error('Gagal: ' + errorMsg);
    } finally {
      setUploading(false);
      setProgress(0);
      if(fileInputRef.current) fileInputRef.current.value = "";
    }
  };

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
        className="btn-upload" // Atau class Tailwind jika sudah migrasi
        onClick={() => fileInputRef.current.click()}
        disabled={uploading}
        title="Upload Data Excel/CSV"
      >
        <MdCloudUpload size={22} />
      </button>

      {/* --- MODAL PROGRES (PAKAI PORTAL BIAR DI TENGAH) --- */}
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