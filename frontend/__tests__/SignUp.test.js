import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
// import userEvent from '@testing-library/user-event';
import SignUp, {
  SIGN_UP_MUTATION,
} from '../components/SignUp';
import { CURRENT_USER_QUERY } from '../components/User';
import { fakeUser } from '../lib/testUtils';

const me = fakeUser();

const mocks = [
  // Mutation mock
  {
    request: {
      query: SIGN_UP_MUTATION,
      variables: {
        name: me.name,
        email: me.email,
        password: 'me.password',
      },
    },
    result: {
      data: {
        createUser: {
          __typename: 'User',
          id: 'abc123',
          email: me.email,
          name: me.name,
        },
      },
    },
  },
  // current user mock
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { authenticatedItem: me } },
  },
];
describe('<SignUp/>', () => {
  it('renders and matches snaptshot', () => {
    const { container } = render(
      <MockedProvider>
        <SignUp />
      </MockedProvider>
    );
    expect(container).toMatchSnapshot();
  });
  it('calls mutation properly', async () => {
    const { container, debug } = render(
      <MockedProvider mocks={mocks}>
        <SignUp />
      </MockedProvider>
    );
    await userEvent.type(
      screen.getByPlaceholderText('Your Name', me.name)
    );
    debug();
    // expect(container).toMatchSnapshot();
  });
});
