import React, { useState } from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Modal,
  ActivityIndicator,
} from 'react-native';
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
  listFooter: {
    paddingVertical: 16,
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
  orderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  orderButtonText: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSizes.body,
  },
  orderButtonCaret: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.subheading,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  backdropPressable: {
    ...StyleSheet.absoluteFillObject,
  },
  modalSheet: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 8,
    paddingBottom: 16,
  },
  modalTitle: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  optionText: {
    fontSize: theme.fontSizes.body,
    color: theme.colors.textPrimary,
  },
  optionTextSelected: {
    fontWeight: theme.fontWeights.bold,
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
    <OrderBySelect
      ordering={ordering}
      onOrderingChange={onOrderingChange}
    />
  </View>
);

const OrderBySelect = ({ ordering, onOrderingChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = orderingOptions.find(
    (option) => option.value === ordering
  );

  const handleSelect = (value) => {
    onOrderingChange(value);
    setIsOpen(false);
  };

  return (
    <>
      <View style={styles.pickerContainer}>
        <Pressable
          onPress={() => setIsOpen(true)}
          style={styles.orderButton}
          accessibilityRole="button"
          accessibilityLabel="Order by"
        >
          <Text style={styles.orderButtonText}>
            {selectedOption ? selectedOption.label : 'Select ordering'}
          </Text>
        </Pressable>
      </View>
      <Modal
        transparent
        animationType="slide"
        visible={isOpen}
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <Pressable
            style={styles.backdropPressable}
            onPress={() => setIsOpen(false)}
          />
          <View style={styles.modalSheet}>
            <Text fontWeight="bold" style={styles.modalTitle}>
              Order by
            </Text>
            {orderingOptions.map((option) => {
              const isSelected = option.value === ordering;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => handleSelect(option.value)}
                  style={styles.optionButton}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.optionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </Modal>
    </>
  );
};

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
    const {
      repositories,
      onPressItem,
      onEndReach,
      loadingMore,
    } = this.props;

    return (
      <FlatList
        data={repositories}
        ItemSeparatorComponent={ItemSeparator}
        ListHeaderComponent={this.renderHeader}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.listFooter}>
              <ActivityIndicator />
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <RepositoryItem
            item={item}
            onPress={onPressItem ? () => this.handlePressItem(item) : undefined}
          />
        )}
        onEndReached={onEndReach}
        onEndReachedThreshold={0.5}
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
  const { repositories, fetchMore, loading } = useRepositories({
    orderBy: ordering === 'latest' ? 'CREATED_AT' : 'RATING_AVERAGE',
    orderDirection: ordering === 'lowest' ? 'ASC' : 'DESC',
    searchKeyword: debouncedSearchKeyword,
    first: 3,
  });
  const navigate = useNavigate();

  const onPressItem = (id) => {
    navigate(`/repositories/${id}`);
  };

  const onEndReach = () => {
    fetchMore();
  };

  return (
    <RepositoryListContainer
      repositories={repositories}
      onPressItem={onPressItem}
      ordering={ordering}
      onOrderingChange={setOrdering}
      searchKeyword={searchKeyword}
      onSearchKeywordChange={setSearchKeyword}
      onEndReach={onEndReach}
      loadingMore={loading}
    />
  );
};

export default RepositoryList;
