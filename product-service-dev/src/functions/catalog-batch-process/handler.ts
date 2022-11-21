import { errorResponse } from './../../libs/api-gateway';
import { loggerService, productService } from 'src/services';
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { REGION } from 'src/constants';
import { Product, Stock } from 'src/models';

const snsClient = new SNSClient({
  region: REGION
})

export const catalogBatchProcess = async (event) => {
  try {
    const { Records } = event
    loggerService.debug(`catalogBatchProcess invoked. Records: ${JSON.stringify(Records)}`)

    Records.map(async (record) => {
      const recordBody = JSON.parse(record.body)
      const { title, description, price, count } = recordBody
      const product = { title, description, price: parseInt(price) }
      const stock = { stock: parseInt(count) || 0 }
      await productService.createProduct(
        product as Product,
        stock as Stock
      )
    })

    loggerService.debug("starting to publish the records to the sns queue")
    await snsClient.send(new PublishCommand({
      Message: `The products were successfully added to the db`,
      TopicArn: "arn:aws:sns:us-east-1:178256066802:productCreateTopic",
      MessageAttributes: {
        total: {
          DataType: "Number",
          StringValue: Records.length
        }
      }
    }))
    loggerService.debug("sns queue publish completed ")
    loggerService.debug("catalogBatchProcess finished successfully")
  } catch (error) {
    loggerService.error(`Internal Server Error: ${JSON.stringify(error)}`)
    return errorResponse(error)
  }
}