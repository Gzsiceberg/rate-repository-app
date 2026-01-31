import { FlatList, View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { useNavigate } from 'react-router-native';
import RepositoryItem from './RepositoryItem';
import useRepositories from '../hooks/useRepositories';
import theme from '../theme';
import Text from './Text';

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
  header: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: theme.colors.mainBackground,
  },
  headerLabel: {
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d0d7de',
    overflow: 'hidden',
  },
  picker: {
    color: theme.colors.textPrimary,
    height: 48,
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

export const RepositoryListContainer = ({
  repositories,
  onPressItem,
  listHeaderComponent,
}) => {
  const handlePressItem = (item) => {
    if (onPressItem) {
      onPressItem(item.id);
    }
  };

  return (
    <FlatList
      data={repositories}
      ItemSeparatorComponent={ItemSeparator}
      ListHeaderComponent={listHeaderComponent}
      renderItem={({ item }) => (
        <RepositoryItem
          item={item}
          onPress={onPressItem ? () => handlePressItem(item) : undefined}
        />
      )}
    />
  );
};

const orderingOptions = [
  {
    label: 'Latest repositories',
    value: 'latest',
  },
  {
    label: 'Highest rated repositories',
    value: 'highest',
  },
  {
    label: 'Lowest rated repositories',
    value: 'lowest',
  },
];

const RepositoryList = () => {
  const [ordering, setOrdering] = useState('latest');
  const { repositories } = useRepositories({
    orderBy: ordering === 'latest' ? 'CREATED_AT' : 'RATING_AVERAGE',
    orderDirection: ordering === 'lowest' ? 'ASC' : 'DESC',
  });
  const navigate = useNavigate();

  const onPressItem = (id) => {
    navigate(`/repositories/${id}`);
  };

  const header = (
    <View style={styles.header}>
      <Text fontWeight="bold" style={styles.headerLabel}>
        Order by
      </Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={ordering}
          onValueChange={(value) => setOrdering(value)}
          style={styles.picker}
        >
          {orderingOptions.map((option) => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </Picker>
      </View>
    </View>
  );

  return (
    <RepositoryListContainer
      repositories={repositories}
      onPressItem={onPressItem}
      listHeaderComponent={header}
    />
  );
};

export default RepositoryList;
