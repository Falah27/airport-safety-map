import React, { useState, useRef } from 'react';
import { MdCloudUpload } from 'react-icons/md';
import './UploadButton.css';

const UploadButton = () => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/upload-reports', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        window.location.reload(); 
      } else {
        alert('Gagal mengupload file: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setUploading(false);
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
        className="btn-upload" 
        onClick={() => fileInputRef.current.click()}
        disabled={uploading}
        title="Upload Data Excel/CSV"
      >
        <MdCloudUpload size={20} />
        {uploading ? 'Memproses...' : 'Update Data'}
      </button>
    </>
  );
};

export default UploadButton;