import { CartModel, CartItem } from '../models';

/**
 * @param {CartModel} cart
 * @returns {number}
 */
export function calculateCartTotal(cart: CartModel): number {
  return cart ? cart.items.reduce((acc: number, { product: { price }, count }: CartItem) => {
    return acc += price * count;
  }, 0) : 0;
}
