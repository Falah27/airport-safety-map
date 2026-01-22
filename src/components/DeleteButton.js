import React, { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { MdDelete, MdClose } from 'react-icons/md';
import toast from 'react-hot-toast';
import './DeleteButton.css';

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

const DeleteButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDelete = useCallback(async () => {
    // Validate dates
    if (!startDate || !endDate) {
      toast.error("Harap pilih tanggal mulai dan selesai.");
      return;
    }

    // Validate date range
    if (new Date(startDate) > new Date(endDate)) {
      toast.error("Tanggal mulai tidak boleh lebih besar dari tanggal selesai.");
      return;
    }

    // Confirm action
    if (!window.confirm(`Yakin ingin menghapus data dari ${startDate} sampai ${endDate}?`)) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/reports/range`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ start_date: startDate, end_date: endDate }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Data berhasil dihapus', { duration: 4000 });
        setIsOpen(false);
        setTimeout(() => {
          window.location.reload();
        }, RELOAD_DELAY);
      } else {
        toast.error('Gagal menghapus: ' + (data.error || data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Terjadi kesalahan koneksi.');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => {
    setIsOpen(false);
    setStartDate('');
    setEndDate('');
  }, []);

  return (
    <>
      {/* Trigger Button */}
      <button 
        className="btn-delete-trigger" 
        onClick={openModal}
        title="Hapus Data Berdasarkan Tanggal"
      >
        <MdDelete size={22} />
      </button>

      {/* Delete Modal (Portal) */}
      {isOpen && createPortal(
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>Hapus Data Laporan</h3>
              <button onClick={closeModal} className="btn-close-modal">
                <MdClose />
              </button>
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
              <button className="btn-cancel" onClick={closeModal} disabled={loading}>
                Batal
              </button>
              <button 
                className="btn-confirm-delete" 
                type="button"
                onClick={handleDelete}
                disabled={loading || !startDate || !endDate}
              >
                {loading ? 'Menghapus...' : 'Hapus Data'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default DeleteButton;