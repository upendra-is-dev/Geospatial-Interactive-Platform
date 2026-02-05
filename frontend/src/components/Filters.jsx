import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { graphqlClient } from '../utils/graphqlClient';
import { GET_STATES, GET_CITIES } from '../graphql/queries';
import './Filters.css';

const Filters = ({ onStateChange, onCityChange, selectedState, selectedCity, year }) => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [error, setError] = useState(null);

  // Load states on mount
  useEffect(() => {
    const loadStates = async () => {
      try {
        setLoadingStates(true);
        setError(null);
        const data = await graphqlClient.request(GET_STATES);
        const formattedStates = data.states.map(state => ({
          value: state.id,
          label: `${state.name} (${state.code})`,
          ...state
        }));
        setStates(formattedStates);
      } catch (err) {
        console.error('Error loading states:', err);
        setError('Failed to load states');
      } finally {
        setLoadingStates(false);
      }
    };

    loadStates();
  }, []);

  // Load cities when state changes
  useEffect(() => {
    if (!selectedState) {
      setCities([]);
      return;
    }

    const loadCities = async () => {
      try {
        setLoadingCities(true);
        setError(null);
        const data = await graphqlClient.request(GET_CITIES, {
          stateId: selectedState.value
        });
        const formattedCities = data.cities.map(city => ({
          value: city.id,
          label: city.name,
          ...city
        }));
        setCities(formattedCities);
      } catch (err) {
        console.error('Error loading cities:', err);
        setError('Failed to load cities');
      } finally {
        setLoadingCities(false);
      }
    };

    loadCities();
  }, [selectedState]);

  const handleStateChange = (option) => {
    onStateChange(option);
    onCityChange(null); // Reset city when state changes
  };

  const handleCityChange = (option) => {
    onCityChange(option);
  };

  return (
    <div className="filters-container">
      <div className="filters-header">
        <h2>Filters</h2>
        {error && <div className="error-message">{error}</div>}
      </div>
      
      <div className="filter-group">
        <label htmlFor="state-filter">State</label>
        <Select
          id="state-filter"
          options={states}
          value={selectedState}
          onChange={handleStateChange}
          isLoading={loadingStates}
          isClearable
          placeholder="Select a state..."
          className="filter-select"
          classNamePrefix="react-select"
        />
      </div>

      <div className="filter-group">
        <label htmlFor="city-filter">City</label>
        <Select
          id="city-filter"
          options={cities}
          value={selectedCity}
          onChange={handleCityChange}
          isLoading={loadingCities}
          isDisabled={!selectedState}
          isClearable
          placeholder={selectedState ? "Select a city..." : "Select a state first"}
          className="filter-select"
          classNamePrefix="react-select"
        />
      </div>

      <div className="filter-group">
        <label htmlFor="year-filter">Year</label>
        <div className="year-display">{year}</div>
      </div>
    </div>
  );
};

export default Filters;
