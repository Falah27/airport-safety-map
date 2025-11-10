// Data Bandara di Seluruh Indonesia
// format: [latitude, longitude]
// Latitude: (-) adalah LS (Selatan), (+) adalah LU (Utara)
// Longitude: (+) adalah BT (Timur)

export const airportData = [
  // Bandara yang sudah ada sebelumnya
  {
    id: "CGK",
    name: "Bandara Internasional Soekarno-Hatta",
    city: "Tangerang",
    coordinates: [-6.1256, 106.6559],
    safetyReport: {
      rating: "A+",
      lastInspection: "2025-10-01",
      notes: "Semua fasilitas dalam kondisi prima."
    }
  },
  {
    id: "DPS",
    name: "Bandara Internasional Ngurah Rai",
    city: "Denpasar",
    coordinates: [-8.7475, 115.1691],
    safetyReport: {
      rating: "A",
      lastInspection: "2025-09-15",
      notes: "Perlu peningkatan di area landasan pacu B."
    }
  },
  
  // Data Baru dari Daftar Anda
  {
    id: "MLI",
    name: "Bandara Mali",
    city: "Alor",
    coordinates: [-8.217, 124.571],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "AMQ",
    name: "Bandara Pattimura",
    city: "Ambon",
    coordinates: [-3.7075, 128.0894],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "AMI",
    name: "Bandara Selaparang",
    city: "Ampenan",
    coordinates: [-8.5605, 116.0941],
    safetyReport: { rating: "C", lastInspection: "2025-01-01", notes: "Ditutup untuk penerbangan komersial." }
  },
  {
    id: "BPN",
    name: "Bandara Sultan Aji Muhammad Sulaiman Sepinggan",
    city: "Balikpapan",
    coordinates: [-1.2683, 116.8944],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "BTJ",
    name: "Bandara Sultan Iskandar Muda",
    city: "Banda Aceh",
    coordinates: [5.5202, 95.4209],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "TKG",
    name: "Bandara Radin Inten II",
    city: "Bandar Lampung",
    coordinates: [-5.2425, 105.1788],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "BDJ",
    name: "Bandara Syamsudin Noor",
    city: "Banjarmasin",
    coordinates: [-3.4422, 114.7625],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "BWX",
    name: "Bandara Banyuwangi",
    city: "Banyuwangi",
    coordinates: [-8.3106, 114.3401],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "BTH",
    name: "Bandara Hang Nadim",
    city: "Batam",
    coordinates: [1.1234, 104.1153],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "BUW",
    name: "Bandara Betoambari",
    city: "Bau-Bau",
    coordinates: [-5.5166, 122.5500],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "BKS",
    name: "Bandara Fatmawati Soekarno",
    city: "Bengkulu",
    coordinates: [-3.8619, 102.3366],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "BEJ",
    name: "Bandara Kalimarau",
    city: "Berau",
    coordinates: [2.0033, 117.4311],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "BIK",
    name: "Bandara Frans Kaisiepo",
    city: "Biak",
    coordinates: [-1.1900, 136.1075],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "BMU",
    name: "Bandara Sultan Muhammad Salahuddin",
    city: "Bima",
    coordinates: [-8.5397, 118.6872],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "CXP",
    name: "Bandara Tunggul Wulung",
    city: "Cilacap",
    coordinates: [-7.6450, 109.0341],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "CBJ",
    name: "Bandara Budiarto",
    city: "Curug",
    coordinates: [-6.2909, 106.5661],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "DOB",
    name: "Bandara Rar Gwamar",
    city: "Dobo",
    coordinates: [-5.7716, 134.2125],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "ENE",
    name: "Bandara H. Hasan Aroeboesman",
    city: "Ende",
    coordinates: [-8.8492, 121.6606],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "FKQ",
    name: "Bandara Torea",
    city: "Fak Fak",
    coordinates: [-2.9200, 132.2669],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "GTO",
    name: "Bandara Djalaluddin",
    city: "Gorontalo",
    coordinates: [0.6372, 122.8498],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "GNS",
    name: "Bandara Binaka",
    city: "Gunung Sitoli",
    coordinates: [1.1661, 97.7044],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "KDI",
    name: "Bandara Haluoleo",
    city: "Kendari",
    coordinates: [-4.0816, 122.4182],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "ILX",
    name: "Bandara Aminggaru",
    city: "Ilaga",
    coordinates: [-3.9996, 137.6528],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "DJJ",
    name: "Bandara Sentani",
    city: "Jayapura",
    coordinates: [-2.5769, 140.5161],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "JBB",
    name: "Bandara Notohadinegoro",
    city: "Jember",
    coordinates: [-8.2411, 113.6938],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "KNG",
    name: "Bandara Utarom",
    city: "Kaimana",
    coordinates: [-3.6444, 133.6952],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "KWB",
    name: "Bandara Dewadaru",
    city: "Karimun Jawa",
    coordinates: [-5.8011, 110.4786],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "KTG",
    name: "Bandara Rahadi Oesman",
    city: "Ketapang",
    coordinates: [-1.8163, 109.9633],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "KKA",
    name: "Bandara Sangia Nibandera",
    city: "Kolaka",
    coordinates: [-4.3411, 121.5238],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "LBJ",
    name: "Bandara Komodo",
    city: "Labuan Bajo",
    coordinates: [-8.4866, 119.8891],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "KOE",
    name: "Bandara El Tari",
    city: "Kupang",
    coordinates: [-10.1713, 123.6711],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "LAH",
    name: "Bandara Oesman Sadik",
    city: "Labuha",
    coordinates: [-0.6373, 127.5007],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "LUV",
    name: "Bandara Karel Sadsuitubun",
    city: "Langgur",
    coordinates: [-5.7602, 132.7594],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "LSE",
    name: "Bandara Lasondre",
    city: "Pulau-Pulau Batu",
    coordinates: [-0.0186, 98.2991],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "LWE",
    name: "Bandara Wunopito",
    city: "Lewoleba",
    coordinates: [-8.3625, 123.4380],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "LPU",
    name: "Bandara Long Apung",
    city: "Long Apung",
    coordinates: [1.7036, 114.9702],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "MLG",
    name: "Bandara Abdul Rachman Saleh",
    city: "Malang",
    coordinates: [-7.9283, 112.7133],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "MJU",
    name: "Bandara Tampa Padang",
    city: "Mamuju",
    coordinates: [-2.5866, 119.0291],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "MDC",
    name: "Bandara Sam Ratulangi",
    city: "Manado",
    coordinates: [1.5491, 124.9263],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "MKW",
    name: "Bandara Rendani",
    city: "Manokwari",
    coordinates: [-0.8916, 134.0491],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "RJM",
    name: "Bandara Marinda",
    city: "Raja Ampat",
    coordinates: [-0.4319, 130.7719],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "MOF",
    name: "Bandara Frans Seda",
    city: "Maumere",
    coordinates: [-8.6408, 122.2368],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "KNO",
    name: "Bandara Kualanamu",
    city: "Medan",
    coordinates: [3.6422, 98.8852],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "MKQ",
    name: "Bandara Mopah",
    city: "Merauke",
    coordinates: [-8.5202, 140.4183],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "JIO",
    name: "Bandara Jos Orno Imsula",
    city: "Moa",
    coordinates: [-8.1405, 127.9072],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "MOH",
    name: "Bandara Maleo",
    city: "Morowali",
    coordinates: [-2.2033, 121.6602],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "MRB",
    name: "Bandara Muara Bungo",
    city: "Muara Bungo",
    coordinates: [-1.5425, 102.1827],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "NBX",
    name: "Bandara Douw Aturure",
    city: "Nabire",
    coordinates: [-3.4007, 135.3967],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "NAM",
    name: "Bandara Namniwel",
    city: "Namlea",
    coordinates: [-3.2369, 127.1002],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "NRE",
    name: "Bandara Namrole",
    city: "Namrole",
    coordinates: [-3.8558, 126.6997],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "NNX",
    name: "Bandara Nunukan",
    city: "Nunukan",
    coordinates: [4.1366, 117.6669],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "PDG",
    name: "Bandara Internasional Minangkabau",
    city: "Padang",
    coordinates: [-0.7866, 100.2805],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "PKY",
    name: "Bandara Tjilik Riwut",
    city: "Palangkaraya",
    coordinates: [-2.2250, 113.9425],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "PLM",
    name: "Bandara Sultan Mahmud Badaruddin II",
    city: "Palembang",
    coordinates: [-2.9002, 104.7000],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "PLW",
    name: "Bandara Mutiara SIS Al-Jufri",
    city: "Palu",
    coordinates: [-0.9186, 119.9097],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "CJN",
    name: "Bandara Nusawiru",
    city: "Pangandaran",
    coordinates: [-7.7200, 108.4886],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "PGK",
    name: "Bandara Depati Amir",
    city: "Pangkal Pinang",
    coordinates: [-2.1619, 106.1388],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "PKU",
    name: "Bandara Sultan Syarif Kasim II",
    city: "Pekanbaru",
    coordinates: [0.4642, 101.4465],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "PPR",
    name: "Bandara Tuanku Tambusai",
    city: "Pasir Pangaraian",
    coordinates: [0.8454, 100.3698],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "PNK",
    name: "Bandara Supadio",
    city: "Pontianak",
    coordinates: [-0.1505, 109.4038],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "PSU",
    name: "Bandara Pangsuma",
    city: "Putussibau",
    coordinates: [0.8355, 112.9369],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "RTG",
    name: "Bandara Frans Sales Lega",
    city: "Ruteng",
    coordinates: [-8.5970, 120.4770],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "SBG",
    name: "Bandara Maimun Saleh",
    city: "Sabang",
    coordinates: [5.8744, 95.3407],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "AAP",
    name: "Bandara APT Pranoto",
    city: "Samarinda",
    coordinates: [-0.3736, 117.2555],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "SMQ",
    name: "Bandara H. Asan",
    city: "Sampit",
    coordinates: [-2.4991, 112.9750],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "SXK",
    name: "Bandara Mathias Kilmaskossu",
    city: "Saumlaki",
    coordinates: [-7.9869, 131.3061],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "SRG",
    name: "Bandara Jenderal Ahmad Yani",
    city: "Semarang",
    coordinates: [-6.9713, 110.3741],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "FLZ",
    name: "Bandara Ferdinand Lumban Tobing",
    city: "Sibolga",
    coordinates: [1.5558, 98.8888],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "DTB",
    name: "Bandara Sisingamangaraja XII",
    city: "Silangit",
    coordinates: [2.2597, 98.9952],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "SNB",
    name: "Bandara Lasikin",
    city: "Sinabang",
    coordinates: [2.4166, 96.3291],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "SKW",
    name: "Bandara Singkawang",
    city: "Singkawang",
    coordinates: [0.7909, 108.9578],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "SIQ",
    name: "Bandara Dabo",
    city: "Singkep",
    coordinates: [-0.4816, 104.5811],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "SOC",
    name: "Bandara Adi Soemarmo",
    city: "Solo",
    coordinates: [-7.5161, 110.7569],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "SOQ",
    name: "Bandara Domine Eduard Osok",
    city: "Sorong",
    coordinates: [-0.8903, 131.2884],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "SWQ",
    name: "Bandara Sultan Muhammad Kaharuddin III",
    city: "Sumbawa Besar",
    coordinates: [-8.4890, 117.4120],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "SUP",
    name: "Bandara Trunojoyo",
    city: "Sumenep",
    coordinates: [-7.0236, 113.8908],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "SUB",
    name: "Bandara Juanda",
    city: "Surabaya",
    coordinates: [-7.3797, 112.7869],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "TRT",
    name: "Bandara Buntu Kunik",
    city: "Tana Toraja",
    coordinates: [-3.1858, 119.9177],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "TBK",
    name: "Bandara Raja Haji Abdullah",
    city: "Tanjung Balai Karimun",
    coordinates: [1.0522, 103.3925],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "TJS",
    name: "Bandara Tanjung Harapan",
    city: "Tanjung Selor",
    coordinates: [2.8363, 117.3736],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "TJQ",
    name: "Bandara H.A.S. Hanandjoeddin",
    city: "Tanjung Pandan",
    coordinates: [-2.7441, 107.7545],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "TNJ",
    name: "Bandara Raja Haji Fisabilillah",
    city: "Tanjung Pinang",
    coordinates: [0.9183, 104.5266],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "TRK",
    name: "Bandara Juwata",
    city: "Tarakan",
    coordinates: [3.3266, 117.5655],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "TTE",
    name: "Bandara Sultan Babullah",
    city: "Ternate",
    coordinates: [0.8319, 127.3805],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "TIM",
    name: "Bandara Mozes Kilangin",
    city: "Timika",
    coordinates: [-4.5290, 136.8866],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "WGP",
    name: "Bandara Umbu Mehang Kunda",
    city: "Waingapu",
    coordinates: [-9.6691, 120.3019],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  },
  {
    id: "YIA",
    name: "Bandara Internasional Yogyakarta",
    city: "Yogyakarta",
    coordinates: [-7.9075, 110.0544],
    safetyReport: { rating: "B", lastInspection: "2025-01-01", notes: "Data belum tersedia." }
  }
];