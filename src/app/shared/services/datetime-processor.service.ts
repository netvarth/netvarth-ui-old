import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

/**
 * Class which handles date/time related functions
 */
export class DateTimeProcessor {
    constructor() {}
    
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
}
