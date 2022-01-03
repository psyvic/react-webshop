export default function calcTotalPrice(cart) {
  return cart.reduce((tally, cartItem) => {
    if (!cartItem.product) return tally; // product can be deleted while being in a clients cart
    return (
      tally + cartItem.quantity * cartItem.product.price
    );
  }, 0);
}
