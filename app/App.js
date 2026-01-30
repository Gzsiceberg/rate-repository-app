import { StatusBar } from 'expo-status-bar';
import { ApolloProvider } from '@apollo/client';
import { NativeRouter } from 'react-router-native';

import Main from './src/components/Main';
import apolloClient from './src/apolloClient';

const App = () => {
  return (
    <>
      <ApolloProvider client={apolloClient}>
        <NativeRouter>
          <Main />
        </NativeRouter>
      </ApolloProvider>
      <StatusBar style="auto" />
    </>
  );
};

export default App;
