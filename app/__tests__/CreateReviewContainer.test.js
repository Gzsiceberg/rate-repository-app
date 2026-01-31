import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { CreateReviewContainer } from '../src/components/CreateReview';

describe('CreateReview', () => {
  describe('CreateReviewContainer', () => {
    it('calls onSubmit with correct arguments when form is submitted', async () => {
      const onSubmit = jest.fn();

      render(<CreateReviewContainer onSubmit={onSubmit} />);

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
        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit.mock.calls[0][0]).toEqual({
          ownerName: 'jaredpalmer',
          repositoryName: 'formik',
          rating: '95',
          text: 'Great docs',
        });
      });
    });
  });
});
