import { View, FlatList, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { useParams } from 'react-router-native';
import RepositoryItem from './RepositoryItem';
import useRepository from '../hooks/useRepository';
import Text from './Text';
import theme from '../theme';

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
  reviewContainer: {
    backgroundColor: theme.colors.white,
    padding: 15,
    flexDirection: 'row',
  },
  ratingCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewContent: {
    flex: 1,
    marginLeft: 15,
  },
  reviewText: {
    marginTop: 5,
  },
  reviewMeta: {
    marginBottom: 5,
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

const RepositoryInfo = ({ repository }) => (
  <RepositoryItem item={repository} showGithubButton />
);

const ReviewItem = ({ review }) => (
  <View style={styles.reviewContainer} testID="reviewItem">
    <View style={styles.ratingCircle}>
      <Text fontWeight="bold" color="primary">
        {review.rating}
      </Text>
    </View>
    <View style={styles.reviewContent}>
      <Text fontWeight="bold" style={styles.reviewMeta}>
        {review.user.username}
      </Text>
      <Text color="textSecondary" style={styles.reviewMeta}>
        {format(new Date(review.createdAt), 'dd.MM.yyyy')}
      </Text>
      <Text style={styles.reviewText}>{review.text}</Text>
    </View>
  </View>
);

const Repository = () => {
  const { id } = useParams();
  const {
    repository,
    reviews,
    loading,
    fetchMore,
    hasNextPage,
  } = useRepository(id);

  if (loading || !repository) {
    return null;
  }

  const onEndReach = () => {
    if (hasNextPage) {
      fetchMore();
    }
  };

  return (
    <FlatList
      data={reviews}
      renderItem={({ item }) => <ReviewItem review={item} />}
      keyExtractor={({ id: reviewId }) => reviewId}
      ItemSeparatorComponent={ItemSeparator}
      ListHeaderComponent={() => <RepositoryInfo repository={repository} />}
      onEndReached={onEndReach}
      onEndReachedThreshold={0.5}
    />
  );
};

export default Repository;
