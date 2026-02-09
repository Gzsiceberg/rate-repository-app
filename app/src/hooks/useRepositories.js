import { useQuery } from '@apollo/client';

import { GET_REPOSITORIES } from '../graphql/queries';

const useRepositories = (variables) => {
  const { data, loading, fetchMore, ...result } = useQuery(
    GET_REPOSITORIES,
    {
      variables,
      fetchPolicy: 'cache-and-network',
    }
  );

  const repositories = data?.repositories?.edges?.map((edge) => edge.node);
  const pageInfo = data?.repositories?.pageInfo;

  const handleFetchMore = () => {
    const canFetchMore = !loading && data?.repositories.pageInfo.hasNextPage;

    if (!canFetchMore) {
      return;
    }

    console.log('Fetching more repositories...');

    fetchMore({
      variables: {
        ...variables,
        after: pageInfo.endCursor,
      },
    });
  };

  return {
    repositories,
    fetchMore: handleFetchMore,
    loading,
    ...result,
  };
};

export default useRepositories;
