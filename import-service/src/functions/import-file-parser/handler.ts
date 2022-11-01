import { loggerService } from 'src/services';
import { S3 } from "@aws-sdk/client-s3";
import { S3Event } from "aws-lambda";
import parse from 'csv-parser';
const s3 = new S3({
  region: 'us-east-1'
})

const importFileParser = async (
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

    loggerService.debug(`Key:${object.key}`)
    loggerService.debug(`Parsed Key:${parsedKey}`)

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


  } catch (error) {
    loggerService.debug(`Error while downloading object from S3: ${error.message}`)
    throw error
  }
}

export const main = importFileParser