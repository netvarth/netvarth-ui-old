import { Injectable } from "@angular/core";
import { DateTimeProcessor } from "./datetime-processor.service";

@Injectable()

export class JaldeeTimeService {

    moment = this.dateTimeProcessor.getMoment();
    constructor(private dateTimeProcessor: DateTimeProcessor) { }

    /**
     * 
     * @param interval 
     * @param startTime 
     * @param endTime 
     * @returns 
     */
    getTimeSlotsFromQTimings(interval, startTime, endTime) {
        const slotList = [];
        // slotList.push(startTime);
        const startTimeStr = this.moment(startTime, ['HH:mm A']).format('HH:mm A').toString();
        let startingDTime = this.dateTimeProcessor.getDateFromTimeString(startTimeStr);
        slotList.push(this.moment(startTime, ['HH:mm A']).format('hh:mm A').toString());
        const endTimeStr = this.moment(endTime, ['HH:mm A']).format('HH:mm A').toString();
        const endDTime = this.dateTimeProcessor.getDateFromTimeString(endTimeStr);
        // tslint:disable-next-line:radix
        const endDate = parseInt(this.moment(endDTime, ['DD']).format('DD').toString());
        // let startingDTime = this.getDateFromTimeString(startTime);
        let exitLoop = false;
        while (!exitLoop) {
            const nextTime = this.moment(startingDTime).add(interval, 'm');
            // tslint:disable-next-line:radix
            const nextDate = parseInt(nextTime.format('DD'));
            const nextTimeDt = this.dateTimeProcessor.getDateFromTimeString(this.moment(nextTime, ['HH:mm A']).format('HH:mm A').toString());
            if (nextDate === endDate) {
                if (nextTimeDt.getTime() <= endDTime.getTime()) {
                    slotList.push(this.moment(nextTime, ['HH:mm A']).format('hh:mm A').toString());
                } else {
                    exitLoop = true;
                }
            } else {
                exitLoop = true;
            }
            startingDTime = nextTimeDt;
        }
        return slotList;
    }

    /**
     * 
     * @param schedule_arr 
     * @returns 
     */
    arrageScheduleforDisplay(schedule_arr) {
        const timebase: any = [];
        for (let i = 0; i < schedule_arr.length; i++) {
            const timeindx = schedule_arr[i]['sTime'].replace(/\s+/, '') + schedule_arr[i]['eTime'].replace(/\s+/, '');
            if (timebase[timeindx] === undefined) {
                timebase[timeindx] = new Array();
                timebase[timeindx].push(schedule_arr[i]);
            } else {
                timebase[timeindx].push(schedule_arr[i]);
            }
        }
        for (const obj in timebase) {
            if (obj) {
                const len = timebase[obj].length;
                for (let i = 0; i < len; i++) {
                    for (let j = i + 1; j < len; j++) {
                        if (timebase[obj][j].day < timebase[obj][i].day) {
                            const tempobj = timebase[obj][i];
                            timebase[obj][i] = timebase[obj][j];
                            timebase[obj][j] = tempobj;
                        }
                    }
                }
            }
        }
        const displaysch = [];
        let pday = 0;
        for (const obj in timebase) {
            if (obj) {
                let curstr = '';
                let gap = 0;
                for (let i = 0; i < timebase[obj].length; i++) {
                    if (i === 0) {
                        curstr = this.dateTimeProcessor.getDay(timebase[obj][i].day);
                        pday = timebase[obj][i].day;
                    } else {
                        const diffs = timebase[obj][i].day - pday;
                        if (diffs > 1) {
                            if (gap >= 1) {
                                if (curstr.includes((this.dateTimeProcessor.getDay(pday)))) {
                                } else {
                                    curstr = curstr + ' - ' + this.dateTimeProcessor.getDay(pday);
                                }
                            }
                            curstr = curstr + ', ' + this.dateTimeProcessor.getDay(timebase[obj][i].day);
                        } else {
                            if (i === (timebase[obj].length - 1)) {
                                curstr = curstr + ' - ' + this.dateTimeProcessor.getDay(timebase[obj][i].day);
                            }
                            gap++;
                        }
                        pday = timebase[obj][i].day;
                    }
                }
                displaysch.push({ 'time': timebase[obj][0]['sTime'] + ' - ' + timebase[obj][0]['eTime'], 'dstr': curstr, 'indx': obj, 'recurrtype': timebase[obj][0]['recurrtype'] });
            }
        }
        return displaysch;
    }
}
