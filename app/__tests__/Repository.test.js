import { fireEvent, render, screen } from '@testing-library/react-native';
import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { Linking } from 'react-native';
import Repository from '../src/components/Repository';
import { GET_REPOSITORY } from '../src/graphql/queries';

const repositoryId = 'jaredpalmer.formik';

jest.mock('react-router-native', () => ({
  useParams: () => ({ id: repositoryId }),
}));

const repository = {
  __typename: 'Repository',
  id: repositoryId,
  fullName: 'jaredpalmer/formik',
  description: 'Build forms in React, without the tears',
  language: 'TypeScript',
  forksCount: 1619,
  stargazersCount: 21856,
  ratingAverage: 88,
  reviewCount: 3,
  ownerAvatarUrl: 'https://avatars2.githubusercontent.com/u/4060187?v=4',
  url: 'https://github.com/jaredpalmer/formik',
};

const mocks = [
  {
    request: {
      query: GET_REPOSITORY,
      variables: { id: repository.id },
    },
    result: {
      data: {
        repository,
      },
    },
  },
];

describe('Repository', () => {
  let previousDevSetting;

  beforeAll(() => {
    previousDevSetting = globalThis.__DEV__;
    globalThis.__DEV__ = false;
  });

  afterAll(() => {
    globalThis.__DEV__ = previousDevSetting;
  });

  beforeEach(() => {
    jest.spyOn(Linking, 'openURL').mockResolvedValue();
  });

  afterEach(() => {
    Linking.openURL.mockRestore();
  });

  it('renders repository details and opens GitHub link', async () => {
    const cache = new InMemoryCache();

    render(
      <MockedProvider mocks={mocks} cache={cache}>
        <Repository />
      </MockedProvider>
    );

    expect(await screen.findByText(repository.fullName)).toBeDefined();

    const githubButton = await screen.findByTestId('repositoryGithubButton');
    fireEvent.press(githubButton);

    expect(Linking.openURL).toHaveBeenCalledWith(repository.url);
  });
});
