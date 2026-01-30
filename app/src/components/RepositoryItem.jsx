import { View, Image, StyleSheet } from 'react-native';
import Text from './Text';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    padding: 15,
  },
  topContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 15,
  },
  languageContainer: {
    flexDirection: 'row',
  },
  languageTag: {
    backgroundColor: theme.colors.primary,
    padding: 5,
    borderRadius: 5,
    overflow: 'hidden',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  marginBottom: {
    marginBottom: 5,
  },
});

const formatCount = (count) => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return String(count);
};

const Avatar = ({ uri }) => (
  <Image style={styles.avatar} source={{ uri }} />
);

const LanguageTag = ({ language }) => (
  <View style={styles.languageContainer}>
    <Text style={styles.languageTag} color="white">
      {language}
    </Text>
  </View>
);

const StatItem = ({ value, label }) => (
  <View style={styles.statItem}>
    <Text fontWeight="bold" fontSize="subheading" style={styles.marginBottom}>
      {formatCount(value)}
    </Text>
    <Text color="textSecondary">{label}</Text>
  </View>
);

const RepositoryInfo = ({ fullName, description, language }) => (
  <View style={styles.infoContainer}>
    <Text fontWeight="bold" fontSize="subheading" style={styles.marginBottom}>
      {fullName}
    </Text>
    <Text color="textSecondary" style={styles.marginBottom}>
      {description}
    </Text>
    <LanguageTag language={language} />
  </View>
);

const RepositoryStats = ({ stars, forks, reviews, rating }) => (
  <View style={styles.statsContainer}>
    <StatItem value={stars} label="Stars" />
    <StatItem value={forks} label="Forks" />
    <StatItem value={reviews} label="Reviews" />
    <StatItem value={rating} label="Rating" />
  </View>
);

const RepositoryItem = ({ item }) => {
  return (
    <View style={styles.container} testID="repositoryItem">
      <View style={styles.topContainer}>
        <Avatar uri={item.ownerAvatarUrl} />
        <RepositoryInfo
          fullName={item.fullName}
          description={item.description}
          language={item.language}
        />
      </View>
      <RepositoryStats
        stars={item.stargazersCount}
        forks={item.forksCount}
        reviews={item.reviewCount}
        rating={item.ratingAverage}
      />
    </View>
  );
};

export default RepositoryItem;
