// Sample Census data generator
// In production, this would load from actual Census CSV files

const generateSampleData = () => {
  const states = [
    { id: '1', name: 'California', code: 'CA', centerLat: 36.7783, centerLon: -119.4179, bounds: { north: 42.0, south: 32.5, east: -114.1, west: -124.4 } },
    { id: '2', name: 'Texas', code: 'TX', centerLat: 31.9686, centerLon: -99.9018, bounds: { north: 36.5, south: 25.8, east: -93.5, west: -106.6 } },
    { id: '3', name: 'New York', code: 'NY', centerLat: 42.1657, centerLon: -74.9481, bounds: { north: 45.0, south: 40.5, east: -71.8, west: -79.8 } },
    { id: '4', name: 'Florida', code: 'FL', centerLat: 27.7663, centerLon: -81.6868, bounds: { north: 31.0, south: 24.5, east: -80.0, west: -87.6 } },
    { id: '5', name: 'Illinois', code: 'IL', centerLat: 40.3495, centerLon: -88.9861, bounds: { north: 42.5, south: 37.0, east: -87.0, west: -91.5 } },
  ];

  const cities = [
    // California
    { id: '101', name: 'Los Angeles', stateId: '1', stateCode: 'CA', lat: 34.0522, lon: -118.2437, population: 3898747 },
    { id: '102', name: 'San Francisco', stateId: '1', stateCode: 'CA', lat: 37.7749, lon: -122.4194, population: 873965 },
    { id: '103', name: 'San Diego', stateId: '1', stateCode: 'CA', lat: 32.7157, lon: -117.1611, population: 1423851 },
    { id: '104', name: 'Sacramento', stateId: '1', stateCode: 'CA', lat: 38.5816, lon: -121.4944, population: 524943 },
    { id: '105', name: 'San Jose', stateId: '1', stateCode: 'CA', lat: 37.3382, lon: -121.8863, population: 1021795 },
    
    // Texas
    { id: '201', name: 'Houston', stateId: '2', stateCode: 'TX', lat: 29.7604, lon: -95.3698, population: 2320268 },
    { id: '202', name: 'Dallas', stateId: '2', stateCode: 'TX', lat: 32.7767, lon: -96.7970, population: 1343573 },
    { id: '203', name: 'Austin', stateId: '2', stateCode: 'TX', lat: 30.2672, lon: -97.7431, population: 978908 },
    { id: '204', name: 'San Antonio', stateId: '2', stateCode: 'TX', lat: 29.4241, lon: -98.4936, population: 1547253 },
    
    // New York
    { id: '301', name: 'New York City', stateId: '3', stateCode: 'NY', lat: 40.7128, lon: -74.0060, population: 8336817 },
    { id: '302', name: 'Buffalo', stateId: '3', stateCode: 'NY', lat: 42.8864, lon: -78.8784, population: 276807 },
    { id: '303', name: 'Rochester', stateId: '3', stateCode: 'NY', lat: 43.1566, lon: -77.6088, population: 211328 },
    
    // Florida
    { id: '401', name: 'Miami', stateId: '4', stateCode: 'FL', lat: 25.7617, lon: -80.1918, population: 442241 },
    { id: '402', name: 'Tampa', stateId: '4', stateCode: 'FL', lat: 27.9506, lon: -82.4572, population: 384959 },
    { id: '403', name: 'Orlando', stateId: '4', stateCode: 'FL', lat: 28.5383, lon: -81.3792, population: 307573 },
    { id: '404', name: 'Jacksonville', stateId: '4', stateCode: 'FL', lat: 30.3322, lon: -81.6557, population: 949611 },
    
    // Illinois
    { id: '501', name: 'Chicago', stateId: '5', stateCode: 'IL', lat: 41.8781, lon: -87.6298, population: 2693976 },
    { id: '502', name: 'Aurora', stateId: '5', stateCode: 'IL', lat: 41.7606, lon: -88.3201, population: 180542 },
  ];

  // Generate metrics for multiple years (2020-2024)
  const metrics = [];
  const years = [2020, 2021, 2022, 2023, 2024];
  
  cities.forEach(city => {
    years.forEach(year => {
      // Simulate population growth over years
      const growthFactor = 1 + (year - 2020) * 0.01; // 1% growth per year
      const value = Math.round(city.population * growthFactor);
      
      metrics.push({
        id: `${city.id}-${year}`,
        cityId: city.id,
        cityName: city.name,
        stateId: city.stateId,
        stateCode: city.stateCode,
        lat: city.lat,
        lon: city.lon,
        value: value,
        year: year
      });
    });
  });

  return { states, cities, metrics };
};

module.exports = { generateSampleData };
