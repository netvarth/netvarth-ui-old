import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { projectConstants } from '../../../app.component';
import * as moment from 'moment';
import { DateTimeProcessor } from '../../services/datetime-processor.service';
// import { SharedServices } from '../../services/shared-services';
import { SubSink } from 'subsink';
import { SharedServices } from '../../services/shared-services';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { LocalStorageService } from '../../services/local-storage.service';
@Component({
    selector: 'app-checkavailability',
    templateUrl: './checkavailability.component.html',
    styleUrls: ['./checkavailability.component.css']
})
export class CheckavailabilityComponent implements OnInit {

    actionObj;
    sel_checkindate: any;
    hold_sel_checkindate: any;
    apptSettings
    todaydate;
    ddate;
    sel_loc; //check next
    sel_ser;
    private subs = new SubSink();
    availableSlots: any = [];
    api_loading= true;
    waitlist_for: any = [];
    selectedApptTime = '';
    // apptTime = '';
    showApptTime = 'notdecided';
    slots;
    freeSlots: any = [];
    appointment: any = [];
    selectedDate: any;
    today: any;
    minDate;
    maxDate: Date;
    type: string;
    customer_data: any;
    account_id: any;
    availableDates: any;
    dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT_WITH_DAY;
    api_loading1: boolean;
    server_date: any;
    amountdifference: any;
    changePrice: number;
    currentScheduleId: any;
    constructor(
        public dialogRef: MatDialogRef<CheckavailabilityComponent>,
        public dateTimeProcessor: DateTimeProcessor,
        public shared_services: SharedServices,
        private lStorageService: LocalStorageService,
        @Inject(MAT_DIALOG_DATA) public data: any,

    ) {

        this.actionObj=data.alldetails,
        this.apptSettings=data.apptSettingsJson
  
            this.account_id=String(this.apptSettings['account']['id']);
       
        this.sel_loc=String(this.actionObj['location']['id']);
      
       
            this.sel_ser=this.actionObj['service']['id'];

        this.sel_checkindate=this.hold_sel_checkindate=this.selectedDate=this.actionObj['service']['serviceAvailability']['nextAvailableDate'];
        console.log('sel_loc,',this.sel_loc,'sel_ser',this.sel_ser,'checkindate',this.sel_checkindate,'accountid',this.account_id)
        this.getAvailableSlotByLocationandService(this.sel_loc,this.sel_ser,this.sel_checkindate, this.account_id,'init')
        this.getSchedulesbyLocationandServiceIdavailability(this.sel_loc,this.sel_ser, this.account_id)
     }
    timeSelected(slot,date) {
        // this.apptTime = slot;
        const slots=[slot['displayTime'],date]

        this.dialogRef.close(slots);
     
    }
    isFuturedate = false;
    checkFutureorToday() {
        const dt0 = this.todaydate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const dt2 = moment(dt0, 'YYYY-MM-DD HH:mm').format();
        const date2 = new Date(dt2);
        const dte0 = this.selectedDate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const dte2 = moment(dte0, 'YYYY-MM-DD HH:mm').format();
        const datee2 = new Date(dte2);
        if (datee2.getTime() !== date2.getTime()) { // this is to decide whether future date selection is to be displayed. This is displayed if the sel_checkindate is a future date
            this.isFuturedate = true;
        } else {
            this.isFuturedate = false;
        }
    }
    pricelist:any;
    actionCompleted() {
        this.dialogRef.close('');
        
    }
    dateClass(date: Date): MatCalendarCellCssClasses {
        // console.log("*********************************",this.availableDates)
        return (this.availableDates.indexOf(moment(date).format('YYYY-MM-DD')) !== -1) ? 'example-custom-date-class' : '';
    }
    getAvailableSlotByLocationandService(locid, servid, pdate, accountid, type?) {
        // console.log('(((((((((',locid, servid, pdate, accountid, type)
        this.subs.sink = this.shared_services.getSlotsByLocationServiceandDate(locid, servid, pdate, accountid)
            .subscribe(data => {
                this.slots = data;
                this.freeSlots = [];
                for (const scheduleSlots of this.slots) {
                    this.availableSlots = scheduleSlots.availableSlots;
                    for (const freslot of this.availableSlots) {
                        if ((freslot.noOfAvailbleSlots !== '0' && freslot.active) || (freslot.time === this.appointment.appmtTime && scheduleSlots['date'] === this.sel_checkindate)) {
                            freslot['scheduleId'] = scheduleSlots['scheduleId'];
                            freslot['displayTime'] = this.getSingleTime(freslot.time);
                            this.freeSlots.push(freslot);
                            this.api_loading1 = false;
                            // console.log("********free slots ********",this.freeSlots)
                        }
                    }
                }
               
                if (this.freeSlots.length > 0) {
                    this.showApptTime = 'decided';
                    if (this.appointment && this.appointment.appmtTime && this.sel_checkindate === this.selectedDate) {
                    
                        // const appttime = this.freeSlots.filter(slot => slot.time === this.appointment.appmtTime);
                        // this.apptTime = appttime[0];
                       
                    } else {
                     
                        // this.apptTime = this.freeSlots[0];
                        
                    }
                    // this.waitlist_for[0].apptTime = this.apptTime['time'];
                } else {
                    this.showApptTime = 'novalue';
                    console.log('entered............')
                }
                if (type) {
                    
                    // this.selectedApptTime = this.apptTime;
                  
                }
              
                
            });
        //    console.log("end of loop", this.freeSlots.length)
    }
    getSchedulesbyLocationandServiceIdavailability(locid, servid, accountid) {
        const _this = this;
        if (locid && servid && accountid) {
            // console.log("if loop")
            _this.subs.sink = _this.shared_services.getAvailableDatessByLocationService(locid, servid, accountid)
                .subscribe((data: any) => {
                    const availables = data.filter(obj => obj.availableSlots);
                    const availDates = availables.map(function (a) { return a.date; });
                    // console.log("**************",availables,availDates);
                    _this.availableDates = availDates.filter(function (elem, index, self) {

                        return index === self.indexOf(elem);
                    });
                });
        }
    }
    dismissModal() {
        this.dialogRef.close('undefined');
    }

//    *** getting data *** 

handleFutureDateChange(e) {
    console.log("entered handle")

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
    disableMinus() {
        // console.log("entered disable")
        const seldate1 = this.sel_checkindate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        
        const seldate2 = moment(seldate1, 'YYYY-MM-DD HH:mm').format();
        const seldate = new Date(seldate2);

        const selecttdate = new Date(seldate.getFullYear() + '-' + this.dateTimeProcessor.addZero(seldate.getMonth() + 1) + '-' + this.dateTimeProcessor.addZero(seldate.getDate()));


        const strtDt1 = this.hold_sel_checkindate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });

