// IMPORTANT: Import WebGL patch BEFORE deck.gl
import '../utils/webglPatch';
import React, { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import DeckGL from '@deck.gl/react';
import { ColumnLayer } from '@deck.gl/layers';
import Map from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { calculateBounds, getBoundsCenter, calculateZoomFromBounds } from '../utils/animations';
import './MapView.css';

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN || '';

const INITIAL_VIEW_STATE = {
  longitude: -98.5795,
  latitude: 39.8283,
  zoom: 4,
  pitch: 45,
  bearing: 0
};

const MapView = ({ metrics, selectedState, selectedCity, loading, onViewStateChange }) => {
  const mapRef = useRef(null);
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const viewStateRef = useRef(INITIAL_VIEW_STATE);
  const animationFrameRef = useRef(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Calculate bounds for camera animation
  const bounds = useMemo(() => {
    if (!metrics || metrics.length === 0) return null;
    return calculateBounds(metrics);
  }, [metrics]);

  // Animate camera to bounds when filters change
  useEffect(() => {
    if (!bounds || !isMapReady) return;

    const targetCenter = getBoundsCenter(bounds);
    const targetZoom = calculateZoomFromBounds(bounds);

    const startViewState = { ...viewStateRef.current };
    const targetViewState = {
      ...startViewState,
      longitude: targetCenter.longitude,
      latitude: targetCenter.latitude,
      zoom: targetZoom,
      pitch: 45,
      bearing: 0,
    };

    const duration = 1500; // ms
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out cubic)
      const eased = 1 - Math.pow(1 - progress, 3);

      const newViewState = {
        ...startViewState,
        longitude: startViewState.longitude + (targetViewState.longitude - startViewState.longitude) * eased,
        latitude: startViewState.latitude + (targetViewState.latitude - startViewState.latitude) * eased,
        zoom: startViewState.zoom + (targetViewState.zoom - startViewState.zoom) * eased,
        pitch: 45,
        bearing: 0,
      };

      viewStateRef.current = newViewState;
      setViewState(newViewState);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    // Cancel any existing animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [bounds, selectedState?.value, selectedCity?.value, isMapReady]);

  // Create column layer
  const layers = useMemo(() => {
    if (!metrics || metrics.length === 0) return [];

    // Normalize values for better visualization
    const maxValue = Math.max(...metrics.map(m => m.value));
    const minValue = Math.min(...metrics.map(m => m.value));

    return [
      new ColumnLayer({
        id: 'population-columns',
        data: metrics,
        getPosition: d => [d.lon, d.lat],
        getFillColor: d => {
          // Color based on normalized value (blue gradient)
          const normalized = (d.value - minValue) / (maxValue - minValue || 1);
          const r = Math.floor(59 + normalized * 196);
          const g = Math.floor(130 + normalized * 125);
          const b = Math.floor(200 + normalized * 55);
          return [r, g, b, 200];
        },
        getElevation: d => {
          // Scale elevation (meters) - adjust multiplier for visibility
          return (d.value / maxValue) * 50000;
        },
        radius: 2000,
        elevationScale: 1,
        extruded: true,
        pickable: true,
        autoHighlight: true,
        transitions: {
          getElevation: {
            duration: 1000,
            easing: t => 1 - Math.pow(1 - t, 3), // ease-out cubic
          },
          getFillColor: {
            duration: 1000,
            easing: t => 1 - Math.pow(1 - t, 3),
          },
        },
      }),
    ];
  }, [metrics]);

  const handleViewStateChange = ({ viewState: newViewState }) => {
    viewStateRef.current = newViewState;
    setViewState(newViewState);
    if (onViewStateChange) {
      onViewStateChange(newViewState);
    }
  };

  const handleMapLoad = useCallback(() => {
    if (mapRef.current && mapRef.current.getMap) {
      const map = mapRef.current.getMap();
      if (map && map.isStyleLoaded && map.isStyleLoaded()) {
        setIsMapReady(true);
      }
    }
  }, []);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="map-error">
        <p>MAPBOX_TOKEN: {MAPBOX_TOKEN}</p>
        <h2>Mapbox Token Required</h2>
        <p>Please set REACT_APP_MAPBOX_TOKEN in your .env file</p>
        <p>Get a free token at: <a href="https://account.mapbox.com/" target="_blank" rel="noopener noreferrer">https://account.mapbox.com/</a></p>
      </div>
    );
  }

  return (
    <div className="map-container">
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Loading data...</p>
        </div>
      )}
      {!isMapReady && (
        <div className="map-loading">
          <div className="loading-spinner"></div>
          <p>Initializing map...</p>
        </div>
      )}
      <DeckGL
        viewState={viewState}
        onViewStateChange={handleViewStateChange}
        controller={true}
        layers={layers}
        getTooltip={({ object }) => {
          if (!object) return null;
          return {
            html: `
              <div style="padding: 8px;">
                <strong>${object.cityName}</strong><br/>
                Population: ${object.value.toLocaleString()}<br/>
                Year: ${object.year}
              </div>
            `,
            style: {
              backgroundColor: 'white',
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            },
          };
        }}
      >
        <Map
          ref={mapRef}
          mapboxAccessToken={MAPBOX_TOKEN}
          mapStyle="mapbox://styles/mapbox/dark-v10"
          preventStyleDiffing={true}
          onLoad={handleMapLoad}
          reuseMaps={true}
        />
      </DeckGL>
    </div>
  );
};

export default MapView;
