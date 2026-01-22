# 🔧 Troubleshooting Guide - Airport Safety Map

## ❌ Error: "Backend tidak dapat diakses" / Marker tidak muncul

### Root Cause
Frontend tidak bisa connect ke Laravel backend karena server belum jalan.

### ✅ Solution

#### 1. Start Laravel Backend
```powershell
cd c:\xampp\htdocs\api-bandara
php artisan serve --host=0.0.0.0 --port=8000
```

**Expected Output:**
```
Starting Laravel development server: http://127.0.0.1:8000
PHP 7.4.30 Development Server (http://127.0.0.1:8000) started
```

#### 2. Verify Backend Running
```powershell
# Cek port 8000
Get-NetTCPConnection -LocalPort 8000 -State Listen

# Test API
Invoke-RestMethod -Uri "http://localhost:8000/api/airports" | Select-Object -First 2
```

#### 3. Start React Frontend
```powershell
cd F:\AirNav\SO\Task 1\react\airport-safety-map
npm start
```

#### 4. Refresh Browser
- Buka **http://localhost:3000**
- Tekan **F5** atau **Ctrl+R**
- Buka Console (**F12**) dan cek log:
  - ✅ `Fetching airports from: http://localhost:8000/api/airports`
  - ✅ `Total airports loaded: 389`
  - ✅ `Cabang Utama dengan koordinat valid: 28`
  - ✅ `Markers to render: 28`

---

## 🗺️ Data Structure

### Airport Object (dari Laravel API)
```json
{
  "id": "DPS",
  "parent_id": null,
  "name": "Cabang Denpasar",
  "city": "Denpasar",
  "provinsi": "Bali",
  "coordinates": [-8.7481, 115.1671],  // [latitude, longitude]
  "level": "cabang_utama",
  "total_reports": "489"
}
```

### Marker Filtering Logic
Hanya airport dengan kriteria berikut yang ditampilkan:
- `level === 'cabang_utama'`
- `coordinates !== null`
- `coordinates.length === 2`

---

## 🚀 Quick Start Commands

### Start Everything
```powershell
# Terminal 1: Laravel Backend
cd c:\xampp\htdocs\api-bandara
php artisan serve

# Terminal 2: React Frontend
cd F:\AirNav\SO\Task 1\react\airport-safety-map
npm start
```

### Check Status
```powershell
# Check Laravel
curl http://localhost:8000/api/airports

# Check React
curl http://localhost:3000
```

---

## 🔍 Common Issues

### Issue 1: Port 8000 Already in Use
```powershell
# Kill existing PHP processes
Get-Process php | Stop-Process -Force

# Restart Laravel
php artisan serve --port=8000
```

### Issue 2: CORS Error
Sudah dikonfigurasi di `c:\xampp\htdocs\api-bandara\config\cors.php`:
```php
'allowed_origins' => ['*'],
```

### Issue 3: Marker Tidak Muncul Meskipun Backend OK
- Cek browser console untuk error JavaScript
- Verify data coordinates format di response API
- Pastikan Leaflet CSS ter-load (cek Network tab)

---

## 📊 Expected Results

### Backend API Response
- **Total Airports:** 389
- **Cabang Utama:** 28
- **Cabang Utama with coordinates:** 28 (should match)

### Frontend Console Logs
```
🔍 Fetching airports from: http://localhost:8000/api/airports
✅ Total airports loaded: 389
📍 Cabang Utama dengan koordinat valid: 28
🗺️ MapDisplay - Total airports: 389
📍 Markers to render: 28
✅ Sample marker: {id: "DPS", name: "Cabang Denpasar", coordinates: Array(2), ...}
```

### Map Display
- 28 airport markers (pesawat icon) should appear on Indonesia map
- Clicking marker opens popup with airport details
- Sidebar opens when marker clicked

---

## 🛠️ Configuration Files

### React `.env`
```env
REACT_APP_API_URL=http://localhost:8000/api
```

### Laravel `.env`
```env
APP_URL=http://localhost:8000
DB_DATABASE=api_safety
FRONTEND_URLS=http://localhost:3000,http://localhost:3001
```

---

## 📞 Need Help?

1. Check both terminals (Laravel + React) for errors
2. Open browser console (F12) and check for JavaScript errors
3. Verify API response format using Postman or curl
4. Ensure MySQL/MariaDB running (check XAMPP Control Panel)

Last Updated: January 21, 2026
