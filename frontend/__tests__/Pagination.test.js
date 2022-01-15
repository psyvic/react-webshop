import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import Pagination from '../components/Pagination';
import { makePaginationMocksFor } from '../lib/testUtils';

describe('<Pagination/>', () => {
  it('Displays a loading message', () => {
    const { container } = render(
      <MockedProvider mocks={makePaginationMocksFor(1)}>
        <Pagination />
      </MockedProvider>
    );
    expect(container).toHaveTextContent('Loading...');
  });

  it('Renders Pagination for 18 items', async () => {
    const { container, debug } = render(
      <MockedProvider mocks={makePaginationMocksFor(18)}>
        <Pagination page={1} />
      </MockedProvider>
    );
    await screen.findByTestId('pagination');
    // expect(container).toHaveTextContent('Loading...');
    debug();
    expect(container).toHaveTextContent('Page 1 of 9');
    const pageCountSpan = screen.getByTestId('pageCount');
    expect(pageCountSpan).toHaveTextContent('9');
    expect(container).toMatchSnapshot();
  });

  it('disables the prev page on page 1', async () => {
    const { container } = render(
      <MockedProvider mocks={makePaginationMocksFor(6)}>
        <Pagination page={1} />
      </MockedProvider>
    );
    await screen.findByTestId('pagination');
    const prevButton = screen.getByText(/Prev/);
    const nextButton = screen.getByText(/Next/);
    expect(prevButton).toHaveAttribute(
      'aria-disabled',
      'true'
    );
    expect(nextButton).toHaveAttribute(
      'aria-disabled',
      'false'
    );
  });
  it('disables the next page on last page', async () => {
    const { container } = render(
      <MockedProvider mocks={makePaginationMocksFor(6)}>
        <Pagination page={3} />
      </MockedProvider>
    );
    await screen.findByTestId('pagination');
    const prevButton = screen.getByText(/Prev/);
    const nextButton = screen.getByText(/Next/);
    expect(prevButton).toHaveAttribute(
      'aria-disabled',
      'false'
    );
    expect(nextButton).toHaveAttribute(
      'aria-disabled',
      'true'
    );
  });
});
it('both buttons function on middle pages', async () => {
  const { container } = render(
    <MockedProvider mocks={makePaginationMocksFor(6)}>
      <Pagination page={2} />
    </MockedProvider>
  );
  await screen.findByTestId('pagination');
  const prevButton = screen.getByText(/Prev/);
  const nextButton = screen.getByText(/Next/);
  expect(prevButton).toHaveAttribute(
    'aria-disabled',
    'false'
  );
  expect(nextButton).toHaveAttribute(
    'aria-disabled',
    'false'
  );
});
