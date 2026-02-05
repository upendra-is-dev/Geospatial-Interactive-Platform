const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type State {
    id: ID!
    name: String!
    code: String!
    centerLat: Float!
    centerLon: Float!
    bounds: Bounds
  }

  type Bounds {
    north: Float!
    south: Float!
    east: Float!
    west: Float!
  }

  type City {
    id: ID!
    name: String!
    stateId: ID!
    stateCode: String!
    lat: Float!
    lon: Float!
    population: Int
  }

  type GeoMetricPoint {
    id: ID!
    cityId: ID!
    cityName: String!
    stateId: ID!
    stateCode: String!
    lat: Float!
    lon: Float!
    value: Float!
    year: Int!
  }

  type Boundary {
    type: String!
    id: ID!
    geojson: String!
  }

  enum BoundaryType {
    STATE
    CITY
  }

  type Query {
    states: [State!]!
    cities(stateId: ID!): [City!]!
    metrics(stateId: ID, cityId: ID, year: Int!): [GeoMetricPoint!]!
    boundary(type: BoundaryType!, id: ID!): Boundary
  }
`;

module.exports = typeDefs;
