import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2'; 
import { 
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement 
} from 'chart.js';
import './AirportSidebar.css';
import { 
  MdClose, MdCalendarToday, MdFilterList, MdRefresh, 
  MdExpandMore, MdExpandLess, MdArrowBack, MdDescription, MdLocationOn, MdInfo, MdSearch,
  MdPieChart, MdList 
} from 'react-icons/md';

// Register ArcElement untuk Pie/Doughnut Chart
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// Constants
const API_BASE_URL = 'http://localhost:8000';

const MONTH_MAP = {
  'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 
  'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08', 
  'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
};

const CATEGORY_COLORS = [
  '#F6E05E', '#4A90E2', '#68D391', '#F687B3', '#A0AEC0', 
  '#ED8936', '#9F7AEA', '#4FD1C5', '#FC8181', '#63B3ED'
];

const AirportSidebar = ({ 
  airport, 
  initialChild, 
  onClose, 
  globalStartDate, 
  setGlobalStartDate, 
  globalEndDate, 
  setGlobalEndDate 
}) => {
  const [activeAirport, setActiveAirport] = useState(null);
  const [stats, setStats] = useState(null);
  const [hierarchy, setHierarchy] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Default filter '12m' hanya untuk slicing visual grafik batang
  const [quickFilter, setQuickFilter] = useState('12m');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryViewMode, setCategoryViewMode] = useState('list'); 

  const [detailView, setDetailView] = useState(null);
  const [loadingReports, setLoadingReports] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  
  // const [loadingDetail, setLoadingDetail] = useState(false); // Dihapus karena unused

  const [expandedSection, setExpandedSection] = useState('pembantu'); 
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (airport) setActiveAirport(initialChild || airport);
  }, [airport, initialChild]);

  // Reset state saat airport berubah
  useEffect(() => {
    setStats(null);
    setHierarchy(null);
    setDetailView(null);
    setSelectedReport(null); 
    setQuickFilter('12m'); 
    setExpandedSection('pembantu');
    setSearchTerm('');
    setCategoryViewMode('list'); 
  }, [activeAirport]);

  // FETCH DATA UTAMA
  useEffect(() => {
    if (activeAirport) {
      setLoading(true);
      setDetailView(null);

      let statsUrl = `${API_BASE_URL}/api/airports/${activeAirport.id}/stats`;
      // Gunakan filter tanggal global
      if (globalStartDate && globalEndDate) {
        statsUrl += `?start_date=${globalStartDate}&end_date=${globalEndDate}`;
      }

      let hierarchyPromise = Promise.resolve(null);
      if (activeAirport.level === 'cabang_utama') {
        hierarchyPromise = fetch(`${API_BASE_URL}/api/airports/${activeAirport.id}/hierarchy`)
          .then(r => r.json())
          .catch(() => null);
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
        console.error("Error:", e);
        setLoading(false);
      });
    }
  }, [activeAirport, globalStartDate, globalEndDate]);

  useEffect(() => {
    if (stats && scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, [stats, quickFilter]);

  // --- DATA PROCESSING ---
  const getFilteredChartData = () => {
    if (!stats?.monthly_trend) return { labels: [], values: [] };
    const allLabels = Object.keys(stats.monthly_trend);
    const allValues = Object.values(stats.monthly_trend);
    
    // Jika ada global date, tampilkan semua sesuai range itu
    if (globalStartDate && globalEndDate) return { labels: allLabels, values: allValues };

    // Slice data berdasarkan quickFilter (hanya visual chart)
    let slice = quickFilter === '6m' ? 6 : quickFilter === '12m' ? 12 : allLabels.length;
    const startIdx = Math.max(allLabels.length - slice, 0);
    return { labels: allLabels.slice(startIdx), values: allValues.slice(startIdx) };
  };
  
  const { labels: chartLabels, values: chartValues } = getFilteredChartData();
  
  const sortedCategories = useMemo(() => 
    stats?.top_categories 
      ? Object.entries(stats.top_categories).sort(([, a], [, b]) => b - a) 
      : [], 
    [stats?.top_categories]
  );

  // --- FETCH FUNCTIONS (Defined early to avoid hoisting issues) ---
  const fetchMonthlyDetail = useCallback((lbl) => {
    if (!lbl) return;
    if (detailView?.type === 'month' && detailView.title === lbl) { 
      setDetailView(null); 
      return; 
    }
    const p = lbl.split(' ');
    const fm = `${p[1]}-${MONTH_MAP[p[0]] || '01'}`;
    setLoadingReports(true);
    let url = `${API_BASE_URL}/api/airports/${activeAirport.id}/reports-general?month=${fm}`; 
    fetch(url)
      .then(r => r.json())
      .then(d => { 
        let filteredReports = d;
        if (globalStartDate && globalEndDate) {
            const start = new Date(globalStartDate);
            const end = new Date(globalEndDate);
            start.setHours(0,0,0,0);
            end.setHours(23,59,59,999);
            filteredReports = d.filter(report => {
                const reportDate = new Date(report.report_date);
                return reportDate >= start && reportDate <= end;
            });
        }
        setDetailView({ type: 'month', title: lbl, reports: filteredReports });
        setLoadingReports(false); 
      })
      .catch(e => { 
        console.error(e); 
        setLoadingReports(false); 
      });
  }, [activeAirport?.id, detailView?.type, detailView?.title, globalStartDate, globalEndDate]);

  const fetchCategoryDetail = useCallback((categoryName) => {
    if (detailView?.type === 'category' && detailView.title === categoryName) { 
      setDetailView(null); 
      return; 
    }
    setLoadingReports(true);
    setDetailView({ type: 'category', title: categoryName, reports: [] }); 
    let url = `${API_BASE_URL}/api/airports/${activeAirport.id}/reports-general?category=${encodeURIComponent(categoryName)}`;
    
    if (globalStartDate && globalEndDate) {
        url += `&start_date=${globalStartDate}&end_date=${globalEndDate}`;
    }
    
    fetch(url)
      .then(r => r.json())
      .then(d => { 
        setDetailView({ type: 'category', title: categoryName, reports: d });
        setLoadingReports(false); 
      })
      .catch(e => { 
        console.error(e); 
        setLoadingReports(false); 
      });
  }, [activeAirport?.id, detailView?.type, detailView?.title, globalStartDate, globalEndDate]);

  const openReportDetail = useCallback(async (id) => {
    setSelectedReport({ loading: true }); 
    try {
        const res = await fetch(`${API_BASE_URL}/api/reports/${id}/detail`);
        if (!res.ok) throw new Error('Failed to fetch report detail');
        const data = await res.json();
        setSelectedReport(data);
    } catch (error) {
        console.error("Gagal ambil detail:", error);
        setSelectedReport({ error: true });
    }
  }, []);

  const closeReportDetail = useCallback(() => setSelectedReport(null), []);

  // --- CHART CONFIGS (Defined after fetch functions) ---
  // 1. CONFIG BAR CHART (BULANAN)
  const barChartData = useMemo(() => ({
    labels: chartLabels,
    datasets: [{
      label: 'Kejadian',
      data: chartValues,
      backgroundColor: (ctx) => {
        if (detailView?.type === 'month' && ctx.chart.data.labels[ctx.dataIndex] === detailView.title) return '#F6E05E';
        return '#4A90E2';
      },
      borderRadius: 4,
      barPercentage: 0.6,
    }]
  }), [chartLabels, chartValues, detailView?.type, detailView?.title]);
  
  const barChartOptions = useMemo(() => ({
    responsive: true, 
    maintainAspectRatio: false,
    onClick: (evt, el) => { 
      if(el.length) fetchMonthlyDetail(chartLabels[el[0].index]); 
    },
    plugins: { legend: { display: false } },
    scales: { 
      x: { 
        display: true, 
        grid: { display: false }, 
        ticks: { color: '#A0AEC0', font: { size: 10 } } 
      }, 
      y: { 
        beginAtZero: true, 
        grid: { color: '#2D3748' }, 
        ticks: { color: '#A0AEC0' } 
      } 
    } 
  }), [chartLabels, fetchMonthlyDetail]);

  // 2. CONFIG DOUGHNUT CHART (KATEGORI)
  const doughnutData = useMemo(() => ({
    labels: sortedCategories.map(([name]) => name),
    datasets: [{
      data: sortedCategories.map(([, count]) => count),
      backgroundColor: CATEGORY_COLORS,
      borderColor: '#2D3748', 
      borderWidth: 2,
      hoverOffset: 4
    }]
  }), [sortedCategories]);

  const doughnutOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%', 
    plugins: {
        legend: {
            display: true, 
            position: 'right',
            labels: { color: '#CBD5E0', font: { size: 10 }, boxWidth: 10 }
        }
    },
    onClick: (evt, el) => {
        if(el.length > 0) {
            const index = el[0].index;
            const categoryName = doughnutData.labels[index];
            fetchCategoryDetail(categoryName); 
        }
    }
  }), [doughnutData.labels, fetchCategoryDetail]);

  const formatDate = useCallback((ds) => {
    try { 
      const date = new Date(ds.replace(' ', 'T'));
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
    catch { return ds; }
  }, []);

  const getStatusColor = useCallback((status) => {
    if (!status) return '#A0AEC0'; 
    const s = status.toLowerCase();
    if (s.includes('send to') || s.includes('analyst')) return '#68D391'; 
    if (s.includes('process') || s.includes('progress')) return '#F6E05E'; 
    if (s.includes('completed') || s.includes('closed') || s.includes('done')) return '#63B3ED'; 
    return '#A0AEC0';
  }, []);

  const handleUnitClick = useCallback((childUnit) => setActiveAirport(childUnit), []);
  const handleBackToMain = useCallback(() => setActiveAirport(airport), [airport]);
  
  const isVisible = useMemo(() => !!airport, [airport]);
  const isViewingChild = useMemo(() => 
    activeAirport && airport && activeAirport.id !== airport.id, 
    [activeAirport, airport]
  );
  
  const [topName, topCount] = useMemo(() => 
    sortedCategories.length > 0 ? sortedCategories[0] : ['-', 0],
    [sortedCategories]
  );
  const hasHierarchy = useMemo(() => 
    hierarchy && ((hierarchy.cabang_pembantu?.length > 0) || (hierarchy.units?.length > 0)),
    [hierarchy]
  );

  const getDisplayName = useCallback(() => {
    if (!activeAirport) return '';
    if (activeAirport.level === 'cabang_utama' && 
        !activeAirport.name.includes('Cabang') && 
        !activeAirport.name.includes('MATSC')) {
      return `Cabang ${activeAirport.name}`;
    }
    return activeAirport.name;
  }, [activeAirport]);

  const renderDetailList = (isEmbedded = false) => {
    let displayReports = detailView.reports || [];
    if (searchTerm) {
        const lower = searchTerm.toLowerCase();
        displayReports = displayReports.filter(r => 
            (r.category && r.category.toLowerCase().includes(lower)) ||
            (r.status && r.status.toLowerCase().includes(lower))
        );
    }

    return (
        <div className={`detail-container fade-in ${isEmbedded ? 'embedded-detail' : 'section-detail'}`}>
            {!isEmbedded && (
                <div className="detail-header-row">
                    <h3 style={{ marginBottom: 0, color: '#F6E05E', fontSize: '1rem' }}>📅 Detail: {detailView.title}</h3>
                    <button onClick={() => setDetailView(null)} className="btn-close-detail">Tutup <MdClose /></button>
                </div>
            )}
            
            {detailView.reports && detailView.reports.length > 5 && (
                <div className="list-search-container">
                    <MdSearch className="search-icon" />
                    <input 
                        type="text" 
                        placeholder="Cari laporan..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="list-search-input"
                    />
                </div>
            )}

            {loadingReports ? (
                 <p className="loading-text" style={{ fontSize: '0.9rem', fontStyle: 'italic', padding: '10px' }}>Memuat laporan...</p>
            ) : displayReports.length > 0 ? (
                <div className="monthly-reports-list" style={{ maxHeight: isEmbedded ? '250px' : '300px' }}>
                    {displayReports.map((report) => (
                        <div key={report.id} className="report-card-simple" onClick={() => openReportDetail(report.id)}>
                            <div className="simple-card-header">
                                <span className="simple-date"><MdCalendarToday size={12}/> {formatDate(report.report_date)}</span>
                                {report.status && ( <span className="simple-status" style={{ color: getStatusColor(report.status) }}>{report.status}</span> )}
                            </div>
                            <div className="simple-category">{report.category}</div>
                            <div style={{ fontSize: '0.7rem', color: '#718096', marginTop: '4px', fontStyle: 'italic' }}>Klik untuk detail lengkap</div>
                        </div>
                    ))}
                </div>
            ) : ( <p className="no-data-text">Tidak ada laporan yang cocok.</p> )}
        </div>
    );
  };

  return (
    <div className={`sidebar ${isVisible ? 'visible' : 'hidden'}`}>
      <style>{`
        /* PADDING SIDEBAR YANG BENAR */
        .sidebar-scroll-body { padding-bottom: 40px !important; }
        .monthly-reports-list { overflow-y: auto; margin-top: 10px; padding-right: 5px; padding-bottom: 20px; }

        /* Search Input */
        .list-search-container { position: relative; margin-bottom: 10px; }
        .list-search-input { width: 100%; box-sizing: border-box; padding: 8px 10px 8px 30px; border-radius: 6px; border: 1px solid #4A5568; background: #1A202C; color: white; font-size: 0.85rem; outline: none; }
        .list-search-input:focus { border-color: #4A90E2; }
        .search-icon { position: absolute; left: 8px; top: 9px; color: #A0AEC0; }

        /* Styles Dasar */
        .monthly-reports-list::-webkit-scrollbar { width: 6px; }
        .monthly-reports-list::-webkit-scrollbar-track { background: #2D3748; border-radius: 4px; }
        .monthly-reports-list::-webkit-scrollbar-thumb { background: #4A5568; border-radius: 4px; }
        .section-detail { background-color: #2D3748; border-radius: 8px; padding: 10px; margin-top: 15px; }
        .embedded-detail { background-color: #232a36; border-radius: 0 0 8px 8px; padding: 10px; margin-bottom: 10px; border-left: 2px solid #F6E05E; animation: slideDown 0.2s ease-out; }
        .report-card-simple { background-color: #3b4758; padding: 12px; border-radius: 8px; margin-bottom: 8px; border-left: 4px solid #4A90E2; cursor: pointer; transition: transform 0.1s ease; }
        .report-card-simple:hover { background-color: #4A5568; transform: translateX(4px); }
        .simple-card-header { display: flex; justify-content: space-between; margin-bottom: 4px; }
        .simple-date { font-size: 0.8rem; color: #A0AEC0; display: flex; align-items: center; gap: 4px; }
        .simple-status { font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; background-color: #2D3748; font-weight: 600; }
        .simple-category { font-size: 0.9rem; color: #fff; font-weight: 600; }
        .category-item.active-accordion { background-color: #4A5568; border-radius: 8px 8px 0 0; margin-bottom: 0; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .full-detail-view { animation: fadeIn 0.3s ease; }
        .detail-kv-row { margin-bottom: 15px; border-bottom: 1px solid #4A5568; padding-bottom: 10px; }
        .detail-kv-row:last-child { border-bottom: none; }
        .detail-label { display: block; font-size: 0.75rem; color: #A0AEC0; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
        .detail-value { font-size: 0.95rem; color: #fff; line-height: 1.5; }
        .detail-badge { display: inline-block; padding: 4px 10px; border-radius: 4px; font-weight: 600; font-size: 0.85rem; background: #2D3748; }

        /* BUTTON TOGGLE STYLES */
        .toggle-btn { background: #2D3748; border: 1px solid #4A5568; color: #A0AEC0; padding: 4px 8px; cursor: pointer; border-radius: 4px; display: flex; align-items: center; transition: all 0.2s; }
        .toggle-btn.active { background: #4A90E2; color: white; border-color: #4A90E2; }
        .toggle-btn:first-child { border-radius: 4px 0 0 4px; border-right: none; }
        .toggle-btn:last-child { border-radius: 0 4px 4px 0; }
      `}</style>

      {activeAirport && (
        <div className="sidebar-content">
          <div className="sidebar-fixed-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              {selectedReport ? (
                 <button onClick={closeReportDetail} className="back-btn" title="Kembali ke List"><MdArrowBack /> <span style={{fontSize: '0.9rem', marginLeft: '5px'}}>Kembali</span></button>
              ) : isViewingChild ? (
                <button onClick={handleBackToMain} className="back-btn" title="Kembali ke Induk"><MdArrowBack /></button>
              ) : (
                <button onClick={onClose} className="close-btn"><MdClose /></button>
              )}
              {(selectedReport || isViewingChild) && <button onClick={onClose} className="close-btn"><MdClose /></button>}
            </div>

            {selectedReport ? (
                <div style={{ marginTop: '10px' }}>
                    <h2 style={{ fontSize: '1.2rem', color: '#F6E05E', marginBottom: '5px' }}>Detail Laporan</h2>
                    <p className="airport-meta">{selectedReport.loading ? 'Memuat...' : selectedReport.category}</p>
                </div>
            ) : (
                <>
                    <h2 style={{ marginTop: isViewingChild ? '5px' : '0' }}>{getDisplayName()}</h2>
                    <p className="airport-meta">{activeAirport.city}, {activeAirport.provinsi}</p>
                    
                    <div className={`date-filter-wrapper ${globalStartDate && globalEndDate ? 'active-filter' : ''}`}>
                        <div className="filter-header">
                            <div className="filter-title"><MdFilterList className="filter-icon" /><span>Rentang Waktu</span></div>
                            {(globalStartDate || globalEndDate) && <button className="btn-reset-icon" onClick={() => { setGlobalStartDate(''); setGlobalEndDate(''); }}><MdRefresh /></button>}
                        </div>
                        <div className="date-input-group">
                            <div className="date-field"><span className="date-label">Mulai</span><input type="date" value={globalStartDate} onChange={(e) => setGlobalStartDate(e.target.value)} className="date-input-modern" /></div>
                            <div className="date-separator-line"></div>
                            <div className="date-field"><span className="date-label">Sampai</span><input type="date" value={globalEndDate} onChange={(e) => setGlobalEndDate(e.target.value)} className="date-input-modern" /></div>
                        </div>
                    </div>
                    <hr className="divider" />
                    {stats && (
                    <div className="sidebar-section" style={{ marginBottom: '15px' }}>
                        <div className="stats-grid-reports-2plus1">
                            {/* PERBAIKAN: Menampilkan Total Display (Sesuai Filter) atau Total All Time */}
                            <div className="stat-item"><span className="stat-value">{stats.total_display !== undefined ? stats.total_display : stats.total_all_time}</span><span className="stat-label">Total</span></div>
                            <div className="stat-item"><span className="stat-value">{Object.keys(stats.top_categories).length}</span><span className="stat-label">Kategori</span></div>
                            <div className="stat-item-full">
                                <span className="stat-label">Insiden Teratas</span>
                                <div className="top-incident-content"><span className="stat-value-name">{topName}</span><span className="stat-value open">{topCount}</span></div>
                            </div>
                        </div>
                    </div>
                    )}
                </>
            )}
            <div style={{ borderBottom: '1px solid #2D3748', margin: '0 -24px' }}></div>
          </div>

          <div className="sidebar-scroll-body">
            {selectedReport ? (
                <div className="full-detail-view">
                    {selectedReport.loading ? (
                        <div className="loading-text">Mengambil detail laporan...</div>
                    ) : selectedReport.error ? (
                        <div className="no-data-text" style={{color: '#FC8181'}}>Gagal memuat data.</div>
                    ) : (
                        <div style={{ padding: '10px 0' }}>
                             <div className="detail-kv-row">
                                <span className="detail-label">Kategori</span>
                                <span className="detail-value" style={{fontWeight: 'bold', color: '#4A90E2'}}>{selectedReport.category}</span>
                             </div>
                             <div className="detail-kv-row">
                                <div style={{display: 'flex', gap: '20px'}}>
                                    <div><span className="detail-label">Tanggal</span><span className="detail-value"><MdCalendarToday size={14} /> {formatDate(selectedReport.report_date)}</span></div>
                                    <div><span className="detail-label">Status</span><span className="detail-badge" style={{color: getStatusColor(selectedReport.status)}}>{selectedReport.status}</span></div>
                                </div>
                             </div>
                             <div className="detail-kv-row"><span className="detail-label"><MdDescription size={14}/> Deskripsi</span><p className="detail-value">{selectedReport.description || "-"}</p></div>
                             <div className="detail-kv-row"><span className="detail-label"><MdLocationOn size={14}/> Lokasi</span><p className="detail-value">{selectedReport.location || "-"}</p></div>
                             {selectedReport.evidence && <div className="detail-kv-row"><span className="detail-label"><MdInfo size={14}/> Bukti Foto</span><div style={{ marginTop: '8px', background: '#1A202C', padding: '20px', borderRadius: '8px', textAlign: 'center', border: '1px dashed #4A5568' }}><span style={{fontSize: '0.8rem', color: '#718096'}}>Preview Foto belum tersedia</span></div></div>}
                        </div>
                    )}
                </div>
            ) : (
                loading ? <div className="loading-text">Mengambil Data...</div> : stats ? (
                <>
                    {!isViewingChild && hasHierarchy && (
                    <div className="sidebar-section hierarchy-section">
                        <h3>🏢 Struktur Organisasi</h3>
                        {/* ... HIERARCHY CONTENT ... */}
                        {hierarchy.cabang_pembantu?.length > 0 && (
                        <div className="hierarchy-group">
                            <div className="hierarchy-header" onClick={() => setExpandedSection(expandedSection === 'pembantu' ? '' : 'pembantu')}>
                            <span>📍 Cabang Pembantu ({hierarchy.cabang_pembantu.length})</span>
                            {expandedSection === 'pembantu' ? <MdExpandLess/> : <MdExpandMore/>}
                            </div>
                            {expandedSection === 'pembantu' && (
                            <div className="hierarchy-list">
                                {hierarchy.cabang_pembantu.map(item => (
                                <div key={item.id} className="hierarchy-item clickable" onClick={() => handleUnitClick(item)}><span>{item.name}</span><span className="count-badge">{item.reports_count}</span></div>
                                ))}
                            </div>
                            )}
                        </div>
                        )}
                        {hierarchy.units?.length > 0 && (
                        <div className="hierarchy-group" style={{marginTop: '8px'}}>
                            <div className="hierarchy-header" onClick={() => setExpandedSection(expandedSection === 'unit' ? '' : 'unit')}>
                            <span>📦 Unit ({hierarchy.units.length})</span>
                            {expandedSection === 'unit' ? <MdExpandLess/> : <MdExpandMore/>}
                            </div>
                            {expandedSection === 'unit' && (
                            <div className="hierarchy-list">
                                {hierarchy.units.map(item => (
                                <div key={item.id} className="hierarchy-item clickable" onClick={() => handleUnitClick(item)}><span>{item.name}</span><span className="count-badge">{item.reports_count}</span></div>
                                ))}
                            </div>
                            )}
                        </div>
                        )}
                        <div className="hierarchy-summary"><p>Total: {hierarchy.total_children} lokasi di bawah {activeAirport.name}</p></div>
                    </div>
                    )}
                    <hr className="divider" />
                    
                    <div className="sidebar-section">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <h3 style={{ margin: 0 }}>Tren Bulanan</h3>
                            {(!globalStartDate && !globalEndDate) && (
                            <div className="quick-filter-group">
                                <button className={`qf-btn ${quickFilter === '6m' ? 'active' : ''}`} onClick={() => setQuickFilter('6m')}>6B</button>
                                <button className={`qf-btn ${quickFilter === '12m' ? 'active' : ''}`} onClick={() => setQuickFilter('12m')}>1T</button>
                                <button className={`qf-btn ${quickFilter === 'all' ? 'active' : ''}`} onClick={() => setQuickFilter('all')}>ALL</button>
                            </div>
                            )}
                        </div>
                        <div className="chart-scroll-wrapper" ref={scrollContainerRef}>
                            <div style={{ width: '100%', minWidth: '400px', height: '200px' }}>
                            <Bar options={barChartOptions} data={barChartData} />
                            </div>
                        </div>
                    </div>

                    {detailView?.type === 'month' && renderDetailList(false)}

                    <hr className="divider" />

                    <div className="sidebar-section">
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                            <h3>Total per Kategori</h3>
                            <div style={{display: 'flex'}}>
                                <button 
                                    className={`toggle-btn ${categoryViewMode === 'list' ? 'active' : ''}`} 
                                    onClick={() => setCategoryViewMode('list')}
                                    title="Tampilan List"
                                >
                                    <MdList size={18} />
                                </button>
                                <button 
                                    className={`toggle-btn ${categoryViewMode === 'chart' ? 'active' : ''}`} 
                                    onClick={() => setCategoryViewMode('chart')}
                                    title="Tampilan Chart"
                                >
                                    <MdPieChart size={18} />
                                </button>
                            </div>
                        </div>

                        {categoryViewMode === 'chart' ? (
                            <div className="fade-in"> 
                                <div style={{height: '250px', position: 'relative', marginBottom: '15px'}}>
                                    {sortedCategories.length > 0 ? (
                                        <Doughnut data={doughnutData} options={doughnutOptions} />
                                    ) : <p className="no-data-text">Data kategori kosong.</p>}
                                </div>
                                
                                {sortedCategories.length > 0 && detailView?.type === 'category' && (
                                    <div style={{marginTop: '10px', marginBottom: '20px'}}>
                                        {renderDetailList(false)}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="category-list fade-in">
                                {sortedCategories.map(([category, count]) => {
                                const isActive = detailView?.type === 'category' && detailView.title === category;
                                return (
                                    <React.Fragment key={category}>
                                        <div className={`category-item clickable-category ${isActive ? 'active-accordion' : ''}`} onClick={() => fetchCategoryDetail(category)} title={`Lihat detail ${category}`}>
                                            <span className="category-name">{category}</span>
                                            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                                <span className="category-count">{count}</span>
                                                {isActive ? <MdExpandLess /> : <MdExpandMore style={{opacity: 0.5}} />}
                                            </div>
                                        </div>
                                        {isActive && renderDetailList(true)}
                                    </React.Fragment>
                                );
                                })}
                            </div>
                        )}
                    </div>
                </>
                ) : <p className="no-data-text">Data tidak ditemukan.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AirportSidebar;