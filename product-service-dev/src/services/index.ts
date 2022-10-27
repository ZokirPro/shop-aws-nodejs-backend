import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import * as AWS from "aws-sdk";
import ProductService from './product-service';
import StockService from './stock-service';
import { Logger } from './logger-service';

const createDynamoDbClient = (): DocumentClient => {
  return new AWS.DynamoDB.DocumentClient()
}

const client = createDynamoDbClient()

const productService = new ProductService(client);
const stockService = new StockService(client);
const loggerService = new Logger();

export { productService, stockService, loggerService }