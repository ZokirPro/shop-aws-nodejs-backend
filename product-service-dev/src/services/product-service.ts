import products from '../mocks/products.json'

export type Product = {
  id: string
  title: string
  description: string
  price: number
}

export default class ProductService {
  private products: Product[] = []

  constructor() {
    this.products = products
  }

  public getProductById(id: string): Product | undefined {
    return this.products.find(item => item.id === id)
  }
  public getProducts(): Product[] {
    return this.products
  }
}