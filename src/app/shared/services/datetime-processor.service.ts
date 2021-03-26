import { Injectable } from "@angular/core";
import { projectConstants } from '../../app.component';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})

/**
 * Class which handles date/time related functions
 */
export class DateTimeProcessor {

  REGION_LANGUAGE = "en-US";
  TIME_ZONE_REGION = "Asia/Kolkata";
  myweekdaysSchedule = [
    "",
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat"
  ];

  constructor() { }

  /**
   * 
   * @param date1 
   * @param date2 
   * @returns difference between the two dates
   */
  getdaysdifffromDates(date1, date2) {
    let firstdate;
    let seconddate;
    if (date1 === 'now') {
      firstdate = new Date();
    } else {
      firstdate = new Date(date1);
    }
    seconddate = new Date(date2);
    const hours = Math.abs(firstdate.getTime() - seconddate.getTime()) / 36e5; // 36e5 is the scientific notation for 60*60*1000
    return { 'hours': hours };
  }

  /**
   * 
   * @param time 
   * @returns 
   */
  getTimeAsNumberOfMinutes(time) {
    const timeParts = time.split(':');
    const timeInMinutes = (parseInt(timeParts[0], 10) * 60) + parseInt(timeParts[1], 10);
    return timeInMinutes;
  }
  /**
   * convert year-month-day to day-monthname-year
   * @param psdate 
   * @param params 
   * @returns 
   */
  formatDate(psdate, params: any = []) {
    const monthNames = {
      '01': 'Jan',
      '02': 'Feb',
      '03': 'Mar',
      '04': 'Apr',
      '05': 'May',
      '06': 'Jun',
      '07': 'Jul',
      '08': 'Aug',
      '09': 'Sep',
      '10': 'Oct',
      '11': 'Nov',
      '12': 'Dec'
    };
    const darr = psdate.split('-');
    if (params['rettype'] === 'monthname') {
      darr[1] = monthNames[darr[1]];
      return darr[1] + ' ' + darr[2];
    } else if (params['rettype'] === 'fullarr') {
      darr[1] = monthNames[darr[1]];
      return darr;
    } else {
      return darr[1] + ' ' + darr[2];
    }
  }
  /**
   * 
   * @param i 
   * @returns 
   */
  addZero(i) {
    if (i < 10) {
      i = '0' + i;
    }
    return i;
  }
  /**
   * 
   * @param time 
   * @param secreq 
   * @returns 
   */
  convert24HourtoAmPm(time, secreq?) {
    const timesp = time.split(':');
    let hr = parseInt(timesp[0], 10);
    const min = parseInt(timesp[1], 10);
    const sec = parseInt(timesp[2], 10);
    let ampm = '';
    let retstr = '';
    if (hr >= 12) {
      hr = hr - 12;
      if (hr === 0) {
        hr = 12;
        ampm = 'PM';
      } else if (hr < 0) {
        ampm = 'AM';
      } else {
        ampm = 'PM';
      }
    } else if (hr === 0) {
      hr = 12;
      ampm = 'AM';
    } else {
      ampm = 'AM';
    }
    retstr = this.addZero(hr) + ':' + this.addZero(min);
    if (secreq) {
      retstr += ':' + sec;
    }
    retstr += ' ' + ampm;
    return retstr;
  }

