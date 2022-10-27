import { errorResponse, successResponse, ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { productService } from "src/services";
import schema from "./schema";

export const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  try {
    const products = await productService.getProducts()

    return successResponse({
      data: products
    })
  } catch (error) {
    return errorResponse(error)
  }
}

export const main = middyfy(getProductsList);