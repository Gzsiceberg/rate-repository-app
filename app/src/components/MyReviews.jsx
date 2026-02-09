import { View, FlatList, StyleSheet, Pressable, Alert } from 'react-native';
import { useQuery, useMutation } from '@apollo/client';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-native';
import { ME } from '../graphql/queries';
import { DELETE_REVIEW } from '../graphql/mutations';
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
    marginTop: 6,
  },
  reviewMeta: {
    marginBottom: 5,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionButtonPrimary: {
    backgroundColor: theme.colors.primary,
    marginRight: 10,
  },
  actionButtonDestructive: {
    backgroundColor: theme.colors.error,
  },
  actionButtonText: {
    color: theme.colors.white,
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

const ReviewItem = ({ review, onViewRepository, onDeleteReview }) => (
  <View style={styles.reviewContainer} testID="reviewItem">
    <View style={styles.ratingCircle}>
      <Text fontWeight="bold" color="primary">
        {review.rating}
      </Text>
    </View>
    <View style={styles.reviewContent}>
      <Text fontWeight="bold" style={styles.reviewMeta}>
        {review.repository.fullName}
      </Text>
      <Text color="textSecondary" style={styles.reviewMeta}>
        {format(new Date(review.createdAt), 'dd.MM.yyyy')}
      </Text>
      <Text style={styles.reviewText}>{review.text}</Text>
      <View style={styles.actionRow}>
        <Pressable
          accessibilityRole="button"
          onPress={() => onViewRepository(review.repository.id)}
          style={[styles.actionButton, styles.actionButtonPrimary]}
          testID={`reviewViewRepository-${review.id}`}
        >
          <Text fontWeight="bold" style={styles.actionButtonText}>
            View repository
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => onDeleteReview(review.id)}
          style={[styles.actionButton, styles.actionButtonDestructive]}
          testID={`reviewDelete-${review.id}`}
        >
          <Text fontWeight="bold" style={styles.actionButtonText}>
            Delete review
          </Text>
        </Pressable>
      </View>
    </View>
  </View>
);

const MyReviews = () => {
  const navigate = useNavigate();
  const { data, loading, refetch } = useQuery(ME, {
    fetchPolicy: 'cache-and-network',
    variables: {
      includeReviews: true,
    },
  });
  const [deleteReview] = useMutation(DELETE_REVIEW);

  if (loading && !data?.me) {
    return null;
  }

  const reviews = data?.me?.reviews?.edges?.map((edge) => edge.node) ?? [];

  const handleViewRepository = (repositoryId) => {
    navigate(`/repositories/${repositoryId}`);
  };

  const handleDeleteReview = (reviewId) => {
    Alert.alert(
      'Delete review',
      'Are you sure you want to delete this review?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteReview({
              variables: {
                id: reviewId,
              },
            });
            refetch();
          },
        },
      ]
    );
  };

  return (
    <FlatList
      data={reviews}
      renderItem={({ item }) => (
        <ReviewItem
          review={item}
          onViewRepository={handleViewRepository}
          onDeleteReview={handleDeleteReview}
        />
      )}
      keyExtractor={({ id }) => id}
      ItemSeparatorComponent={ItemSeparator}
    />
  );
};

export default MyReviews;
