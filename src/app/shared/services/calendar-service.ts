import { Injectable } from "@angular/core";

@Injectable()
export class CalendarService {

createEvent = (events: {
start: Date,
end?: Date,
summary: string,
description?: string,
location?: string, url?: string
}[]) => {
const formatDate = (date: Date): string => {
    if (!date) {
    return ''
    }
    // don't use date.toISOString() here, it will be always one day off (cause of the timezone)
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
    const month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
    const year = date.getFullYear()
    const hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    const seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    return `${year}${month}${day}T${hour}${minutes}${seconds}`
}
let VCALENDAR = `BEGIN:VCALENDAR
PRODID:-//Events Calendar//JaldeeSoft
VERSION:2.0
`

for (const event of events) {
    const timeStamp = formatDate(new Date())
    // const uuid = `${timeStamp}Z-uid@hshsoft.de`
    /**
     * Don't ever format this string template!!!
     */
    const EVENT = `BEGIN:VEVENT
DTSTAMP:${timeStamp}Z
DTSTART:${formatDate(event.start)}
DTEND:${formatDate(event.end)}
SUMMARY:${event.summary}
DESCRIPTION:${event.description}
LOCATION:${event.location}
URL:${event.url}
END:VEVENT`
    VCALENDAR += `${EVENT}
`
}
VCALENDAR += `END:VCALENDAR`

return VCALENDAR
}
download = (filename, text) => {
const element = document.createElement('a')
element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
element.setAttribute('download', filename)
element.setAttribute('target', '_blank')
element.style.display = 'none'
element.click()
}

}