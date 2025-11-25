import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom'; // <-- 1. JANGAN LUPA INI
import { MdCloudUpload } from 'react-icons/md';
import axios from 'axios';
// HAPUS CSS IMPORT JIKA SUDAH HAPUS FILE CSS DAN PAKAI TAILWIND, 
// TAPI KALAU MASIH PAKAI CSS BIASA, BIARKAN INI:
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
      // Pastikan URL ini sesuai dengan IP/Localhost kamu
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

      alert(response.data.message);
      window.location.reload();

    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.error || 'Terjadi kesalahan koneksi.';
      alert('Gagal: ' + errorMsg);
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
        document.body // <-- TEMPEL KE BODY LANGSUNG
      )}
    </>
  );
};

export default UploadButton;