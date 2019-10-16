import { ScheduledHandler } from 'aws-lambda'
import AWS from 'aws-sdk'
import fetch from 'node-fetch'
import { getAnnouncements, Announcement } from './dom-extractor'

const newstickerUrl =
  'https://img.srv2.de/customer/sbahnMuenchen/newsticker/newsticker.html'

const subscribedLine = 'S8'
const subscriberEmail = 'daniel@schleindlsperger.de'
const senderEmail = 'daniel@schleindlsperger.de'

const ses = new AWS.SES()

export const handler: ScheduledHandler = async event => {
  const crawlId = Date.now()

  const body = await fetch(newstickerUrl).then(res => res.text())

  const announcements = getAnnouncements(body)

  const subscribedAnnouncements = announcements.filter(a =>
    a.affectedLines.includes(subscribedLine),
  )

  if (subscribedAnnouncements.length < 1) {
    console.log('Keine Meldungen auf abonnierten Linien.')
    return
  }

  // send email
  const params = {
    Destination: {
      ToAddresses: [subscriberEmail],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: renderEmail(subscribedAnnouncements),
        },
      },
      Subject: { Data: 'S-Bahn Mitteilung' },
    },
    Source: senderEmail,
  }

  await ses.sendEmail(params).promise()
}

const renderEmail = (announcements: Announcement[]) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>S-Bahn Mitteilung</title>
</head>
<body>
  <h1>S-Bahn Mitteilung</h1>
  <ul>
  ${announcements.map(
    a => `<li>${a.affectedLines.join('|')}nbsp;${a.headline}</li>`,
  )}
  </ul>
  <a href="${newstickerUrl}">Zum Liveticker</a>
</body>
</html>
`
