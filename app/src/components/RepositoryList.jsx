import React, { useState } from 'react';
import { FlatList, View, StyleSheet, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigate } from 'react-router-native';
import { useDebounce } from 'use-debounce';
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
  searchInput: {
    borderWidth: 1,
    borderColor: '#d0d7de',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: theme.fontSizes.body,
    backgroundColor: theme.colors.white,
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

const RepositoryListHeader = ({
  ordering,
  onOrderingChange,
  searchKeyword,
  onSearchKeywordChange,
}) => (
  <View style={styles.header}>
    <Text fontWeight="bold" style={styles.headerLabel}>
      Search
    </Text>
    <TextInput
      value={searchKeyword}
      onChangeText={onSearchKeywordChange}
      placeholder="Filter repositories..."
      style={styles.searchInput}
      autoCorrect={false}
      autoCapitalize="none"
    />
    <Text fontWeight="bold" style={styles.headerLabel}>
      Order by
    </Text>
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={ordering}
        onValueChange={onOrderingChange}
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

export class RepositoryListContainer extends React.Component {
  handlePressItem = (item) => {
    const { onPressItem } = this.props;
    if (onPressItem) {
      onPressItem(item.id);
    }
  };

  renderHeader = () => {
    const {
      ordering,
      onOrderingChange,
      searchKeyword,
      onSearchKeywordChange,
    } = this.props;

    return (
      <RepositoryListHeader
        ordering={ordering}
        onOrderingChange={onOrderingChange}
        searchKeyword={searchKeyword}
        onSearchKeywordChange={onSearchKeywordChange}
      />
    );
  };

  render() {
    const { repositories, onPressItem } = this.props;

    return (
      <FlatList
        data={repositories}
        ItemSeparatorComponent={ItemSeparator}
        ListHeaderComponent={this.renderHeader}
        renderItem={({ item }) => (
          <RepositoryItem
            item={item}
            onPress={onPressItem ? () => this.handlePressItem(item) : undefined}
          />
        )}
      />
    );
  }
}

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
  const [searchKeyword, setSearchKeyword] = useState('');
  const [debouncedSearchKeyword] = useDebounce(searchKeyword, 500);
  const { repositories } = useRepositories({
    orderBy: ordering === 'latest' ? 'CREATED_AT' : 'RATING_AVERAGE',
    orderDirection: ordering === 'lowest' ? 'ASC' : 'DESC',
    searchKeyword: debouncedSearchKeyword,
  });
  const navigate = useNavigate();

  const onPressItem = (id) => {
    navigate(`/repositories/${id}`);
  };

  return (
    <RepositoryListContainer
      repositories={repositories}
      onPressItem={onPressItem}
      ordering={ordering}
      onOrderingChange={setOrdering}
      searchKeyword={searchKeyword}
      onSearchKeywordChange={setSearchKeyword}
    />
  );
};

export default RepositoryList;
