import { TextInput as NativeTextInput, StyleSheet, View } from 'react-native';
import { useField } from 'formik';
import Text from './Text';
import theme from '../theme';

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#d0d7de',
    padding: 12,
    borderRadius: 5,
    marginBottom: 12,
    fontSize: theme.fontSizes.body,
    backgroundColor: theme.colors.white,
  },
  errorText: {
    color: theme.colors.error,
    marginTop: -4,
    marginBottom: 8,
  },
  errorBorder: {
    borderColor: theme.colors.error,
  },
});

const TextInput = ({ name, style, ...props }) => {
  const [field, meta, helpers] = useField(name);
  const showError = meta.touched && meta.error;

  const handleBlur = () => {
    helpers.setTouched(true);
  };

  return (
    <View>
      <NativeTextInput
        value={field.value}
        onChangeText={helpers.setValue}
        onBlur={handleBlur}
        style={[styles.input, showError && styles.errorBorder, style]}
        {...props}
      />
      {showError && <Text style={styles.errorText}>{meta.error}</Text>}
    </View>
  );
};

export default TextInput;
