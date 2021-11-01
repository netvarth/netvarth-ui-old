import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { projectConstants } from '../../../app.component';
// import * as moment from 'moment';
import { DateTimeProcessor } from '../../services/datetime-processor.service';
// import { SharedServices } from '../../services/shared-services';

import { SharedServices } from '../../services/shared-services';

@Component({
    selector: 'app-checkavailability',
    templateUrl: './checkavailability.component.html',
    styleUrls: ['./checkavailability.component.css']
})
export class CheckavailabilityComponent implements OnInit {
    freeslots=[
        {active: true,capacity: 1,displayTime: "11:30 AM",noOfAvailbleSlots: "1",scheduleId: 25104,time: "11:30-11:40"},
        {time: '11:40-11:50', noOfAvailbleSlots: '1', active: true, capacity: 1, scheduleId: 25104,displayTime:"11:40 AM"}, 
        {time: '11:50-12:00', noOfAvailbleSlots: '1', active: true, capacity: 1, scheduleId: 25104,displayTime:"11:50 AM"},
        {time: '12:00-12:10', noOfAvailbleSlots: '1', active: true, capacity: 1, scheduleId: 25104,displayTime:"12:00 AM"},
        {time: '12:10-12:20', noOfAvailbleSlots: '1', active: false, capacity: 1, scheduleId: 25104,displayTime:"12:10 PM"},
        {time: '12:20-12:30', noOfAvailbleSlots: '1', active: true, capacity: 1, scheduleId: 25104,displayTime:"12:20 PM"},
        {time: '12:30-12:40', noOfAvailbleSlots: '1', active: false, capacity: 1, scheduleId: 25104,displayTime:"12:30 PM"},
        {time: '12:40-12:50', noOfAvailbleSlots: '1', active: true, capacity: 1, scheduleId: 25104,displayTime:"12:40 PM"},
        {time: '12:50-13:00', noOfAvailbleSlots: '1', active: true, capacity: 1, scheduleId: 25104,displayTime:"12:50 PM"},
        {time: '13:00-13:10', noOfAvailbleSlots: '1', active: true, capacity: 1, scheduleId: 25104,displayTime:"01:00 PM"},
        {time: '13:10-13:20', noOfAvailbleSlots: '1', active: true, capacity: 1, scheduleId: 25104,displayTime:"01:10 PM"},
        {time: '13:20-13:30', noOfAvailbleSlots: '1', active: true, capacity: 1, scheduleId: 25104,displayTime:"01:20 PM"},
        {time: '13:30-13:40', noOfAvailbleSlots: '1', active: true, capacity: 1, scheduleId: 25104,displayTime:"01:30 PM"},
       {time: '13:40-13:50', noOfAvailbleSlots: '1', active: true, capacity: 1, scheduleId: 25104,displayTime:"01:40 PM"},
       {time: '13:50-14:00', noOfAvailbleSlots: '1', active: true, capacity: 1, scheduleId: 25104,displayTime:"01:50 PM"},
       {time: '14:00-14:10', noOfAvailbleSlots: '1', active: false, capacity: 1, scheduleId: 25104,displayTime:"02:00 PM"},
       {time: '14:10-14:20', noOfAvailbleSlots: '1', active: true, capacity: 1, scheduleId: 25104,displayTime:"02:10 PM"},
       {time: '14:20-14:30', noOfAvailbleSlots: '1', active: true, capacity: 1, scheduleId: 25104,displayTime:"02:20 PM"},
       {time: '14:30-14:40', noOfAvailbleSlots: '1', active: true, capacity: 1, scheduleId: 25104,displayTime:"02:30 PM"},
       {time: '14:40-14:50', noOfAvailbleSlots: '1', active: true, capacity: 1, scheduleId: 25104,displayTime:"02:40 PM"},
        {time: '14:50-15:00', noOfAvailbleSlots: '1', active: true, capacity: 1, scheduleId: 25104,displayTime:"02:50 PM"},
        {time: '15:00-15:10', noOfAvailbleSlots: '1', active: true, capacity: 1, scheduleId: 25104,displayTime:"03:00 PM"},
        {time: '15:10-15:20', noOfAvailbleSlots: '1', active: true, capacity: 1, scheduleId: 25104,displayTime:"03:10 PM"},
        {time: '15:20-15:30', noOfAvailbleSlots: '1', active: true, capacity: 1, scheduleId: 25104,displayTime:"03:20 PM"},
        {time: '15:30-15:40', noOfAvailbleSlots: '1', active: true, capacity: 1, scheduleId: 25104,displayTime:"03:30 PM"},
        {time: '15:40-15:50', noOfAvailbleSlots: '1', active: true, capacity: 1, scheduleId: 25104,displayTime:"03:40 PM"},
        {time: '15:50-16:00', noOfAvailbleSlots: '1', active: true, capacity: 1, scheduleId: 25104,displayTime:"03:50 PM"},
        {time: '16:00-16:10', noOfAvailbleSlots: '1', active: true, capacity: 1, scheduleId: 25104,displayTime:"04:00 PM"},
        {time: '16:10-16:20', noOfAvailbleSlots: '1', active: true, capacity: 1, scheduleId: 25104,displayTime:"04:10 PM"},
        {time: '16:20-16:30', noOfAvailbleSlots: '1', active: true, capacity: 1, scheduleId: 25104,displayTime:"04:20 PM"},
        {time: '16:30-16:40', noOfAvailbleSlots: '1', active: true, capacity: 1, scheduleId: 25104,displayTime:"04:30 PM"},
        {time: '16:40-16:50', noOfAvailbleSlots: '1', active: true, capacity: 1, scheduleId: 25104,displayTime:"04:40 PM"},
        {time: '16:50-17:00', noOfAvailbleSlots: '1', active: true, capacity: 1, scheduleId: 25104,displayTime:"04:50 PM"},
        {time: '17:00-17:10', noOfAvailbleSlots: '1', active: true, capacity: 1, scheduleId: 25104,displayTime:"05:00 PM"},
        {time: '17:10-17:20', noOfAvailbleSlots: '1', active: true, capacity: 1, scheduleId: 25104,displayTime:"05:10 PM"},
        {time: '17:20-17:30', noOfAvailbleSlots: '1', active: true, capacity: 1, scheduleId: 25104,displayTime:"05:20 PM"},
        {time: '17:30-17:40', noOfAvailbleSlots: '1', active: true, capacity: 1, scheduleId: 25104,displayTime:"05:30 PM"},
        {time: '17:40-17:50', noOfAvailbleSlots: '1', active: true, capacity: 1, scheduleId: 25104,displayTime:"05:40 PM"},
        {time: '17:50-18:00', noOfAvailbleSlots: '1', active: true, capacity: 1, scheduleId: 25104,displayTime:"05:50 PM"},
       ]
    actionObj;
    sel_checkindate: any;
    hold_sel_checkindate: any;
    apptSettings
    todaydate: string;
    ddate;
    sel_loc; //check next
    sel_ser;

