import { gql } from 'graphql-request';

export const GET_STATES = gql`
  query GetStates {
    states {
      id
      name
      code
      centerLat
      centerLon
      bounds {
        north
        south
        east
        west
      }
    }
  }
`;

export const GET_CITIES = gql`
  query GetCities($stateId: ID!) {
    cities(stateId: $stateId) {
      id
      name
      stateId
      stateCode
      lat
      lon
      population
    }
  }
`;

export const GET_METRICS = gql`
  query GetMetrics($stateId: ID, $cityId: ID, $year: Int!) {
    metrics(stateId: $stateId, cityId: $cityId, year: $year) {
      id
      cityId
      cityName
      stateId
      stateCode
      lat
      lon
      value
      year
    }
  }
`;

export const GET_BOUNDARY = gql`
  query GetBoundary($type: BoundaryType!, $id: ID!) {
    boundary(type: $type, id: $id) {
      type
      id
      geojson
    }
  }
`;
