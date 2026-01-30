import { ApolloClient, InMemoryCache } from '@apollo/client';
import Constants from 'expo-constants';

const apolloUri = Constants.expoConfig?.extra?.apolloUri;

const apolloClient = new ApolloClient({
  uri: apolloUri,
  cache: new InMemoryCache(),
});

export default apolloClient;
