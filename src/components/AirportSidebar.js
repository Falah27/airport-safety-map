import React, { useState, useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './AirportSidebar.css';
import { MdClose, MdCalendarToday, MdFilterList, MdRefresh, MdExpandMore, MdExpandLess, MdArrowBack } from 'react-icons/md';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AirportSidebar = ({airport, initialChild, onClose }) => {
  // --- STATE ---
  // 'activeAirport' adalah yang SEDANG DITAMPILKAN datanya (bisa Induk, bisa Unit)
  const [activeAirport, setActiveAirport] = useState(null);
  
  const [stats, setStats] = useState(null);
  const [hierarchy, setHierarchy] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // State Filter
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [quickFilter, setQuickFilter] = useState('12m');
  
  // State Detail & Accordion
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [monthlyReports, setMonthlyReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [expandedSection, setExpandedSection] = useState('pembantu'); 
  const scrollContainerRef = useRef(null);

  // 1. Reset saat props 'airport' (Induk) berubah dari Peta
  useEffect(() => {
    if (airport) {
      // Jika ada initialChild (dari search result unit), gunakan itu sebagai activeAirport
      // Jika tidak ada, gunakan airport (induk) sebagai activeAirport
      if (initialChild) {
        setActiveAirport(initialChild);
      } else {
        setActiveAirport(airport);
      }
    }
  }, [airport, initialChild]);

  // 2. Reset Filter saat ganti Active Airport (Induk <-> Unit)
  useEffect(() => {
    setStats(null);
    setHierarchy(null);
    setStartDate('');
    setEndDate('');
    setSelectedMonth(null);
    setMonthlyReports([]);
    setQuickFilter('12m');
    setExpandedSection('pembantu');
  }, [activeAirport]);

  // 3. FETCH DATA (Utama)
  useEffect(() => {
    if (activeAirport) {
      setLoading(true);

      // A. Fetch Stats (Otomatis dapat 0 jika tidak ada data, sesuai Controller)
      let statsUrl = `http://localhost:8000/api/airports/${activeAirport.id}/stats`;
      if (startDate && endDate) statsUrl += `?start_date=${startDate}&end_date=${endDate}`;

      // B. Fetch Hierarchy (Hanya jika Induk / Cabang Utama)
      let hierarchyPromise = Promise.resolve(null);
      if (activeAirport.level === 'cabang_utama') {
        hierarchyPromise = fetch(`http://localhost:8000/api/airports/${activeAirport.id}/hierarchy`).then(r => r.json()).catch(() => null);
      }

      Promise.all([
        fetch(statsUrl).then(r => r.json()),
        hierarchyPromise
      ])
      .then(([statsData, hierarchyData]) => {
        setStats(statsData);
        setHierarchy(hierarchyData);
        setLoading(false);
      })
      .catch(e => {
        console.error("Error fetching data:", e);
        setLoading(false);
      });
    }
  }, [activeAirport, startDate, endDate]);

  // --- CHART LOGIC ---
  useEffect(() => {
    if (stats && scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, [stats, quickFilter]);

  const getFilteredChartData = () => {
    if (!stats?.monthly_trend) return { labels: [], values: [] };
    const allLabels = Object.keys(stats.monthly_trend);
    const allValues = Object.values(stats.monthly_trend);
    
    // Logic: Kalau unit ga ada data, controller kirim array kosong, chart jadi kosong (aman)
    if (startDate && endDate) return { labels: allLabels, values: allValues };

    let slice = quickFilter === '6m' ? 6 : quickFilter === '12m' ? 12 : allLabels.length;
    const startIdx = Math.max(allLabels.length - slice, 0);
    return { labels: allLabels.slice(startIdx), values: allValues.slice(startIdx) };
  };

  const { labels: chartLabels, values: chartValues } = getFilteredChartData();

  const chartData = {
    labels: chartLabels,
    datasets: [{
      label: 'Kejadian',
      data: chartValues,
      backgroundColor: (ctx) => ctx.chart.data.labels[ctx.dataIndex] === selectedMonth ? '#F6E05E' : '#4A90E2',
      borderRadius: 4,
      barPercentage: 0.6,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: (evt, el) => { if(el.length) fetchMonthlyDetail(chartLabels[el[0].index]); },
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { beginAtZero: true, grid: { color: '#2D3748' } } }
  };

  const fetchMonthlyDetail = (lbl) => {
    if (!lbl) return;
    const map = { 'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12' };
    const p = lbl.split(' ');
    const fm = `${p[1]}-${map[p[0]] || '01'}`;
    
    setSelectedMonth(lbl);
    setLoadingReports(true);
    fetch(`http://localhost:8000/api/airports/${activeAirport.id}/reports?month=${fm}`)
      .then(r => r.json())
      .then(d => { setMonthlyReports(d); setLoadingReports(false); })
      .catch(e => { console.error(e); setLoadingReports(false); });
  };

  const formatDate = (ds) => {
    try { return new Date(ds.replace(' ', 'T')).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }); }
    catch { return ds; }
  };

  // --- NAVIGASI ANTAR UNIT ---
  const handleUnitClick = (childUnit) => {
    // Ubah tampilan sidebar menjadi data Unit tersebut
    setActiveAirport(childUnit);
  };

  const handleBackToMain = () => {
    // Kembalikan ke Induk (props.airport)
    setActiveAirport(airport);
  };

  const isVisible = !!airport;
  const isViewingChild = activeAirport && airport && activeAirport.id !== airport.id;
  const sortedCategories = stats?.top_categories ? Object.entries(stats.top_categories).sort(([, a], [, b]) => b - a) : [];
  const [topName, topCount] = sortedCategories.length > 0 ? sortedCategories[0] : ['-', 0];
  const hasHierarchy = hierarchy && ((hierarchy.cabang_pembantu?.length > 0) || (hierarchy.units?.length > 0));

  return (
    <div className={`sidebar ${isVisible ? 'visible' : 'hidden'}`}>
      {activeAirport && (
        <div className="sidebar-content">
          
          {/* HEADER */}
          <div className="sidebar-fixed-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              
              {/* Tombol Back */}
              {isViewingChild ? (
                <button onClick={handleBackToMain} className="back-btn" title="Kembali ke Induk">
                  <MdArrowBack />
                </button>
              ) : (
                <button onClick={onClose} className="close-btn"><MdClose /></button>
              )}
              
              {isViewingChild && <button onClick={onClose} className="close-btn"><MdClose /></button>}
            </div>

            <h2 style={{ marginTop: isViewingChild ? '5px' : '0' }}>{activeAirport.name}</h2>
            <p className="airport-meta">
              {activeAirport.city}, {activeAirport.provinsi} 
              {/* {activeAirport.level && <span className="badge-level"> • {activeAirport.level.replace('_', ' ').toUpperCase()}</span>} */}
            </p>
            
            {/* Filter Tanggal */}
            <div className={`date-filter-wrapper ${startDate && endDate ? 'active-filter' : ''}`}>
               <div className="filter-header">
                <div className="filter-title"><MdFilterList className="filter-icon" /><span>Rentang Waktu</span></div>
                {(startDate || endDate) && <button className="btn-reset-icon" onClick={() => { setStartDate(''); setEndDate(''); }}><MdRefresh /></button>}
              </div>
              <div className="date-input-group">
                <div className="date-field"><span className="date-label">Mulai</span><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="date-input-modern" /></div>
                <div className="date-separator-line"></div>
                <div className="date-field"><span className="date-label">Sampai</span><input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="date-input-modern" /></div>
              </div>
            </div>

            <hr className="divider" />

            {/* Stats Summary */}
            {stats && (
              <div className="sidebar-section" style={{ marginBottom: '15px' }}>
                <div className="stats-grid-reports-2plus1">
                  <div className="stat-item"><span className="stat-value">{stats.total_all_time}</span><span className="stat-label">Total</span></div>
                  <div className="stat-item"><span className="stat-value">{Object.keys(stats.top_categories).length}</span><span className="stat-label">Kategori</span></div>
                  <div className="stat-item-full">
                    <span className="stat-label">Insiden Teratas</span>
                    <div className="top-incident-content">
                      <span className="stat-value-name">{topName}</span>
                      <span className="stat-value open">{topCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div style={{ borderBottom: '1px solid #2D3748', margin: '0 -24px' }}></div>
          </div>

          {/* BODY */}
          <div className="sidebar-scroll-body">
            {loading ? <div className="loading-text">Mengambil Data...</div> : stats ? (
              <>
                {/* STRUKTUR ORGANISASI */}
                {!isViewingChild && hasHierarchy && (
                  <div className="sidebar-section hierarchy-section">
                    <h3>🏢 Struktur Organisasi</h3>
                    
                    {/* Cabang Pembantu */}
                    {hierarchy.cabang_pembantu?.length > 0 && (
                      <div className="hierarchy-group">
                        <div className="hierarchy-header" onClick={() => setExpandedSection(expandedSection === 'pembantu' ? '' : 'pembantu')}>
                          <span>📍 Cabang Pembantu ({hierarchy.cabang_pembantu.length})</span>
                          {expandedSection === 'pembantu' ? <MdExpandLess/> : <MdExpandMore/>}
                        </div>
                        {expandedSection === 'pembantu' && (
                          <div className="hierarchy-list">
                            {hierarchy.cabang_pembantu.map(item => (
                              <div key={item.id} className="hierarchy-item clickable" onClick={() => handleUnitClick(item)}>
                                <span>{item.name}</span>
                                <span className="count-badge">{item.reports_count}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Unit */}
                    {hierarchy.units?.length > 0 && (
                      <div className="hierarchy-group" style={{marginTop: '8px'}}>
                        <div className="hierarchy-header" onClick={() => setExpandedSection(expandedSection === 'unit' ? '' : 'unit')}>
                          <span>📦 Unit ({hierarchy.units.length})</span>
                          {expandedSection === 'unit' ? <MdExpandLess/> : <MdExpandMore/>}
                        </div>
                        {expandedSection === 'unit' && (
                          <div className="hierarchy-list">
                            {hierarchy.units.map(item => (
                              <div key={item.id} className="hierarchy-item clickable" onClick={() => handleUnitClick(item)}>
                                <span>{item.name}</span>
                                <span className="count-badge">{item.reports_count}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    {/* ✅ PERBAIKAN DI SINI: Gunakan activeAirport.name, bukan airport.name */}
                    <div className="hierarchy-summary"><p>Total: {hierarchy.total_children} lokasi di bawah {activeAirport.name}</p></div>
                  </div>
                )}

                <hr className="divider" />
                
                {/* CHART & DETAIL */}
                <div className="sidebar-section">
                  <h3>Tren Bulanan</h3>
                  <div style={{height: '180px'}}>
                    {chartLabels.length > 0 ? (
                      <Bar options={chartOptions} data={chartData} />
                    ) : <div className="chart-container"><p className="no-data-text">Belum ada data laporan.</p></div>}
                  </div>
                </div>

                {selectedMonth && (
                  <div className="sidebar-section fade-in">
                    <div className="detail-header-row">
                      <h3 style={{ marginBottom: 0, color: '#F6E05E' }}>Detail: {selectedMonth}</h3>
                      <button onClick={() => setSelectedMonth(null)} className="btn-close-detail">Tutup <MdClose /></button>
                    </div>
                    {loadingReports ? <p className="loading-text">Memuat...</p> : monthlyReports.length > 0 ? (
                      <div className="monthly-reports-list">
                        {monthlyReports.map((report, idx) => (
                          <div key={idx} className="report-card">
                            <div className="report-header">
                              <span className="report-date"><MdCalendarToday /> {formatDate(report.report_date)}</span>
                              <span className="report-category">{report.category}</span>
                            </div>
                            {report.description && <p className="report-desc">{report.description}</p>}
                            {report.status && <span className="report-status">{report.status}</span>}
                          </div>
                        ))}
                      </div>
                    ) : <p className="no-data-text">Tidak ada laporan bulan ini.</p>}
                  </div>
                )}

                <hr className="divider" />

                <div className="sidebar-section">
                  <h3>Total per Kategori</h3>
                  <div className="category-list">
                    {sortedCategories.length > 0 ? sortedCategories.map(([category, count]) => (
                      <div key={category} className="category-item">
                        <span className="category-name" title={category}>{category}</span>
                        <span className="category-count">{count}</span>
                      </div>
                    )) : <p className="no-data-text">Tidak ada data kategori.</p>}
                  </div>
                </div>

              </>
            ) : <p className="no-data-text">Data tidak ditemukan.</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default AirportSidebar;