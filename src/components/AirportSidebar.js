import React, { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './AirportSidebar.css';
import { MdClose, MdLocationOn, MdNotes, MdCalendarToday } from 'react-icons/md';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AirportSidebar = ({ airport, onClose }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [monthlyReports, setMonthlyReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  
  const scrollContainerRef = useRef(null); 
  
  useEffect(() => {
    if (airport) {
      setLoading(true);
      setStats(null);
      setSelectedMonth(null);
      setMonthlyReports([]);
      
      fetch(`http://localhost:8000/api/airports/${airport.id}/stats`)
        .then(res => res.json())
        .then(data => {
          setStats(data);
          setLoading(false);
        })
        .catch(err => { console.error(err); setLoading(false); });
    }
  }, [airport]);

  // Auto scroll grafik ke kanan
  useEffect(() => {
    if (stats && scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, [stats]);

  const getMonthNumber = (monthName) => {
    const map = {
      'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
      'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12',
      'Mei': '05', 'Agu': '08', 'Okt': '10', 'Des': '12',
      'Agustus': '08', 'October': '10', 'December': '12'
    };
    return map[monthName] || '01'; 
  };

  const fetchMonthlyDetail = (monthLabel) => {
    if (!monthLabel) return;
    const parts = monthLabel.split(' ');
    const monthName = parts[0]; 
    const yearStr = parts[1];
    const monthCode = getMonthNumber(monthName);
    const formattedMonth = `${yearStr}-${monthCode}`;

    setSelectedMonth(monthLabel);
    setLoadingReports(true);

    fetch(`http://localhost:8000/api/airports/${airport.id}/reports?month=${formattedMonth}`)
      .then(res => res.json())
      .then(data => {
        setMonthlyReports(data);
        setLoadingReports(false);
      })
      .catch(err => { console.error(err); setLoadingReports(false); });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const safeDate = dateString.replace(' ', 'T');
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    try {
      return new Date(safeDate).toLocaleDateString('id-ID', options);
    } catch (e) {
      return dateString;
    }
  };

  const isVisible = !!airport;

  const labels = stats?.monthly_trend ? Object.keys(stats.monthly_trend) : [];
  const values = stats?.monthly_trend ? Object.values(stats.monthly_trend) : [];
  const minBarWidth = 50; 
  const chartWidth = Math.max(labels.length * minBarWidth, 300); 

  const chartData = {
    labels: labels,
    datasets: [{
      label: 'Kejadian',
      data: values,
      backgroundColor: (context) => {
        const index = context.dataIndex;
        const label = labels[index];
        return label === selectedMonth ? '#F6E05E' : '#4A90E2';
      },
      borderRadius: 4,
      barPercentage: 0.6,
      categoryPercentage: 0.8, 
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, 
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const monthLabel = labels[index];
        fetchMonthlyDetail(monthLabel);
      }
    },
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: '#2D3748' }, ticks: { color: '#A0AEC0' } },
      x: { grid: { display: false }, ticks: { color: '#A0AEC0' } }
    }
  };

  const sortedCategories = stats?.top_categories 
    ? Object.entries(stats.top_categories).sort(([,countA], [,countB]) => countB - countA)
    : [];
  const topIncident = sortedCategories.length > 0 ? sortedCategories[0] : ['-', 0];
  const [topName, topCount] = topIncident;

  return (
    <div className={`sidebar ${isVisible ? 'visible' : 'hidden'}`}>
      <button onClick={onClose} className="close-btn"><MdClose /></button>

      {airport && (
        <div className="sidebar-content">
          
          <div className="sidebar-header">
            <h2>{airport.name}</h2>
            <p>{airport.city}, {airport.provinsi}</p>
          </div>

          <hr className="divider" />

          {loading ? <div className="text-center py-10 text-gray-400">Mengambil Data...</div> : stats ? (
            <>
              <div className="sidebar-section">
                <h3>Rangkuman Laporan</h3>
                <div className="stats-grid-reports-2plus1">
                  <div className="stat-item"><span className="stat-value">{stats.total_all_time}</span><span className="stat-label">Total</span></div>
                  <div className="stat-item"><span className="stat-value">{Object.keys(stats.top_categories).length}</span><span className="stat-label">Jml. Kategori</span></div>
                  <div className="stat-item-full">
                    <span className="stat-label">Insiden Teratas</span>
                    <div className="top-incident-content">
                      <span className="stat-value-name">{topName}</span>
                      <span className="stat-value open">{topCount}</span>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="divider" />

              <div className="sidebar-section">
                <h3>Tren Bulanan <span style={{fontSize:'0.7rem', fontWeight:'normal', color:'#718096'}}>(Geser untuk lihat histori)</span></h3>
                <div className="chart-scroll-wrapper" ref={scrollContainerRef}>
                  {labels.length > 0 ? (
                      <div style={{ width: `${chartWidth}px`, height: '220px' }}>
                        <Bar options={chartOptions} data={chartData} />
                      </div>
                  ) : (
                      <div className="chart-container flex items-center justify-center">
                        <p className="no-data-text">Belum ada data tren.</p>
                      </div>
                  )}
                </div>
              </div>

              {selectedMonth && (
                <div className="sidebar-section fade-in">
                  <div className="flex justify-between items-center mb-2">
                    <h3 style={{marginBottom:0, color:'#F6E05E'}}>Detail: {selectedMonth}</h3>
                    <button onClick={() => setSelectedMonth(null)} className="btn-close-detail">Tutup <MdClose /></button>
                  </div>
                  
                  {loadingReports ? (
                    <p className="no-data-text">Memuat detail...</p>
                  ) : monthlyReports.length > 0 ? (
                    <div className="monthly-reports-list">
                      {monthlyReports.map((report, idx) => (
                        <div key={idx} className="report-card">
                          <div className="report-header">
                            <span className="report-date"><MdCalendarToday /> {formatDate(report.report_date)}</span>
                            <span className="report-category">{report.category}</span>
                          </div>
                          {report.description && (
                            <p className="report-desc">{report.description}</p>
                          )}
                          {report.status && (
                             <span className="report-status">{report.status}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-data-text">Tidak ada laporan detail di bulan ini.</p>
                  )}
                </div>
              )}

              <hr className="divider" />

              <div className="sidebar-section">
                <h3>Total per Kategori</h3>
                <div className="category-list">
                  {sortedCategories.map(([category, count]) => (
                    <div className="category-item" key={category}>
                      <span className="category-name" title={category}>{category}</span>
                      <span className="category-count">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : <p className="no-data-text">Data tidak ditemukan.</p>}
        </div>
      )}
    </div>
  );
};

export default AirportSidebar;