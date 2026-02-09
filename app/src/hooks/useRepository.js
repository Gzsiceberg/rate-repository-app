import { useQuery } from '@apollo/client';

import { GET_REPOSITORY } from '../graphql/queries';

const useRepository = (id, first = 2) => {
  const { data, loading, error, fetchMore } = useQuery(
    GET_REPOSITORY,
    {
      variables: { id, first },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
      skip: !id,
    }
  );

  const reviews = data?.repository?.reviews?.edges?.map((edge) => edge.node);
  const pageInfo = data?.repository?.reviews?.pageInfo;
  const hasNextPage = Boolean(pageInfo?.hasNextPage);
  const handleFetchMore = () => {
    if (loading || !hasNextPage) {
      return;
    }

    console.log('Fetching more reviews...');

    fetchMore({
      variables: {
        id,
        first,
        after: pageInfo.endCursor,
      },
    });
  };

  return {
    repository: data?.repository,
    reviews,
    loading,
    error,
    fetchMore: handleFetchMore,
    hasNextPage,
  };
};

export default useRepository;
