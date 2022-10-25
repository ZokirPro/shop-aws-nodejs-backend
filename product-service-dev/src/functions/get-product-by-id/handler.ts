import { productService } from 'src/services';
import { errorResponse, successResponse, ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import schema from "./schema";
import { middyfy } from '@libs/lambda';

export const getProductById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { id } = event.pathParameters;
  const product = await productService.getProductById(id)
  if (!product) {
    return errorResponse(`Product not found by id: ${id}`, 404)
  }
  return successResponse({
    data: {
      product
    }
  })
}

export const main = middyfy(getProductById);