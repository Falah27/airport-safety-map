import React, { useMemo } from 'react';
import Select from 'react-select';
import './MapSearch.css';

// Custom styles for dark mode select (static, no need to recreate)
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


const MapSearch = ({ airports, onAirportSelect, selectedAirport }) => {
  // Memoize options to avoid recreation on every render
  const options = useMemo(() => 
    airports.map(airport => ({
      value: airport, 
      label: `${airport.name} (${airport.city})` 
    })),
    [airports]
  );

  // Handle selection change (including clear action)
  const handleChange = (selectedOption) => {
    onAirportSelect(selectedOption ? selectedOption.value : null);
  };

  // Find current selected option based on selectedAirport prop
  const currentValue = useMemo(() => 
    selectedAirport 
      ? options.find(option => option.value.id === selectedAirport.id) 
      : null,
    [selectedAirport, options]
  );

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