    availableSlots: any = [];
    api_loading= true;
    waitlist_for: any = [];
    selectedApptTime = '';
    apptTime = '';
    showApptTime = false;
    slots;
    freeSlots: any = [];
    appointment: any = [];
    selectedDate: any;
    today: Date;
    minDate;
    maxDate: Date;
    type: string;
    customer_data: any;
    account_id: any;
    constructor(
        public dialogRef: MatDialogRef<CheckavailabilityComponent>,
        private dateTimeProcessor: DateTimeProcessor, public shared_services: SharedServices,
        @Inject(MAT_DIALOG_DATA) public data: any,

    ) {
       console.log("**********freeslots************",this.freeslots);
        this.actionObj=data.alldetails,
        this.apptSettings=data.apptSettingsJson,
        
        this.account_id=this.apptSettings['account']['id'].toString(),
        this.sel_loc=this.actionObj['location']['id'].toString(),
        this.sel_ser=this.actionObj['service']['id'],
        // this.sel_loc=this.apptServicesjson
        this.sel_checkindate=this.selectedDate=this.actionObj['service']['serviceAvailability']['nextAvailableDate'];
    console.log("locationid,serviceid,accountid",this.sel_loc,this.sel_ser,this.account_id);
    console.log("data.............",this.shared_services.getAvailableDatessByLocationService(this.sel_loc, this.sel_ser, this.account_id))
    }
    dismissModal() {
        this.dialogRef.close('');
    }

//    *** getting data *** 

handleFutureDateChange(e) {
    const tdate = e.targetElement.value;
    const newdate = tdate.split('/').reverse().join('-');
    const futrDte = new Date(newdate);
    const obtmonth = (futrDte.getMonth() + 1);
    let cmonth = '' + obtmonth;
    if (obtmonth < 10) {
        cmonth = '0' + obtmonth;
    }
    const seldate = futrDte.getFullYear() + '-' + cmonth + '-' + futrDte.getDate();
    this.sel_checkindate = seldate;
}
// disableMinus() {
//     const seldate= this.sel_checkindate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
//     const seldate = moment(seldate1, 'YYYY-MM-DD HH:mm').format();
//     const seldate = new Date(seldate2);
//     const selecttdate = new Date(seldate.getFullYear() + '-' + this.dateTimeProcessor.addZero(seldate.getMonth() + 1) + '-' + this.dateTimeProcessor.addZero(seldate.getDate()));
//     const strtDt= this.hold_sel_checkindate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
//     const strtDt = moment(strtDt1, 'YYYY-MM-DD HH:mm').format();
//     const strtDt = new Date(strtDt2);
//     const startdate = new Date(strtDt.getFullYear() + '-' + this.dateTimeProcessor.addZero(strtDt.getMonth() + 1) + '-' + this.dateTimeProcessor.addZero(strtDt.getDate()));
//     if (startdate >= selecttdate) {
//         return true;
//     } else {
//         return false;
//     }
// }
// calculateDate(days) {
//     const dte = this.sel_checkindate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
//     const date = moment(dte, 'YYYY-MM-DD HH:mm').format();
//     const newdate = new Date(date);
//     newdate.setDate(newdate.getDate() + days);
//     const dd = newdate.getDate();
//     const mm = newdate.getMonth() + 1;
//     const y = newdate.getFullYear();
//     const ndate= y + '-' + mm + '-' + dd;
//     const ndate = moment(ndate1, 'YYYY-MM-DD HH:mm').format();
//     const strtDt= this.todaydate + ' 00:00:00';
//     const strtDt = moment(strtDt1, 'YYYY-MM-DD HH:mm').toDate();
//     const nDt = new Date(ndate);
//     if (nDt.getTime() >= strtDt.getTime()) {
//         this.sel_checkindate = ndate;
//         this.getAvailableSlotByLocationandService(this.sel_loc, this.sel_ser, this.sel_checkindate, this.account_id);
//     }
//     const day= this.sel_checkindate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
//     const day = moment(day1, 'YYYY-MM-DD HH:mm').format();
//     const ddd = new Date(day);
//     this.ddate = new Date(ddd.getFullYear() + '-' + this.dateTimeProcessor.addZero(ddd.getMonth() + 1) + '-' + this.dateTimeProcessor.addZero(ddd.getDate()));
// }
    // account_id(sel_loc: any, sel_ser: any, sel_checkindate: any, account_id: any) {
    //     throw new Error('Method not implemented.');
    // }

getSingleTime(slot) {
    const slots = slot.split('-');
    return this.dateTimeProcessor.convert24HourtoAmPm(slots[0]);
}
ngOnInit() {

    this.today = new Date(this.today);
    this.minDate = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
    this.minDate = new Date(this.minDate);
    const dd = this.today.getDate();
    const mm = this.today.getMonth() + 1; // January is 0!
    const yyyy = this.today.getFullYear();
    let cday = '';
    if (dd < 10) {
        cday = '0' + dd;
    } else {
        cday = '' + dd;
    }
    let cmon;
    if (mm < 10) {
        cmon = '0' + mm;
    } else {
        cmon = '' + mm;
    }
    const dtoday = yyyy + '-' + cmon + '-' + cday;
    this.todaydate = dtoday;
    this.maxDate = new Date((this.today.getFullYear() + 4), 12, 31);
    // if (this.type !== 'reschedule') {
    //     this.waitlist_for.push({ id: this.customer_data.id, firstName: this.customer_data.firstName, lastName: this.customer_data.lastName });
    // }
    this.minDate = this.todaydate;
}
}
