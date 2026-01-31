import { FlatList, View, StyleSheet } from 'react-native';
import { useNavigate } from 'react-router-native';
import RepositoryItem from './RepositoryItem';
import useRepositories from '../hooks/useRepositories';

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

export const RepositoryListContainer = ({ repositories, onPressItem }) => {
  const handlePressItem = (item) => {
    if (onPressItem) {
      onPressItem(item.id);
    }
  };

  return (
    <FlatList
      data={repositories}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={({ item }) => (
        <RepositoryItem
          item={item}
          onPress={onPressItem ? () => handlePressItem(item) : undefined}
        />
      )}
    />
  );
};

const RepositoryList = () => {
  const { repositories } = useRepositories();
  const navigate = useNavigate();

  const onPressItem = (id) => {
    navigate(`/repositories/${id}`);
  };

  return (
    <RepositoryListContainer
      repositories={repositories}
      onPressItem={onPressItem}
    />
  );
};

export default RepositoryList;
