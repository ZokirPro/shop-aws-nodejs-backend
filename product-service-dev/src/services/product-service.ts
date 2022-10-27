import { loggerService } from 'src/services';
import { DocumentClient, TransactWriteItem } from "aws-sdk/clients/dynamodb";
import { TABLES } from "src/constants";
import { Product, Stock } from "src/models";
import * as uuid from "uuid";
import { stockService } from './index'
export default class ProductService {
  private client: DocumentClient;
  private tableName = TABLES.PRODUCTS;

  constructor(client: DocumentClient) {
    this.client = client
  }

  async getProducts(): Promise<Product[]> {
    loggerService.debug("getProducts method invoked")
    const result = await this.client.scan({
      TableName: this.tableName
    }).promise()
    loggerService.debug(`products fetched from database. Quantity: ${result.Count}`)
    return result.Items as Product[]
  }

  async getProductById(id: string): Promise<Product | undefined> {
    loggerService.debug("getProductById method invoked")

    const result = await this.client.get({
      TableName: this.tableName,
      Key: { id }
    }).promise()
    if (result.Item)
      loggerService.debug(`product fetched from database. Product:${JSON.stringify(result.Item)}`)
    else
      loggerService.error(`No product found by id:${id}`)
    return result.Item as Product
  }

  async createProduct(product: Product, stock: Stock) {
    loggerService.debug("createProduct method invoked")

    const productId = uuid.v4();
    const productTransactItem = this.getCreateProductTransactItem({ ...product, id: productId });
    const stockTransactItem = stockService.getCreateStockTranskItem({ ...stock, productId });

    await this.client
      .transactWrite({
        TransactItems: [productTransactItem, stockTransactItem]
      })
      .promise();
    const productWithStock = { ...product, id: productId, stock: stock.stock };
    loggerService.debug(`createProduct executed successfully: ${JSON.stringify(productWithStock)}`)
    return productWithStock;
  }

  getCreateProductTransactItem = (product: Product): TransactWriteItem => {
    return {
      Put: {
        TableName: this.tableName,
        // @ts-ignore
        Item: {
          ...product
        }
      }
    }
  }
}