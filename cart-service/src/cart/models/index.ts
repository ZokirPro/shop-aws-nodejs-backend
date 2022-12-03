export type ProductModel = {
  id: string,
  title: string,
  description: string,
  price: number,
};


export type CartItem = {
  product: ProductModel,
  count: number,
}

export type CartModel = {
  id: string,
  user_id: string,
  created_at: string,
  updated_at: string,
  items?: CartItem[],
}
