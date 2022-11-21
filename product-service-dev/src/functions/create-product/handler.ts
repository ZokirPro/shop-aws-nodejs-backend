import { productService, loggerService } from 'src/services';
import { errorResponse, successResponse, ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import schema, { CreateProductSchema } from "./schema";
import { Product, Stock } from 'src/models';
import { middyfy } from '@libs/lambda';

const createProductHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    loggerService.debug(`createProduct function invoked. Options: ${JSON.stringify(event.body)}`)
    const { title, description, count, price } = event.body
    await CreateProductSchema.validateAsync(event.body)
    const product = { title, description, price }
    const stock = { stock: count || 0 }
    const result = await productService.createProduct(product as Product, stock as Stock)
    return successResponse({
      data: result
    })
  } catch (error) {
    return errorResponse(error)
  }
}

export const createProduct = middyfy(createProductHandler);