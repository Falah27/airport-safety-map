import React, { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './AirportSidebar.css';
import { MdClose, MdLocationOn, MdNotes, MdCalendarToday, MdFilterList, MdRefresh, MdRouter, MdFlight } from 'react-icons/md';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AirportSidebar = ({ airport, onClose }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [monthlyReports, setMonthlyReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const scrollContainerRef = useRef(null); 

  // Reset saat ganti bandara
  useEffect(() => {
      if (airport) {
          setStartDate(''); setEndDate(''); setStats(null); setSelectedMonth(null); setMonthlyReports([]);
      }
  }, [airport]);

  // Fetch Data (HANYA JIKA BUKAN UNIT)
  useEffect(() => {
    // Cek: Airport harus ada, dan BUKAN unit
    if (airport && !airport.isUnit) {
      setLoading(true);
      let url = `http://localhost:8000/api/airports/${airport.id}/stats`;
      if (startDate && endDate) url += `?start_date=${startDate}&end_date=${endDate}`;

      fetch(url).then(res => res.json()).then(data => { setStats(data); setLoading(false); })
        .catch(err => { console.error(err); setLoading(false); });
    } else {
      setStats(null); // Unit tidak punya stats
    }
  }, [airport, startDate, endDate]);

  // Helper Functions (Sama seperti sebelumnya)
  const getMonthNumber = (m) => { const map = {'Jan':'01','Feb':'02','Mar':'03','Apr':'04','May':'05','Jun':'06','Jul':'07','Aug':'08','Sep':'09','Oct':'10','Nov':'11','Dec':'12','Mei':'05','Agu':'08','Okt':'10','Des':'12','Agustus':'08','October':'10','December':'12'}; return map[m]||'01'; };
  const fetchMonthlyDetail = (lbl) => { if(!lbl || !airport) return; const p=lbl.split(' '); const fm=`${p[1]}-${getMonthNumber(p[0])}`; setSelectedMonth(lbl); setLoadingReports(true); fetch(`http://localhost:8000/api/airports/${airport.id}/reports?month=${fm}`).then(r=>r.json()).then(d=>{setMonthlyReports(d);setLoadingReports(false)}).catch(e=>{console.error(e);setLoadingReports(false)}); };
  const formatDate = (ds) => { if(!ds)return'-'; try{return new Date(ds.replace(' ','T')).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'});}catch(e){return ds;} };

  const isVisible = !!airport;

  // Chart Config
  const labels = stats?.monthly_trend ? Object.keys(stats.monthly_trend) : [];
  const values = stats?.monthly_trend ? Object.values(stats.monthly_trend) : [];
  const chartWidth = Math.max(labels.length * 50, 300) + 50; 
  const chartData = { labels: labels, datasets: [{ label: 'Kejadian', data: values, backgroundColor: (ctx) => ctx.chart.data.labels[ctx.dataIndex] === selectedMonth ? '#F6E05E' : '#4A90E2', borderRadius: 4, barPercentage: 0.6, }], };
  const chartOptions = { responsive: true, maintainAspectRatio: false, onClick: (evt, el) => { if (el.length > 0) fetchMonthlyDetail(labels[el[0].index]); }, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: '#2D3748', drawBorder: false }, ticks: { color: '#A0AEC0' } }, x: { grid: { display: false }, ticks: { color: '#A0AEC0' } } } };
  const sortedCategories = stats?.top_categories ? Object.entries(stats.top_categories).sort(([,a], [,b]) => b - a) : [];
  const [topName, topCount] = sortedCategories.length > 0 ? sortedCategories[0] : ['-', 0];

  return (
    <div className={`sidebar ${isVisible ? 'visible' : 'hidden'}`}>
      
      {airport && (
        <div className="sidebar-content">
          
          {/* HEADER STATIS */}
          <div className="sidebar-fixed-header">
             <button onClick={onClose} className="close-btn"><MdClose /></button>
             <h2>{airport.name}</h2>
             <p>{airport.city}, {airport.provinsi}</p>
             
             {/* Filter Tanggal (Hanya untuk Cabang Utama) */}
             {!airport.isUnit && (
                <div className="date-filter-wrapper">
                    <div className="filter-header">
                        <span className="filter-label"><MdFilterList /> Filter Tanggal</span>
                        {(startDate || endDate) && (<button className="btn-reset-filter" onClick={() => {setStartDate(''); setEndDate('');}}>Reset</button>)}
                    </div>
                    <div className="date-inputs">
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="date-input" />
                        <span className="date-separator">-</span>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="date-input" />
                    </div>
                </div>
             )}

             <hr className="divider" />

             {/* RANGKUMAN (Hanya untuk Cabang Utama) */}
             {!airport.isUnit && stats && (
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

          {/* BODY SCROLLABLE */}
          <div className="sidebar-scroll-body">

            {/* --- TAMPILAN 1: JIKA INI UNIT (ANAK) --- */}
            {airport.isUnit ? (
                <div className="sidebar-section" style={{marginTop: '20px'}}>
                    <div className="report-card" style={{borderLeft: '4px solid #FC8181'}}>
                        <h3 style={{color: 'white', marginBottom: '10px', fontSize: '1.1rem'}}>Informasi Unit</h3>
                        <div style={{color: '#CBD5E0', fontSize: '0.9rem', marginBottom: '15px'}}>
                            <strong>Induk Cabang:</strong> <br/> {airport.parentName || 'N/A'}
                        </div>
                        <div style={{color: '#CBD5E0', fontSize: '0.9rem'}}>
                            <strong>Jenis Pelayanan:</strong><br/>
                            <span style={{color: '#A0AEC0', fontSize: '0.85rem', whiteSpace: 'pre-wrap'}}>
                                {airport.service || 'Data tidak tersedia'}
                            </span>
                        </div>
                    </div>
                    <p className="no-data-text" style={{marginTop: '20px'}}>
                        Data laporan keselamatan terpusat pada Cabang Induk.
                    </p>
                </div>
            ) : (
            /* --- TAMPILAN 2: JIKA INI CABANG (BAPAK) --- */
              <>
                {loading ? <div className="loading-text">Mengambil Data...</div> : stats ? (
                  <>
                    <div className="sidebar-section" style={{marginTop: '20px'}}>
                      <h3>Tren Bulanan <span className="subtitle">(Geser)</span></h3>
                      <div className="split-chart-wrapper">
                        <div className="fixed-y-axis"></div>
                        <div className="scrollable-chart-area" ref={scrollContainerRef}>
                          <div style={{ width: '100%', minWidth: `${chartWidth}px`, height: '200px' }}>
                            {labels.length > 0 ? (
                                <Bar options={chartOptions} data={chartData} />
                            ) : <div className="chart-container"><p className="no-data-text">Tidak ada data.</p></div>}
                          </div>
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
              </>
            )}

            {/* --- DAFTAR UNIT BAWAHAN (Hanya muncul di Cabang Utama) --- */}
            {airport.sub_units && Array.isArray(airport.sub_units) && airport.sub_units.length > 0 && (
                <>
                  <hr className="divider" />
                  <div className="sidebar-section">
                      <h3>Unit di Bawah Naungan ({airport.sub_units.length})</h3>
                      <div className="category-list" style={{maxHeight: '300px', overflowY: 'auto'}}>
                      {airport.sub_units.map((unit, idx) => (
                          <div key={idx} className="category-item" style={{alignItems: 'flex-start', flexDirection: 'column', gap: '5px'}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '8px', width: '100%'}}>
                                <MdRouter style={{color: '#FC8181'}} />
                                <span className="category-name" style={{color: 'white', fontWeight: 'bold'}}>{unit.name}</span>
                            </div>
                            {unit.service && (
                                <span className="category-name" style={{fontSize: '0.7rem', color: '#A0AEC0', whiteSpace: 'normal', lineHeight: '1.2', marginLeft: '24px'}}>
                                    {unit.service}
                                </span>
                            )}
                          </div>
                      ))}
                      </div>
                  </div>
                </>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default AirportSidebar;