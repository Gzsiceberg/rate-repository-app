import { View, Pressable, StyleSheet } from 'react-native';
import { useNavigate } from 'react-router-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useMutation } from '@apollo/client';
import Text from './Text';
import TextInput from './TextInput';
import theme from '../theme';
import useSignIn from '../hooks/useSignIn';
import { CREATE_USER } from '../graphql/mutations';

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
  passwordConfirmation: '',
};

const validationSchema = yup.object({
  username: yup
    .string()
    .min(5, 'Username must be at least 5 characters')
    .max(30, 'Username must be at most 30 characters')
    .required('Username is required'),
  password: yup
    .string()
    .min(5, 'Password must be at least 5 characters')
    .max(50, 'Password must be at most 50 characters')
    .required('Password is required'),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Password confirmation is required'),
});

const SignUpForm = ({ onSubmit }) => {
  return (
    <View style={styles.container}>
      <TextInput
        name="username"
        placeholder="Username"
        autoCapitalize="none"
      />
      <TextInput
        name="password"
        placeholder="Password"
        secureTextEntry
      />
      <TextInput
        name="passwordConfirmation"
        placeholder="Password confirmation"
        secureTextEntry
      />
      <Pressable style={styles.button} onPress={onSubmit}>
        <Text color="white" fontWeight="bold">
          Sign up
        </Text>
      </Pressable>
    </View>
  );
};

export const SignUpContainer = ({ onSubmit }) => {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({ handleSubmit }) => <SignUpForm onSubmit={handleSubmit} />}
    </Formik>
  );
};

const SignUp = () => {
  const [signIn] = useSignIn();
  const [createUser] = useMutation(CREATE_USER);
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    const { username, password } = values;

    await createUser({
      variables: {
        user: {
          username,
          password,
        },
      },
    });

    await signIn({ username, password });
    navigate('/');
  };

  return <SignUpContainer onSubmit={onSubmit} />;
};

export default SignUp;
