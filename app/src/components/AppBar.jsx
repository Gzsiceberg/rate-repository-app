import { View, StyleSheet, ScrollView } from 'react-native';
import { useApolloClient, useQuery } from '@apollo/client';
import Constants from 'expo-constants';
import theme from '../theme';
import AppBarTab from './AppBarTab';
import { ME } from '../graphql/queries';
import useAuthStorage from '../hooks/useAuthStorage';

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: theme.colors.appBarBackground,
  },
  scrollView: {
    flexDirection: 'row',
  },
});

const AppBar = () => {
  const authStorage = useAuthStorage();
  const apolloClient = useApolloClient();
  const { data } = useQuery(ME, {
    fetchPolicy: 'cache-and-network',
  });
  const isSignedIn = Boolean(data?.me);

  const signOut = async () => {
    await authStorage.removeAccessToken();
    await apolloClient.resetStore();
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal style={styles.scrollView}>
        <AppBarTab text="Repositories" to="/" />
        {isSignedIn ? (
          <>
            <AppBarTab text="Create a review" to="/create-review" />
            <AppBarTab text="My reviews" to="/my-reviews" />
            <AppBarTab text="Sign out" onPress={signOut} />
          </>
        ) : (
          <>
            <AppBarTab text="Sign in" to="/signin" />
            <AppBarTab text="Sign up" to="/signup" />
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default AppBar;
