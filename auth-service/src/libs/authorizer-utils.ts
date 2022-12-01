import { APIGatewayTokenAuthorizerEvent } from 'aws-lambda';
import { Actions } from 'src/constants';
import { loggerService } from 'src/services';
export const parseCredentials = (authorizationToken: string) => {
  const encodedCredentials = authorizationToken.split(" ")[1]
  loggerService.debug(`encodedCredentials:${JSON.stringify(encodedCredentials)}`)

  const plainCredentials = Buffer.from(encodedCredentials, "base64").toString().split(":")
  loggerService.debug(`plainCredentials:${plainCredentials}`)

  const username = plainCredentials[0]
  const password = plainCredentials[1]

  return {
    principalId: encodedCredentials,
    username,
    password
  }
}

export const generatePolicyDocument = (
  event: APIGatewayTokenAuthorizerEvent,
  action: Actions
) => {
  const tmp = event.methodArn.split(":")
  const apiGatewayArnTmp = tmp[5].split("/")
  const awsAccountId = tmp[4]
  const awsRegion = tmp[3]
  const restApiId = apiGatewayArnTmp[0]
  const stage = apiGatewayArnTmp[1]

  const apiArn = "arn:aws:execute-api" + awsRegion + ":" + awsAccountId + ":" + restApiId + "/" + stage + "/*/*"

  const policy = {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: action,
        Resource: [apiArn]
      }
    ]
  }

  loggerService.debug(`policy:${JSON.stringify(policy)}`)

  return policy
}