        const strtDt2 = moment(strtDt1, 'YYYY-MM-DD HH:mm').format();
   

        const strtDt = new Date(strtDt2);
        const startdate = new Date(strtDt.getFullYear() + '-' + this.dateTimeProcessor.addZero(strtDt.getMonth() + 1) + '-' + this.dateTimeProcessor.addZero(strtDt.getDate()));
       
        if (startdate >= selecttdate) {
      
            return true;
        } else {
           
            return false;
        }
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
calculateDate(days):any {
    // console.log("entered calculate")

    const dte = this.sel_checkindate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
    const date = moment(dte, 'YYYY-MM-DD HH:mm').format();
    const newdate = new Date(date);
    newdate.setDate(newdate.getDate() + days);
    const dd = newdate.getDate();
    const mm = newdate.getMonth() + 1;
    const y = newdate.getFullYear();
    const ndate1 = y + '-' + mm + '-' + dd;
    const ndate = moment(ndate1, 'YYYY-MM-DD HH:mm').format();
    // console.log("today date......",this.todaydate)
    const strtDt1 = this.todaydate + ' 00:00:00';
    const strtDt = moment(strtDt1, 'YYYY-MM-DD HH:mm').toDate();
    const nDt = new Date(ndate);
    // console.log(nDt.getTime(),strtDt.getTime())
    if (nDt.getTime() >= strtDt.getTime()) {
        this.sel_checkindate = ndate;
        this.getAvailableSlotByLocationandService(this.sel_loc, this.sel_ser, this.sel_checkindate, this.account_id);
    }
    const day1 = this.sel_checkindate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
    const day = moment(day1, 'YYYY-MM-DD HH:mm').format();
    const ddd = new Date(day);
    this.ddate = new Date(ddd.getFullYear() + '-' + this.dateTimeProcessor.addZero(ddd.getMonth() + 1) + '-' + this.dateTimeProcessor.addZero(ddd.getDate()));
    
}
    // account_id(sel_loc: any, sel_ser: any, sel_checkindate: any, account_id: any) {
    //     throw new Error('Method not implemented.');
    // }

getSingleTime(slot) {
    const slots = slot.split('-');
    return this.dateTimeProcessor.convert24HourtoAmPm(slots[0]);
}
ngOnInit() {
    this.server_date = this.lStorageService.getitemfromLocalStorage('sysdate');
    if (this.server_date) {
        this.today = new Date(this.server_date.split(' ')[0]).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
    }
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
  
    const day = new Date(this.sel_checkindate).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const ddd = new Date(day);
    this.ddate = new Date(ddd.getFullYear() + '-' + this.dateTimeProcessor.addZero(ddd.getMonth() + 1) + '-' + this.dateTimeProcessor.addZero(ddd.getDate()));
 
    // if (this.type !== 'reschedule') {
    //     this.waitlist_for.push({ id: this.customer_data.id, firstName: this.customer_data.firstName, lastName: this.customer_data.lastName });
    // }
    this.minDate = this.todaydate;
    
}
}
