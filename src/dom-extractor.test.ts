import { getAnnouncements } from './dom-extractor'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const mock1 = readFileSync(resolve(__dirname, '../fakes/1.html'), 'utf-8')

describe('getAnnouncements()', () => {
  test('works', () => {
    const announcements = getAnnouncements(mock1)
    expect(announcements).toEqual([
      {
        affectedLines: ['S1'],
        headline:
          '1. Aktualisierung S 1 Freising / Flughafen: Weiterhin Bahnübergangsstörung / S 1 verkehrt wieder auf dem Regelweg / Verzögerungen (Stand 16.10.2019, 22:45 Uhr)',
        lastUpdated: new Date('2019-10-16T20:44:17.000Z'),
      },
      {
        affectedLines: ['S4', 'S6'],
        headline:
          '1. Aktualisierung S 4 / S 6 Ebersberg: Stellwerksstörung / Beeinträchtigungen (Stand 16.10.2019, 21:15 Uhr)',
        lastUpdated: new Date('2019-10-16T19:17:30.000Z'),
      },
    ])
  })
})
