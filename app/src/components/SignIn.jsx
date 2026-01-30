import { View, Pressable, StyleSheet } from 'react-native';
import { useNavigate } from 'react-router-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import Text from './Text';
import TextInput from './TextInput';
import theme from '../theme';
import useSignIn from '../hooks/useSignIn';

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: theme.colors.white,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
});

const initialValues = {
  username: '',
  password: '',
};

const validationSchema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

const SignInForm = ({ onSubmit }) => {
  return (
    <View style={styles.container}>
      <TextInput
        name="username"
        placeholder="Username"
        autoCapitalize="none"
      />
      <TextInput name="password" placeholder="Password" secureTextEntry />
      <Pressable style={styles.button} onPress={onSubmit}>
        <Text color="white" fontWeight="bold">
          Sign in
        </Text>
      </Pressable>
    </View>
  );
};

export const SignInContainer = ({ onSubmit }) => {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({ handleSubmit }) => <SignInForm onSubmit={handleSubmit} />}
    </Formik>
  );
};

const SignIn = () => {
  const [signIn] = useSignIn();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    const { username, password } = values;

    try {
      const { data } = await signIn({ username, password });
      console.log(data);
      navigate('/');
    } catch (e) {
      console.log(e);
    }
  };

  return <SignInContainer onSubmit={onSubmit} />;
};

export default SignIn;
