import { loggerService } from 'src/services';
import { DocumentClient, TransactWriteItem } from 'aws-sdk/clients/dynamodb';
import { TABLES } from 'src/constants';
import { Stock } from 'src/models';
import * as uuid from "uuid";
export default class StockService {
  private client: DocumentClient
  private tableName = TABLES.STOCKS

  constructor(client: DocumentClient) {
    this.client = client
  }

  async getStocks(): Promise<Stock[]> {
    loggerService.debug("getStocks method invoked")
    const result = await this.client
      .scan({
        TableName: this.tableName,
      })
      .promise();
    loggerService.debug(`Stocks fetched from database. Quantity: ${result.Items.length}`)

    return result.Items as Stock[];
  }

  async getStockByProductId(productId: string): Promise<Stock[] | undefined> {
    loggerService.debug(`getStocks method invoked. productId: ${productId}`)
    const result = await this.client
      .scan({
        TableName: this.tableName,
        FilterExpression: "#productId = :id",
        ExpressionAttributeNames: { '#productId': 'productId' },
        ExpressionAttributeValues: {
          ":id": productId,
        },
      })
      .promise();
    loggerService.debug(`Stocked fetched by product id from database. Quantity: ${result.Items.length}`)
    return result.Items as Stock[];
  }

  public getCreateStockTranskItem = (stock: Stock): TransactWriteItem => {
    return {
      Put: {
        TableName: this.tableName,
        Item: {
          //@ts-ignore
          id: uuid.v4(),
          ...stock,
        },
      },
    };
  };
}