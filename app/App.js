import { StatusBar } from 'expo-status-bar';
import { ApolloProvider } from '@apollo/client';
import { NativeRouter } from 'react-router-native';

import Main from './src/components/Main';
import apolloClient from './src/apolloClient';
import AuthStorageContext from './src/AuthStorageContext';
import { authStorage } from './src/apolloClient';

const App = () => {
  return (
    <>
      <ApolloProvider client={apolloClient}>
        <NativeRouter>
          <AuthStorageContext.Provider value={authStorage}>
            <Main />
          </AuthStorageContext.Provider>
        </NativeRouter>
      </ApolloProvider>
      <StatusBar style="auto" />
    </>
  );
};

export default App;
