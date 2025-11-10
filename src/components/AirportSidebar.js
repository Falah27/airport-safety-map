import React from 'react';
import './AirportSidebar.css'; 

import { 
  MdClose, 
  MdLocationOn, 
  MdNotes 
} from 'react-icons/md';

const getRatingClass = (rating) => {
  if (!rating) return '';
  const lowerCaseRating = rating.toLowerCase();
  if (lowerCaseRating.includes('a')) return 'rating-a';
  if (lowerCaseRating.includes('b')) return 'rating-b';
  if (lowerCaseRating.includes('c')) return 'rating-c';
  return 'rating-default';
};

const AirportSidebar = ({ airport, onClose }) => {
  const isVisible = !!airport;

  let categoryCount = 0;
  let topIncidentCount = 0;

  if (airport && airport.report_categories && Object.keys(airport.report_categories).length > 0) {
    categoryCount = Object.keys(airport.report_categories).length;

    const counts = Object.values(airport.report_categories);
    topIncidentCount = Math.max(...counts);
  }

  return (
    <div className={`sidebar ${isVisible ? 'visible' : 'hidden'}`}>
      
      <button onClick={onClose} className="close-btn">
        <MdClose />
      </button>

      {airport && (
        <div className="sidebar-content">
          
          <div className="sidebar-header">
            <h2>{airport.name}</h2>
            <p>{airport.city}, {airport.provinsi}</p>
          </div>

          <hr className="divider" />
          <div className="sidebar-section">
            <h3>Rangkuman Laporan</h3>
            <div className="stats-grid-reports">

              <div className="stat-item">
                <span className="stat-value">{airport.total_reports}</span>
                <span className="stat-label">Total Laporan</span>
              </div>

              <div className="stat-item">
                <span className="stat-value">{categoryCount}</span>
                <span className="stat-label">Jml. Kategori</span>
              </div>

              <div className="stat-item">
                <span className="stat-value open">{topIncidentCount}</span>
                <span className="stat-label">Insiden Teratas</span>
              </div>

            </div>
          </div>

          <hr className="divider" />
          <div className="sidebar-section">
            <h3>Rincian Kategori</h3>
            <div className="category-list">
              
              {airport.report_categories && Object.keys(airport.report_categories).length > 0 ? (
                Object.entries(airport.report_categories)
                  .sort(([, countA], [, countB]) => countB - countA) 
                  .map(([category, count]) => (
                    <div className="category-item" key={category}>
                      <span className="category-name">{category}</span>
                      <span className="category-count">{count}</span>
                    </div>
                ))

              ) : (
                <p className="no-data-text">Tidak ada rincian kategori.</p>
              )}

            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default AirportSidebar;