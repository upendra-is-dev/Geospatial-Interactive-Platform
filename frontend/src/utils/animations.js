// Animation utilities for smooth transitions

export const easeInOutCubic = (t) => {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

export const easeOutCubic = (t) => {
  return 1 - Math.pow(1 - t, 3);
};

export const interpolate = (start, end, progress, easing = easeInOutCubic) => {
  const eased = easing(progress);
  return start + (end - start) * eased;
};

export const calculateBounds = (points) => {
  if (!points || points.length === 0) {
    return null;
  }

  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLon = Infinity;
  let maxLon = -Infinity;

  points.forEach(point => {
    minLat = Math.min(minLat, point.lat);
    maxLat = Math.max(maxLat, point.lat);
    minLon = Math.min(minLon, point.lon);
    maxLon = Math.max(maxLon, point.lon);
  });

  // Add padding
  const latPadding = (maxLat - minLat) * 0.1;
  const lonPadding = (maxLon - minLon) * 0.1;

  return {
    north: maxLat + latPadding,
    south: minLat - latPadding,
    east: maxLon + lonPadding,
    west: minLon - lonPadding,
  };
};

export const getBoundsCenter = (bounds) => {
  return {
    latitude: (bounds.north + bounds.south) / 2,
    longitude: (bounds.east + bounds.west) / 2,
  };
};

export const calculateZoomFromBounds = (bounds, width = 800, height = 600) => {
  if (!bounds) return 4;

  const latDiff = bounds.north - bounds.south;
  const lonDiff = bounds.east - bounds.west;

  const latZoom = Math.log2(360 / latDiff);
  const lonZoom = Math.log2(360 / lonDiff);

  // Use the smaller zoom to ensure both dimensions fit
  const zoom = Math.min(latZoom, lonZoom) - 0.5;

  return Math.max(2, Math.min(12, zoom));
};
