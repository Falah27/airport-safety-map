import React, { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './AirportSidebar.css';
import { MdClose, MdCalendarToday, MdFilterList, MdRefresh } from 'react-icons/md';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AirportSidebar = ({ airport, onClose }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // --- STATE BARU UNTUK QUICK FILTER ---
  // Default: '12m' (12 Bulan Terakhir)
  const [quickFilter, setQuickFilter] = useState('12m'); 
  // -------------------------------------

  const [selectedMonth, setSelectedMonth] = useState(null);
  const [monthlyReports, setMonthlyReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const scrollContainerRef = useRef(null); 

  useEffect(() => {
      if (airport) {
          setStartDate(''); 
          setEndDate('');
          setStats(null);
          setSelectedMonth(null);
          setMonthlyReports([]);
          setQuickFilter('12m'); // Reset ke 12 bulan saat ganti bandara
      }
  }, [airport]);

  useEffect(() => {
    if (airport) {
      setLoading(true);
      let url = `http://localhost:8000/api/airports/${airport.id}/stats`;
      if (startDate && endDate) {
          url += `?start_date=${startDate}&end_date=${endDate}`;
      }
      fetch(url).then(r=>r.json()).then(d=>{setStats(d);setLoading(false);}).catch(e=>{console.error(e);setLoading(false)});
    }
  }, [airport, startDate, endDate]);

  // Auto scroll ke kanan saat data / filter berubah
  useEffect(() => {
    if (stats && scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, [stats, quickFilter]); // <-- Tambahkan quickFilter sebagai trigger

  // --- LOGIKA PEMOTONGAN DATA (SLICING) ---
  const getFilteredChartData = () => {
    if (!stats?.monthly_trend) return { labels: [], values: [] };

    const allLabels = Object.keys(stats.monthly_trend);
    const allValues = Object.values(stats.monthly_trend);
    const totalData = allLabels.length;

    // Jika User pakai Date Picker Manual, abaikan Quick Filter (Tampilkan semua hasil filter)
    if (startDate && endDate) {
        return { labels: allLabels, values: allValues };
    }

    let sliceCount = totalData; // Default ALL

    if (quickFilter === '6m') sliceCount = 6;
    if (quickFilter === '12m') sliceCount = 12;
    // Jika 'all', sliceCount tetap totalData

    // Ambil N data TERAKHIR (dari belakang array)
    const startIdx = Math.max(totalData - sliceCount, 0);
    
    return {
        labels: allLabels.slice(startIdx),
        values: allValues.slice(startIdx)
    };
  };

  const { labels: chartLabels, values: chartValues } = getFilteredChartData();
  // ----------------------------------------

  const getMonthNumber = (m) => { const map = {'Jan':'01','Feb':'02','Mar':'03','Apr':'04','May':'05','Jun':'06','Jul':'07','Aug':'08','Sep':'09','Oct':'10','Nov':'11','Dec':'12','Mei':'05','Agu':'08','Okt':'10','Des':'12','Agustus':'08','October':'10','December':'12'}; return map[m]||'01'; };
  const fetchMonthlyDetail = (lbl) => { if(!lbl)return; const p=lbl.split(' '); const fm=`${p[1]}-${getMonthNumber(p[0])}`; setSelectedMonth(lbl); setLoadingReports(true); fetch(`http://localhost:8000/api/airports/${airport.id}/reports?month=${fm}`).then(r=>r.json()).then(d=>{setMonthlyReports(d);setLoadingReports(false)}).catch(e=>{console.error(e);setLoadingReports(false)}); };
  const formatDate = (ds) => { if(!ds)return'-'; try{return new Date(ds.replace(' ','T')).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'});}catch(e){return ds;} };

  const isVisible = !!airport;

  // Chart Config (Pakai data hasil filtering tadi)
  const minBarWidth = 50; 
  const chartWidth = Math.max(chartLabels.length * minBarWidth, 300) + 50; 

  const chartData = {
    labels: chartLabels, // <-- PAKAI VARIABEL FILTERED
    datasets: [{
      label: 'Kejadian', 
      data: chartValues, // <-- PAKAI VARIABEL FILTERED
      backgroundColor: (ctx) => ctx.chart.data.labels[ctx.dataIndex] === selectedMonth ? '#F6E05E' : '#4A90E2',
      borderRadius: 4, barPercentage: 0.6,
    }],
  };

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    onClick: (evt, el) => { if (el.length > 0) fetchMonthlyDetail(chartLabels[el[0].index]); },
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, grid: { color: '#2D3748' }, ticks: { color: '#A0AEC0' } }, x: { grid: { display: false }, ticks: { color: '#A0AEC0' } } }
  };

  const sortedCategories = stats?.top_categories ? Object.entries(stats.top_categories).sort(([,a], [,b]) => b - a) : [];
  const [topName, topCount] = sortedCategories.length > 0 ? sortedCategories[0] : ['-', 0];

  return (
    <div className={`sidebar ${isVisible ? 'visible' : 'hidden'}`}>
      {airport && (
        <div className="sidebar-content">
          
          <div className="sidebar-fixed-header">
             <button onClick={onClose} className="close-btn"><MdClose /></button>
             <h2>{airport.name}</h2>
             <p>{airport.city}, {airport.provinsi}</p>
             
             {/* --- DATE PICKER UI (NEW DESIGN) --- */}
             <div className={`date-filter-wrapper ${startDate && endDate ? 'active-filter' : ''}`}>
                
                {/* Header Kecil */}
                <div className="filter-header">
                    <div className="filter-title">
                        <MdFilterList className="filter-icon" />
                        <span>Rentang Waktu</span>
                    </div>
                    
                    {/* Tombol Reset (Hanya muncul jika ada filter) */}
                    {(startDate || endDate) && (
                        <button 
                            className="btn-reset-icon" 
                            onClick={() => {setStartDate(''); setEndDate('');}}
                            title="Reset Filter"
                        >
                           <MdRefresh />
                        </button>
                    )}
                </div>

                {/* Input Container (Dibuat seperti kapsul) */}
                <div className="date-input-group">
                    <div className="date-field">
                        <span className="date-label">Mulai</span>
                        <input 
                            type="date" 
                            value={startDate} 
                            onChange={(e) => setStartDate(e.target.value)} 
                            className="date-input-modern"
                        />
                    </div>
                    
                    <div className="date-separator-line"></div>
                    
                    <div className="date-field">
                        <span className="date-label">Sampai</span>
                        <input 
                            type="date" 
                            value={endDate} 
                            onChange={(e) => setEndDate(e.target.value)} 
                            className="date-input-modern"
                        />
                    </div>
                </div>

             </div>
             {/* ---------------------------------- */}

             <hr className="divider" />

             {stats && (
                <div className="sidebar-section" style={{marginBottom: '15px'}}>
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
             <div style={{borderBottom: '1px solid #2D3748', margin: '0 -24px'}}></div>
          </div>

          <div className="sidebar-scroll-body">
            {loading ? <div className="loading-text">Mengambil Data...</div> : stats ? (
              <>
                <div className="sidebar-section" style={{marginTop: '20px'}}>
                  
                  {/* HEADER CHART DENGAN QUICK FILTER */}
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px'}}>
                      <h3 style={{margin:0}}>Tren Bulanan</h3>
                      
                      {/* TOMBOL QUICK FILTER (Hanya muncul jika tidak sedang pakai Date Picker) */}
                      {(!startDate && !endDate) && (
                          <div className="quick-filter-group">
                              <button className={`qf-btn ${quickFilter==='6m'?'active':''}`} onClick={()=>setQuickFilter('6m')}>6B</button>
                              <button className={`qf-btn ${quickFilter==='12m'?'active':''}`} onClick={()=>setQuickFilter('12m')}>1T</button>
                              <button className={`qf-btn ${quickFilter==='all'?'active':''}`} onClick={()=>setQuickFilter('all')}>ALL</button>
                          </div>
                      )}
                  </div>
                  {/* ---------------------------------- */}

                  <div className="chart-scroll-wrapper" ref={scrollContainerRef}>
                    <div style={{ width: '100%', minWidth: `${chartWidth}px`, height: '200px' }}>
                       {chartLabels.length > 0 ? (
                          <Bar options={chartOptions} data={chartData} />
                       ) : <div className="chart-container"><p className="no-data-text">Tidak ada data.</p></div>}
                    </div>
                  </div>
                </div>

                {selectedMonth && (
                  <div className="sidebar-section fade-in">
                    <div className="detail-header-row">
                      <h3 style={{marginBottom:0, color:'#F6E05E'}}>Detail: {selectedMonth}</h3>
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
                    ) : <p className="no-data-text">Tidak ada laporan.</p>}
                  </div>
                )}

                <hr className="divider" />

                <div className="sidebar-section">
                  <h3>Total per Kategori</h3>
                  <div className="category-list">
                    {sortedCategories.map(([category, count]) => (
                      <div key={category} className="category-item">
                        <span className="category-name" title={category}>{category}</span>
                        <span className="category-count">{count}</span>
                      </div>
                    ))}
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