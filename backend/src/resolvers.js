const fs = require('fs');
const path = require('path');

// Load data
let dataCache = null;

const loadData = () => {
  if (dataCache) return dataCache;
  
  try {
    const dataFile = path.join(__dirname, 'data', 'censusData.json');
    const rawData = fs.readFileSync(dataFile, 'utf8');
    dataCache = JSON.parse(rawData);
    return dataCache;
  } catch (error) {
    console.error('Error loading data:', error);
    // Fallback to sample data if file doesn't exist
    const { generateSampleData } = require('./data/sampleData');
    dataCache = generateSampleData();
    return dataCache;
  }
};

const resolvers = {
  Query: {
    states: () => {
      const data = loadData();
      return data.states;
    },

    cities: (parent, { stateId }) => {
      const data = loadData();
      return data.cities.filter(city => city.stateId === stateId);
    },

    metrics: (parent, { stateId, cityId, year }) => {
      const data = loadData();
      let filtered = data.metrics.filter(m => m.year === year);

      if (stateId) {
        filtered = filtered.filter(m => m.stateId === stateId);
      }

      if (cityId) {
        filtered = filtered.filter(m => m.cityId === cityId);
      }

      return filtered;
    },

    boundary: (parent, { type, id }) => {
      // Simplified boundary - in production, load from TIGER/Line shapefiles
      const data = loadData();
      
      if (type === 'STATE') {
        const state = data.states.find(s => s.id === id);
        if (!state) return null;
        
        // Generate simple bounding box GeoJSON
        const geojson = {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [state.bounds.west, state.bounds.north],
              [state.bounds.east, state.bounds.north],
              [state.bounds.east, state.bounds.south],
              [state.bounds.west, state.bounds.south],
              [state.bounds.west, state.bounds.north]
            ]]
          },
          properties: {
            name: state.name,
            code: state.code
          }
        };
        
        return {
          type: 'STATE',
          id: id,
          geojson: JSON.stringify(geojson)
        };
      }
      
      if (type === 'CITY') {
        const city = data.cities.find(c => c.id === id);
        if (!city) return null;
        
        // Generate simple point buffer GeoJSON
        const buffer = 0.1; // degrees
        const geojson = {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [city.lon - buffer, city.lat + buffer],
              [city.lon + buffer, city.lat + buffer],
              [city.lon + buffer, city.lat - buffer],
              [city.lon - buffer, city.lat - buffer],
              [city.lon - buffer, city.lat + buffer]
            ]]
          },
          properties: {
            name: city.name
          }
        };
        
        return {
          type: 'CITY',
          id: id,
          geojson: JSON.stringify(geojson)
        };
      }
      
      return null;
    }
  }
};

module.exports = resolvers;
