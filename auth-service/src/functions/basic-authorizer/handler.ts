import { loggerService } from 'src/services';
import { APIGatewayTokenAuthorizerEvent } from 'aws-lambda';

const EFFECT = {
  Allow: 'Allow',
  Deny: 'Deny'
}

export const basicAuthorizer = async (event: APIGatewayTokenAuthorizerEvent, _context, callback) => {
  loggerService.debug("basicAuthorizer invoked")
  const { type } = event;
  loggerService.debug(`Request authorizer type: ${type}`)
  let policy;
  try {
    if (type !== 'TOKEN') {
      throw new Error('401');
    }
    const token = event.authorizationToken.split(' ').pop()
    loggerService.debug(`Token: ${token}`)
    const effect = authenticateUserBy(token)
    policy = generatePolicy(event, effect);
    callback(null, policy)
  } catch (error) {
    callback(error.message)
  }
};


function generatePolicy(event: APIGatewayTokenAuthorizerEvent, effect: string) {
  loggerService.debug("generatePolicy invoked")
  const { methodArn: resource } = event;
  loggerService.debug(`resource:${resource}`)
  loggerService.debug(`effect:${effect}`)
  return {
    principalId: effect.toLowerCase(),
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  }
}

function authenticateUserBy(token: string) {
  loggerService.debug("authenticateUserBy invoked")
  const buff = Buffer.from(token, "base64");
  const [username, password] = buff.toString("utf-8").split("=");
  const passwordFromEnv = process.env[username];
  loggerService.debug(`username from request: ${username}`)
  loggerService.debug(`password from request: ${password}`)
  loggerService.debug(`password from env: ${passwordFromEnv}`)
  loggerService.debug(`password equals: ${(passwordFromEnv && passwordFromEnv === password)}`)
  return (passwordFromEnv && passwordFromEnv === password) ? EFFECT.Allow : EFFECT.Deny
}