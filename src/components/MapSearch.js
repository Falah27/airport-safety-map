import React from 'react';
import Select from 'react-select';
import './MapSearch.css';

// (customStyles Anda yang dark mode tetap di sini)
const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: 'rgba(26, 32, 44, 0.9)', 
    borderRadius: '8px',
    border: 'none',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
    '&:hover': {
      borderColor: '#4A5568'
    }
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: '#1A202C',
    border: '1px solid #2D3748',
    borderRadius: '8px',
    marginTop: '8px'
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#2D3748' : '#1A202C',
    color: state.isSelected ? '#4A90E2' : '#E2E8F0',
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: '#2D3748'
    }
  }),
  singleValue: (provided) => ({ ...provided, color: '#E2E8F0' }),
  input: (provided) => ({ ...provided, color: '#E2E8F0' }),
  placeholder: (provided) => ({ ...provided, color: '#718096' })
};


// 1. TAMBAHKAN 'selectedAirport' DI SINI
const MapSearch = ({ airports, onAirportSelect, selectedAirport }) => {
  
  const options = airports.map(airport => ({
    value: airport, 
    label: `${airport.name} (${airport.city})` 
  }));

  // 2. Perbaiki handleChange agar bisa menangani 'null' (saat 'x' di search DITEKAN)
  const handleChange = (selectedOption) => {
    // selectedOption akan null jika user klik "x" di search box
    onAirportSelect(selectedOption ? selectedOption.value : null);
  };

  // 3. LOGIKA BARU: Tentukan value-nya berdasarkan prop
  //    Ini akan merespons saat sidebar ditutup (selectedAirport jadi null)
  const currentValue = selectedAirport 
    ? options.find(option => option.value.id === selectedAirport.id) 
    : null;

  return (
    <div className="search-container">
      <Select 
        options={options}
        onChange={handleChange}
        value={currentValue} // 4. TAMBAHKAN PROP 'value' INI
        styles={customStyles}
        placeholder="Cari lokasi cabang..."
        isClearable
      />
    </div>
  );
};

export default MapSearch;