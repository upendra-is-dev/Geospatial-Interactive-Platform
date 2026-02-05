// Data processing script
// In production, this would parse actual Census CSV files
// For now, it just generates sample data

const fs = require('fs');
const path = require('path');
const { generateSampleData } = require('./sampleData');

const dataDir = __dirname;
const outputFile = path.join(dataDir, 'censusData.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Generate and save sample data
const data = generateSampleData();
fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));

console.log('✅ Census data processed and saved to:', outputFile);
console.log(`   - ${data.states.length} states`);
console.log(`   - ${data.cities.length} cities`);
console.log(`   - ${data.metrics.length} metric points`);
