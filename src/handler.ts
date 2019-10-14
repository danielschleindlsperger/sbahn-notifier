import { ScheduledHandler } from 'aws-lambda'
import AWS from 'aws-sdk'
import { SendEmailRequest } from 'aws-sdk/clients/ses'

const newstickerUrl =
  'https://img.srv2.de/customer/sbahnMuenchen/newsticker/newsticker.html'

const fromAddress = 'daniel@schleindlsperger.de'
const toAddress = 'daniel@schleindlsperger.de'
const ses = new AWS.SES({ region: 'eu-west-1' })

export const handler: ScheduledHandler = async event => {
  const subject = `S-Bahn Status - ${new Date().toLocaleDateString()}`

  const htmlBody = `
    <!DOCTYPE html>
    <html>
      <head></head>
      <body>
        <h1>${subject}/h1>
        <iframe src="${newstickerUrl}"></iframe>
      </body>
    </html>
  `

  const sesParams: SendEmailRequest = {
    Source: fromAddress,
    Destination: {
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: htmlBody,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject,
      },
    },
  }

  await ses.sendEmail(sesParams).promise()
}
