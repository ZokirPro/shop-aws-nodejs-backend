import { loggerService } from 'src/services';
import { S3 } from "@aws-sdk/client-s3";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs"
import { S3Event } from "aws-lambda";
import parse from 'csv-parser';
import { REGION } from 'src/constants';

const s3 = new S3({
  region: REGION
})

const sqsClient = new SQSClient({
  region: REGION
})

const copyAndDelete = async (bucket, object, parsedKey) => {
  await s3.copyObject({
    Bucket: bucket.name,
    CopySource: `${bucket.name}/${object.key}`,
    Key: parsedKey
  }).then(async () => {
    loggerService.debug("File has been copied to 'parsed' folder")
    await s3.deleteObject({
      Bucket: bucket.name,
      Key: object.key
    }).then(() => {
      loggerService.debug("File in 'uploaded' folder has been deleted")
      loggerService.debug("importFileParser finished successfully")
    }).catch((error) => {
      loggerService.debug(`Error while deleting file in 'uploaded' folder: ${error.message}`)
    })
  }).catch((error) => {
    loggerService.debug(`Error while copying object to 'parsed' folder:${error.message} `)
  })
}

const sendSQSMessage = async (records) => {
  loggerService.debug("start sending messages to the queue")

  records.forEach(async (record) => {
    loggerService.debug(`sending record:${JSON.stringify(record)}`)
    const result = await sqsClient.send(
      new SendMessageCommand({
        QueueUrl: `https://sqs.us-east-1.amazonaws.com/178256066802/catalogItemsQueue`,
        MessageBody: JSON.stringify(record)
      })
    )
    loggerService.debug(`result from sqs:${result} `)
  })
  loggerService.debug("Sending SQS messages finished")
}

const importFileParserHandler = async (
  event: S3Event
) => {
  loggerService.debug("importFileParser invoked")
  const { s3: { object, bucket } } = event.Records[0]
  const records = []
  try {
    const stream = (await s3.getObject({
      Bucket: bucket.name,
      Key: object.key
    })).Body
    const parser = stream.pipe(parse())
    for await (const record of parser) {
      records.push(record)
    }

    loggerService.debug(`Records have been fetched successfully. Records: ${JSON.stringify(records)}`)
    const parsedKey = `parsed/${object.key.split('/')[1]}`

    await sendSQSMessage(records)

    await copyAndDelete(bucket, object, parsedKey)
  } catch (error) {
    loggerService.debug(`Error while downloading object from S3: ${error.message}`)
    throw error
  }
}

export const importFileParser = importFileParserHandler