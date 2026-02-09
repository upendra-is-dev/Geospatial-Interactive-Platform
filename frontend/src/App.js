import React, { useState, useEffect, useCallback } from 'react';
import MapView from './components/MapView';
import Filters from './components/Filters';
import { graphqlClient } from './utils/graphqlClient';
import { GET_METRICS } from './graphql/queries';
import './App.css';

const DEFAULT_YEAR = 2024;

function App() {
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [, setViewState] = useState(null);

  // Load metrics when filters change
  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setLoading(true);
        setError(null);

        const variables = {
          year: DEFAULT_YEAR,
        };

        if (selectedState) {
          variables.stateId = selectedState.value;
        }

        if (selectedCity) {
          variables.cityId = selectedCity.value;
        }

        const data = await graphqlClient.request(GET_METRICS, variables);
        setMetrics(data?.metrics || []);
      } catch (err) {
        console.error('Error loading metrics:', err);
        setError('Failed to load population data');
        setMetrics([]);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [selectedState, selectedCity]);

  const handleStateChange = useCallback((state) => {
    setSelectedState(state);
  }, []);

  const handleCityChange = useCallback((city) => {
    setSelectedCity(city);
  }, []);

  const handleViewStateChange = useCallback((newViewState) => {
    setViewState(newViewState);
  }, []);

  return (
    <div className="App">
      <Filters
        selectedState={selectedState}
        selectedCity={selectedCity}
        onStateChange={handleStateChange}
        onCityChange={handleCityChange}
        year={DEFAULT_YEAR}
      />
      
      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      <MapView
        metrics={metrics}
        selectedState={selectedState}
        selectedCity={selectedCity}
        loading={loading}
        onViewStateChange={handleViewStateChange}
      />
    </div>
  );
}

export default App;
