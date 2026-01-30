import { ApolloClient, InMemoryCache } from '@apollo/client';

const apolloClient = new ApolloClient({
  uri: 'http://192.168.5.10:4000/graphql',
  cache: new InMemoryCache(),
});

export default apolloClient;
