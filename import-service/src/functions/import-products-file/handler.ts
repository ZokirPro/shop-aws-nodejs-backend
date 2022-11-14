import { loggerService } from 'src/services';
import { errorResponse, successResponse, ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { middyfy } from "@libs/lambda";
import schema, { ImportProductSchema } from "./schema";
import * as config from '../../../../config.json'

const ImportProductsFileHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    loggerService.debug("ImportProductsFile method invoked")

    await ImportProductSchema.validateAsync(event.queryStringParameters?.name)
    loggerService.debug("Schema validation passed successfully")

    const client = new S3Client({
      region: 'us-east-1'
    })
    const { name } = event.queryStringParameters
    const command = new PutObjectCommand({
      Bucket: config.bucket,
      Key: `uploaded/${name}`
    })
    const signedUrl = await getSignedUrl(client, command, { expiresIn: 10000 })
    loggerService.debug(`signedURL has been created successfully. Signed URL: ${signedUrl}`)
    loggerService.debug("ImportProductsFile finished successfully")
    return successResponse({
      data: signedUrl,
      event
    })
  } catch (error) {
    return errorResponse(error)
  }
}

export const importProductsFile = middyfy(ImportProductsFileHandler);