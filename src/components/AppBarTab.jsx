import { StyleSheet } from 'react-native';
import { Link } from 'react-router-native';
import Text from './Text';

const styles = StyleSheet.create({
  tab: {
    padding: 10,
  },
});

const AppBarTab = ({ text, to }) => {
  return (
    <Link to={to} style={styles.tab}>
      <Text color="white" fontSize="subheading" fontWeight="bold">
        {text}
      </Text>
    </Link>
  );
};

export default AppBarTab;
