import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

const defaultHeaders = {
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Origin": "*",
};

export const successResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 200,
    headers: defaultHeaders,
    body: JSON.stringify({
      statusCode: 200,
      ...response
    })
  }
}

export const errorResponse = (message = "Internal Server Error", statusCode = 500) => {
  return {
    statusCode,
    headers: defaultHeaders,
    body: JSON.stringify({
      statusCode,
      message
    }),
  }
}


