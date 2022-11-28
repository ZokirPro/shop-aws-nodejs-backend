import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

export const successResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "*",
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      "Access-Control-Allow-Methods": "*",
    },
    body: JSON.stringify({
      statusCode: 200,
      ...response
    })
  }
}

export const errorResponse = (message = "Internal Server Error", statusCode = 500) => {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Headers": "*",
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      "Access-Control-Allow-Methods": "*",
    },
    body: JSON.stringify({
      statusCode,
      message
    }),
  }
}


