import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/client';
import { SINGLE_ITEM_QUERY } from './SingleProduct';
import DisplayError from './ErrorMessage';
import Form from './styles/Form';
import useForm from '../lib/useForm';

const UPDATE_PRODUCT_MUTATION = gql`
  mutation UPDATE_PRODUCT_MUTATION(
    $id: ID!
    $name: String
    $description: String
    $price: Int
  ) {
    updateProduct(
      id: $id
      data: {
        name: $name
        description: $description
        price: $price
      }
    ) {
      id
      name
      description
      price
    }
  }
`;
export default function UpdateProduct({ id }) {
  const { data, loading, error } = useQuery(
    SINGLE_ITEM_QUERY,
    { variables: { id } }
  );
  // console.log({ data, loading, error });

  const [
    updateProduct,
    {
      data: updateData,
      loading: updateLoading,
      error: updateError,
    },
  ] = useMutation(UPDATE_PRODUCT_MUTATION);

  const { inputs, handleChange } = useForm(data?.Product);
  if (loading) return <p>Loading...</p>;

  return (
    <Form
      onSubmit={async (e) => {
        e.preventDefault();
        updateProduct({
          variables: {
            id,
            // data: {
            name: inputs.name,
            description: inputs.description,
            price: inputs.price,
            // },
          },
        });
        // TODO handle submit
        //   const res = await createProduct();
        //   clearForm();
        //   Router.push({
        //     pathname: `{/product/${res.data.createProduct.id}}`,
        //   });
      }}
    >
      <DisplayError error={error || updateError} />
      <fieldset
        disabled={updateLoading}
        aria-busy={updateLoading}
      >
        <label htmlFor="name">
          Name
          <input // eslint-disable-line no-console
            type="text"
            id="name"
            name="name"
            placeholder="name"
            value={inputs.name}
            onChange={(e) => handleChange(e)}
          />
        </label>
        <label htmlFor="price">
          Price
          <input
            type="number"
            id="price"
            name="price"
            placeholder="price"
            value={inputs.price}
            onChange={(e) => handleChange(e)}
          />
        </label>
        <label htmlFor="description">
          Description
          <textarea // eslint-disable-line no-console
            id="description"
            name="description"
            placeholder="Description"
            value={inputs.description}
            onChange={(e) => handleChange(e)}
          />
        </label>
        <button type="submit">Update Product</button>
      </fieldset>
    </Form>
  );
}
