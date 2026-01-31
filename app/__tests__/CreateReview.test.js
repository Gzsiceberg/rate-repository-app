import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { MockedProvider } from '@apollo/client/testing';
import { InMemoryCache } from '@apollo/client';
import CreateReview from '../src/components/CreateReview';
import { CREATE_REVIEW } from '../src/graphql/mutations';

const mockNavigate = jest.fn();

jest.mock('react-router-native', () => ({
  useNavigate: () => mockNavigate,
}));

const mocks = [
  {
    request: {
      query: CREATE_REVIEW,
      variables: {
        review: {
          ownerName: 'jaredpalmer',
          repositoryName: 'formik',
          rating: 95,
          text: 'Great docs',
        },
      },
    },
    result: {
      data: {
        createReview: {
          __typename: 'Review',
          id: 'review-1',
          repositoryId: 'jaredpalmer.formik',
        },
      },
    },
  },
];

describe('CreateReview', () => {
  let previousDevSetting;

  beforeAll(() => {
    previousDevSetting = globalThis.__DEV__;
    globalThis.__DEV__ = false;
  });

  afterAll(() => {
    globalThis.__DEV__ = previousDevSetting;
  });

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('submits review and navigates to repository view', async () => {
    const cache = new InMemoryCache();

    render(
      <MockedProvider mocks={mocks} cache={cache}>
        <CreateReview />
      </MockedProvider>
    );

    fireEvent.changeText(
      screen.getByPlaceholderText('Repository owner name'),
      'jaredpalmer'
    );
    fireEvent.changeText(
      screen.getByPlaceholderText('Repository name'),
      'formik'
    );
    fireEvent.changeText(
      screen.getByPlaceholderText('Rating between 0 and 100'),
      '95'
    );
    fireEvent.changeText(screen.getByPlaceholderText('Review'), 'Great docs');

    fireEvent.press(screen.getByText('Create a review'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/repositories/jaredpalmer.formik');
    });
  });
});
