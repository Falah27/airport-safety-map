import React, { useState, useEffect, useCallback } from 'react';
import { MdExpandMore, MdChevronRight } from 'react-icons/md';
import { getAirportHierarchy } from '../services/api';
import './HierarchySelector.css';

const HierarchySelector = ({ airport, onSelect, selectedId }) => {
  const [hierarchy, setHierarchy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const loadHierarchy = useCallback(async (airportId) => {
    setLoading(true);
    try {
      const data = await getAirportHierarchy(airportId);
      setHierarchy(data);
    } catch (error) {
      console.error('Error loading hierarchy:', error);
      setHierarchy(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (airport?.id) {
      loadHierarchy(airport.id);
    }
  }, [airport?.id, loadHierarchy]);

  const toggleExpanded = useCallback(() => {
    setExpanded(prev => !prev);
  }, []);

  if (!airport) return null;
  if (loading) {
    return (
      <div className="hierarchy-loading">
        <div className="loading-spinner-small"></div>
        <span>Memuat struktur...</span>
      </div>
    );
  }

  if (!hierarchy) return null;

  const { parent, children } = hierarchy;
  const hasChildren = children && children.length > 0;

  return (
    <div className="hierarchy-selector">
      <div className="hierarchy-header">
        <h4>Pilih Unit Pelaporan</h4>
        {hasChildren && (
          <button 
            className="btn-toggle-hierarchy"
            onClick={toggleExpanded}
            title={expanded ? "Sembunyikan" : "Tampilkan"}
          >
            {expanded ? <MdExpandMore size={20} /> : <MdChevronRight size={20} />}
          </button>
        )}
      </div>

      {/* Parent (Cabang Utama) */}
      <div 
        className={`hierarchy-item parent ${selectedId === parent.id ? 'active' : ''}`}
        onClick={() => onSelect(parent.id)}
      >
        <div className="item-badge cabang-utama">CABANG UTAMA</div>
        <div className="item-name">{parent.name}</div>
        <div className="item-count">{parent.total_reports} laporan</div>
      </div>

      {/* Children */}
      {hasChildren && expanded && (
        <div className="hierarchy-children">
          {children.map((child) => (
            <div
              key={child.id}
              className={`hierarchy-item child ${selectedId === child.id ? 'active' : ''}`}
              onClick={() => onSelect(child.id)}
            >
              <div className="child-indent"></div>
              <div className="item-content">
                <div className="item-badge-small">
                  {child.level === 'cabang_pembantu' ? 'PEMBANTU' : 'UNIT'}
                </div>
                <div className="item-name">{child.name}</div>
                <div className="item-count">{child.total_reports}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      {hasChildren && (
        <div className="hierarchy-summary">
          Total: {parent.total_reports} laporan dari {children.length + 1} lokasi
        </div>
      )}
    </div>
  );
};

export default HierarchySelector;