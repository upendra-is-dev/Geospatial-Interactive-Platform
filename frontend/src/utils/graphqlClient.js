import { GraphQLClient } from 'graphql-request';

const GRAPHQL_URL = process.env.REACT_APP_GRAPHQL_URL || 'http://localhost:4000/graphql';

export const graphqlClient = new GraphQLClient(GRAPHQL_URL);
