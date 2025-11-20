import React, { useState } from 'react';
import { createPortal } from 'react-dom'; // <-- 1. IMPORT INI
import { MdDelete, MdClose } from 'react-icons/md';
import './DeleteButton.css';

const DeleteButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!startDate || !endDate) {
      alert("Harap pilih tanggal mulai dan selesai.");
      return;
    }

    if (!window.confirm(`Yakin ingin menghapus data dari ${startDate} sampai ${endDate}?`)) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/delete-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ start_date: startDate, end_date: endDate }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        window.location.reload(); 
      } else {
        alert('Gagal menghapus: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setLoading(false);
      setIsOpen(false); 
    }
  };

  return (
    <>
      {/* TOMBOL TRIGGER */}
      <button 
        className="btn-delete-trigger" 
        onClick={() => setIsOpen(true)}
        title="Hapus Data Berdasarkan Tanggal"
      >
        <MdDelete size={22} />
      </button>

      {/* MODAL POPUP (DIPINDAHKAN KE BODY PAKAI PORTAL) */}
      {isOpen && createPortal(
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>Hapus Data Laporan</h3>
              <button onClick={() => setIsOpen(false)} className="btn-close-modal"><MdClose /></button>
            </div>
            
            <div className="modal-body">
              <p>Pilih rentang tanggal data yang ingin dihapus.</p>
              
              <div className="form-group">
                <label>Dari Tanggal:</label>
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label>Sampai Tanggal:</label>
                <input 
                  type="date" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)} 
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setIsOpen(false)}>Batal</button>
              <button 
                className="btn-confirm-delete" 
                type="button"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? 'Menghapus...' : 'Hapus Data'}
              </button>
            </div>
          </div>
        </div>,
        document.body // <-- 2. TUJUAN PORTAL (Langsung ke Body)
      )}
    </>
  );
};

export default DeleteButton;