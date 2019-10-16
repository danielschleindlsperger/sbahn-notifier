import cheerio from 'cheerio'

export type Announcement = {
  /**
   * Name of the train line. 'S-Bahn' means all lines
   *
   * @example ['S1', 'S-Bahn']
   */
  affectedLines: string[]

  headline: string

  lastUpdated: Date
}

export const getAnnouncements = (html: string): Announcement[] => {
  const $ = cheerio.load(html, {
    normalizeWhitespace: true,
  })

  // remove archive nodes, we don't need them
  $('.notificationsFrame .historyContainer').remove()

  const notifications = $('.notificationsFrame .notification')

  return notifications.toArray().map(n => {
    const notification = $(n)
    return {
      affectedLines: getLines(notification),
      headline: getHeadline(notification),
      lastUpdated: getLastUpdated(notification),
    }
  })
}

const getLines = (notification: Cheerio): string[] => {
  // 'title' instead of 'alt' would be fine aswell
  return notification
    .find('img')
    .toArray()
    .map(node => node.attribs['alt'])
    .map(x => x.replace(' ', ''))
}

const getHeadline = (notification: Cheerio): string => {
  return notification.find('h1').text()
}

const getLastUpdated = (notification: Cheerio): Date => {
  const text = notification.find('.lastUpdateTime').text()
  return new Date(text)
}
