import { KeystoneContext } from '@keystone-next/types';
import { CartItem } from '../schemas/CartItem';

import { Session } from '../types';
import { CartItemCreateInput } from '../.keystone/schema-types';

async function addToCart(
  root: any,
  { productId }: { productId: string },
  context: KeystoneContext
): Promise<CartItemCreateInput> {
  const session = context.session as Session;
  if (!session.itemId) {
    throw new Error('You must be logged in to do this');
  }

  const allCartItems = await context.lists.CartItem.findMany({
    where: { user: { id: session.itemId }, product: { id: productId } },
    resolveFields: 'id, quantity',
  });

  const [existingCartItem] = allCartItems;
  if (existingCartItem) {
    console.log(
      `There are ${existingCartItem.quantity} of this item in the cart, increment by 1`
    );
    return await context.lists.CartItem.updateOne({
      id: existingCartItem.id,
      data: { quantity: existingCartItem.quantity + 1 },
    });
  }

  return await context.lists.CartItem.createOne({
    data: {
      product: { connect: { id: productId } },
      user: { connect: { id: session.itemId } },
    },
  });
}

export default addToCart;
