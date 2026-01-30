import { useMutation } from '@apollo/client';
import { AUTHENTICATE } from '../graphql/mutations';
import useAuthStorage from './useAuthStorage';


const useSignIn = () => {
  const [mutate, result] = useMutation(AUTHENTICATE);
  const authStorage = useAuthStorage();

  const signIn = async ({ username, password }) => {
    const response = await mutate({
      variables: {
        credentials: {
          username,
          password,
        },
      },
    });

    const accessToken = response.data?.authenticate?.accessToken;

    if (accessToken) {
      await authStorage.setAccessToken(accessToken);
    }

    return response;
  };

  return [signIn, result];
};

export default useSignIn;
