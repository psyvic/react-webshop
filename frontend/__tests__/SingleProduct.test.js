import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import SingleProduct, {
  SINGLE_ITEM_QUERY,
} from '../components/SingleProduct';
import { fakeItem } from '../lib/testUtils';

const product = fakeItem();
const mocks = [
  {
    request: {
      query: SINGLE_ITEM_QUERY,
      variables: {
        id: '123',
      },
    },
    result: {
      data: {
        Product: product,
      },
    },
  },
];
describe('SIngle Product', () => {
  it('renders with proper data', async () => {
    // Make fake data
    const { container, debug } = render(
      <MockedProvider mocks={mocks}>
        <SingleProduct id="123" />
      </MockedProvider>
    );
    // getby will look for teh element automatically while
    // findBy is async so it will wait and if it doesnt after
    // a few secs it will fail
    await screen.findByTestId('singleProduct');
    expect(container).toMatchSnapshot();
  });

  it('Errors out when an item is not found', async () => {
    const errorMock = [
      {
        request: {
          query: SINGLE_ITEM_QUERY,
          variables: {
            id: '123',
          },
        },
        result: {
          errors: [{ message: 'Item not found!!!' }],
        },
      },
    ];

    const { container, debug } = render(
      <MockedProvider mocks={errorMock}>
        <SingleProduct id="123" />
      </MockedProvider>
    );

    await screen.findByTestId('graphql-error');
    expect(container).toMatchSnapshot();
    expect(container).toHaveTextContent('Shoot!');
    expect(container).toHaveTextContent(
      'Item not found!!!'
    );
  });
});