  /**
   * 
   * @param mins 
   * @returns 
   */
  providerConvertMinutesToHourMinute(mins) {
    let rethr = '';
    let retmin = '';
    if (mins > 0) {
      const hr = Math.floor(mins / 60);
      const min = Math.floor(mins % 60);
      if (hr > 0) {
        if (hr > 1) {
          rethr = hr + ' Hrs';
        } else {
          rethr = hr + ' Hr';
        }
      }
      if (min > 0) {
        if (min > 1) {
          retmin = ' ' + min + ' Mins';
        } else {
          retmin = ' ' + min + ' Min';
        }
      }
    } else {
      retmin = '' + 0 + ' Min';
    }
    return rethr + retmin;
  }
  /**
   * 
   * @param mins 
   * @returns 
   */
  convertMinutesToHourMinute(mins) {
    let rethr = '';
    let retmin = '';
    if (mins > 0) {
      const hr = Math.floor(mins / 60);
      const min = Math.floor(mins % 60);
      if (hr > 0) {
        if (hr > 1) {
          rethr = hr + ' hours';
        } else {
          rethr = hr + ' hour';
        }
      }
      if (min > 0) {
        if (min > 1) {
          retmin = ' ' + min + ' minutes';
        } else {
          retmin = ' ' + min + ' minute';
        }
      }
    } else {
      retmin = '' + 0 + ' minutes';
    }
    return rethr + retmin;
  }
  /**
   * 
   * @param mins 
   * @returns 
   */
  convertMinutesToHourMinuteForCheckin(mins) {
    let rethr = '';
    let retmin = '';
    if (mins > 0) {
      const hr = Math.floor(mins / 60);
      const min = Math.floor(mins % 60);
      if (hr > 0) {
        if (hr > 1) {
          rethr = hr + 'Hrs';
        } else {
          rethr = hr + 'Hr';
        }
      }
      if (min > 0) {
        if (min > 1) {
          retmin = ' ' + min + 'Mins';
        } else {
          retmin = ' ' + min + 'Min';
        }
      }
    } else {
      retmin = '' + 0 + 'Min';
    }
    return rethr + retmin;
  }
  /**
   * 
   * @param time 
   * @returns 
   */
  getDateFromTimeString(time) {
    const startTime = new Date();
    const parts = time.match(/(\d+):(\d+) (AM|PM)/);
    if (parts) {
      let hours = parseInt(parts[1], 0);
      const minutes = parseInt(parts[2], 0);
      const tt = parts[3];
      if (tt === 'PM' && hours < 12) {
        hours += 12;
      }
      startTime.setHours(hours, minutes, 0, 0);
    }
    return startTime;
  }
  /**
   * 
   * @param dt 
   * @param mod 
   * @returns 
   */
  stringtoDate(dt, mod) {
    let dtsarr;
    if (dt) {
      dtsarr = dt.split(' ');
      const dtarr = dtsarr[0].split('-');
      let retval = '';
      if (mod === 'all') {
        retval = dtarr[2] + '/' + dtarr[1] + '/' + dtarr[0] + ' ' + dtsarr[1] + ' ' + dtsarr[2];
      } else if (mod === 'date') {
        retval = dtarr[2] + '/' + dtarr[1] + '/' + dtarr[0];
      } else if (mod === 'time') {
        retval = dtsarr[1] + ' ' + dtsarr[2];
      }
      return retval;
      // return dtarr[2] + '/' + dtarr[1] + '/' + dtarr[0] + ' ' + dtsarr[1] + ' ' + dtsarr[2];
    } else {
      return;
    }
  }
  /**
   * 
   * @param date 
   * @returns 
   */
  transformToYMDFormat(date) {
    const server = date.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
    const serverdate = moment(server).format();
    const newdate = new Date(serverdate);
    const dd = newdate.getDate();
    const mm = newdate.getMonth() + 1;
    const y = newdate.getFullYear();
    const date1 = y + '-' + mm + '-' + dd;
    return date1;
  }
  /**
   * 
   * @param dateStr 
   * @returns 
   */
  formatDateDisplay(dateStr) {
    const pubDate = new Date(dateStr);
    const obtshowdate = this.addZero(pubDate.getDate()) + '/' + this.addZero((pubDate.getMonth() + 1)) + '/' + pubDate.getFullYear();
    return obtshowdate;
  }
  /**
   * 
   * @returns 
   */
  getMoment() {
    return moment;
  }
  /**
   * 
   * @param num 
   * @returns 
   */
  getDay(num) {
    return this.myweekdaysSchedule[num];
  }
}
