import { ScheduledHandler } from 'aws-lambda'
import AWS from 'aws-sdk'
import fetch from 'node-fetch'

const newstickerUrl =
  'https://img.srv2.de/customer/sbahnMuenchen/newsticker/newsticker.html'

const bucket = process.env.BUCKET_NAME
const s3 = new AWS.S3({ region: 'eu-west-1' })

const noError = /Aktuell liegen uns keine Meldungen vor./i

export const handler: ScheduledHandler = async event => {
  if (typeof bucket !== 'string') {
    throw new Error('bucket name not defined')
  }

  const body = await fetch(newstickerUrl).then(res => res.text())

  if (noError.test(body)) {
    console.log('Keine Meldungen')
    return
  }

  console.log({ body })

  await s3
    .putObject({
      Bucket: bucket,
      Key: `${new Date().toISOString()}.html`,
      Body: body,
      ContentType: 'text/html',
    })
    .promise()
}
