# 3D Geospatial Interactive Platform

A full-stack web application that renders a 3D map with extruded columns representing U.S. Census population data. Features interactive State and City filters with smooth camera transitions and animated chart updates.

## Architecture

### Backend
- **Node.js** with **Express** and **Apollo Server** for GraphQL API
- Processes and serves U.S. Census data (population + coordinates)
- GraphQL schema supports filtering by State and City

### Frontend
- **React** with **deck.gl** for high-performance WebGL 3D visualizations
- **Mapbox GL** for base map rendering
- GraphQL client for data fetching
- Smooth animations and transitions

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
npm run seed  # Process and load Census data
npm start     # Starts server on http://localhost:4000
```

### Frontend Setup

```bash
cd frontend
npm install
npm start     # Starts dev server on http://localhost:3000
```

### Environment Variables

Create `backend/.env`:
```
PORT=4000
```

Create `frontend/.env`:
```
REACT_APP_GRAPHQL_URL=http://localhost:4000/graphql
REACT_APP_MAPBOX_TOKEN=your_mapbox_token_here
```

**Note**: You'll need a free Mapbox token from https://account.mapbox.com/

## Features

- ✅ Interactive 3D map with extruded columns representing population
- ✅ State and City filters with dependent dropdowns
- ✅ Smooth camera fly-to animations on filter changes
- ✅ Animated transitions for 3D bars (height/opacity)
- ✅ GraphQL API for efficient data fetching
- ✅ Loading states and error handling
- ✅ Responsive and modern UI
