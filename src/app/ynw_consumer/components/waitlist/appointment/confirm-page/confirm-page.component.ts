import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { projectConstants } from '../../../../../app.component';
import { SharedServices } from '../../../../../shared/services/shared-services';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';
import { SubSink } from 'subsink';
import { DateTimeProcessor } from '../../../../../shared/services/datetime-processor.service';
import { LocalStorageService } from '../../../../../shared/services/local-storage.service';
// import { CalendarService } from '../../../../../shared/services/calendar-service';
import { CalendarOptions, GoogleCalendar } from 'datebook'
@Component({
  selector: 'app-confirm-page',
  templateUrl: './confirm-page.component.html',
  styleUrls: ['./confirm-page.component.css']
})
export class ConfirmPageComponent implements OnInit, OnDestroy {
  infoParams;
  appointment: any = [];
  path = projectConstantsLocal.PATH;
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  newDateFormat = projectConstantsLocal.DATE_EE_MM_DD_YY_FORMAT;
  email;
  apiloading = false;
  provider_label;
  type = 'appt';
  private subs = new SubSink();
  theme: any;
  accountId;
  customId;
  from: any;
  selectedApptsTime: any;
calender = false;
  calendarEvents;
  selectedSlots: any;
businessName: any;
  events: any[];
  calendarUrl: any;
  constructor(
    public route: ActivatedRoute, public router: Router,
    private shared_services: SharedServices, public sharedFunctionobj: SharedFunctions,
    private wordProcessor: WordProcessor, private lStorageService: LocalStorageService,
    private dateTimeProcessor: DateTimeProcessor,
    // private calendarService: CalendarService
    ) {
    this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
    this.subs.sink = this.route.queryParams.subscribe(
      params => {
        this.infoParams = params;
        if (params.selectedApptsTime) {
          this.selectedApptsTime = params.selectedApptsTime;
        }
        if (params.selectedSlots) {
          this.selectedSlots = JSON.parse(params.selectedSlots);
        }
        if (params.uuid && params.account_id) {
          this.subs.sink = this.shared_services.getAppointmentByConsumerUUID(params.uuid, params.account_id).subscribe(
            (appt: any) => {
              this.appointment = appt;
              this.addToCalendar();
              this.apiloading = false;
            });
        }
        if (params.isFrom) {
          this.from = params.isFrom;
        }
        if (params.type) {
          this.type = params.type;
        }        
        if (params.customId) {
          this.customId = params.customId;
          this.accountId = params.account_id;
        }
        // if(params.account_id){

        // }
        if (params.theme) {
          this.theme = params.theme;
        }
      });
  }
  // calendarCheckEvent(event) {
  //   if (event.checked) {
  //     console.log(this.calendarCheckEvent);
  //     this.addToCalendar();
  //   }
  // }

  addToCalendar() {
    // this.events = [];
    // let eventInfo;
  
    this.calendarUrl;
    let config: CalendarOptions;

    if (this.selectedApptsTime) {
      if(this.appointment.providerAccount && this.appointment.providerAccount.businessName){
        this.businessName = this.appointment.providerAccount.businessName;
      }
      // console.log(this.selectedSlots);
      // for (let i=0; i< this.selectedSlots.length; i++) {
        // let times = this.selectedSlots[0].time.split("-");
        // const startTime = times[0];
        // const endTime = times[1];
      //   console.log("Appt Date:", this.appointment.appmtDate);
      //   console.log("End Time:", endTime);

        const startDate = new Date(this.appointment.appmtDate);
        // const endDate = new Date(this.appointment.appmtDate + 'T23:59:59');

        // const startDateStr = startDate.getUTCMonth()+1 + "/" + startDate.getUTCDate() + "/" + startDate.getUTCFullYear();
        // const endDateStr = endDate.getUTCMonth()+1 + "/" + endDate.getUTCDate() + "/" + endDate.getUTCFullYear(); 
        
        // const startTimeStr = startDate.getUTCHours() + ":" + startDate.getUTCMinutes();
        // const endTimeStr = endDate.getUTCHours() + ":" + endDate.getUTCMinutes();

        // console.log("End Date:",endDate);
        // console.log("UTC Hour:", endDate.getUTCHours());
        // console.log("UTC Min:", endDate.getUTCMinutes());

        // const utcDate = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDay(), endDate.getHours(), endDate.getMinutes(), endDate.getSeconds());
        // console.log(utcDate);

        // console.log("UTC Get Time:",)

        // const startDate = this.dateTimeProcessor.transformToMMDDYYYY_(new Date(this.appointment.appmtDate));
        // console.log(startDate);
        // recurrence: {
        //   frequency: 'WEEKLY',
        //   interval: 2
        // }
        // eventInfo = {
        //   start: startDate,
        //   end: endDate,
        //   location: this.appointment.location?.place,
        //   description : 'Service provider : ' + this.businessName,
        //   summary: 'Booking with - ' + this.businessName
        // }
        // attendees: [
        //   {
        //     name: 'John Doe',
        //     email: 'john@doe.com',
        //     icsOptions: {
        //       rsvp: true
        //     }
        //   },
        //   {
        //     name: 'Jane Doe',
        //     email: 'jane@doe.com'
        //   }
        // ],
          config = {
          title: 'Booking with - ' + this.businessName,
          location: this.appointment.location?.place,
          description: 'Time Slots: ' + this.selectedApptsTime,
          start: startDate
          // end: endDate,
          // an event that recurs every two weeks:
         
        }
        // eventInfo = {
        //   sTime: this.getSingleTime(times[0]),
        //   eTime:this.getSingleTime(times[1]),
        //   startTime: this.dateTimeProcessor.convert24HourtoAmPm(startTimeStr),
        //   endTime: this.dateTimeProcessor.convert24HourtoAmPm(endTimeStr),
        //   location: this.appointment.location?.place,
        //   startDate: startDateStr,
        //   endDate: endDateStr,
        //   description : 'Time Slots: ' + this.selectedApptsTime,
        //   summary: 'Booking with - ' + this.businessName
        // }
        // this.events.push(eventInfo);
      // }
    } else {
      if(this.type === 'reschedule'){
        if(this.appointment.providerAccount && this.appointment.providerAccount.businessName){
          this.businessName = this.appointment.providerAccount.businessName;
        }
        let times = this.appointment.appmtTime.split("-");

        const startTime = times[0];
        const endTime = times[1];
        console.log("Appt Date:", this.appointment.appmtDate);
        console.log("End Time:", endTime);

        const startDate = new Date(this.appointment.appmtDate + 'T' + startTime);
        const endDate = new Date(this.appointment.appmtDate + 'T' + endTime);
        config = {
          title: 'Booking Rescheduled , Service provider : ' + this.businessName,
          location: this.appointment.location?.place,
          description: 'Service provider : ' + this.businessName,
          start: startDate,
          end: endDate,
          // an event that recurs every two weeks:
         
        }
        // const startDateStr = startDate.getUTCMonth()+1 + "/" + startDate.getUTCDate() + "/" + startDate.getUTCFullYear();
        // const endDateStr = endDate.getUTCMonth()+1 + "/" + endDate.getUTCDate() + "/" + endDate.getUTCFullYear(); 
        
        // const startTimeStr = startDate.getUTCHours() + ":" + startDate.getUTCMinutes();
        // const endTimeStr = endDate.getUTCHours() + ":" + endDate.getUTCMinutes();

        // const startTime = times[0];
        // const endTime = times[1];
        // const startDate = new Date(this.appointment.appmtDate + 'T' + startTime);
        // const endDate = new Date(this.appointment.appmtDate + 'T' + endTime);

        // eventInfo = {
        //   sTime: this.getSingleTime(times[0]),
        //   eTime:this.getSingleTime(times[1]),
        //   startTime: this.dateTimeProcessor.convert24HourtoAmPm(startTimeStr),
        //   endTime: this.dateTimeProcessor.convert24HourtoAmPm(endTimeStr),
        //   location: this.appointment.location?.place,
        //   startDate: startDateStr,
        //   endDate: endDateStr,
        //   description : 'Booking Rescheduled , Service provider : ' + this.businessName,
        //   summary: 'Booking with - ' + this.businessName
        // }
        // eventInfo = {
        //   start: startDate,
        //   end: endDate,
        //   description : 'Booking Rescheduled , Service provider : ' + this.businessName,
        //   location: this.appointment.location?.place,
        //   summary: 'Booking with - ' + this.businessName,
        // }
        // this.events.push(eventInfo);
      }
      else {
        if(this.appointment.providerAccount && this.appointment.providerAccount.businessName){
          this.businessName = this.appointment.providerAccount.businessName;
        }
        let times = this.appointment.appmtTime.split("-");
        const startTime = times[0];
        const endTime = times[1];
        console.log("Appt Date:", this.appointment.appmtDate);
        console.log("End Time:", endTime);

        const startDate = new Date(this.appointment.appmtDate + 'T' + startTime);
        const endDate = new Date(this.appointment.appmtDate + 'T' + endTime);

        // const startDateStr = startDate.getUTCMonth()+1 + "/" + startDate.getUTCDate() + "/" + startDate.getUTCFullYear();
        // const endDateStr = endDate.getUTCMonth()+1 + "/" + endDate.getUTCDate() + "/" + endDate.getUTCFullYear(); 
        
        // const startTimeStr = startDate.getUTCHours() + ":" + startDate.getUTCMinutes();
        // const endTimeStr = endDate.getUTCHours() + ":" + endDate.getUTCMinutes();

        // const endTime = times[1];
        // const startDate = new Date(this.appointment.appmtDate + 'T' + startTime);
        // const endDate = new Date(this.appointment.appmtDate + 'T' + endTime);
        config = {
          title: 'Booking with - ' + this.businessName,
          location: this.appointment.location?.place,
          description: 'Service provider : ' + this.businessName,
          start: startDate,
          end: endDate,
          // an event that recurs every two weeks:
         
        }
        // eventInfo = {
        //   sTime: this.getSingleTime(times[0]),
        //   eTime:this.getSingleTime(times[1]),
        //   startTime: this.dateTimeProcessor.convert24HourtoAmPm(startTimeStr),
        //   endTime: this.dateTimeProcessor.convert24HourtoAmPm(endTimeStr),
        //   location: this.appointment.location?.place,
        //   startDate: startDateStr,
        //   endDate: endDateStr,
        //   description : 'Service provider : ' + this.businessName,
        //   summary: 'Booking with - ' + this.businessName
        // }
        // eventInfo = {
        //   start: startDate,
        //   end: endDate,
        //   description : 'Service provider : ' + this.businessName,
        //   location: this.appointment.location?.place,
        //   summary: 'Booking with - ' + this.businessName,
        // }
        // this.events.push(eventInfo);
      }
      // let config: CalendarOptions = {
      //   title: 'Happy Hour',
      //   location: 'The Bar, New York, NY',
      //   description: 'Let\'s blow off some steam with a tall cold one!',
      //   start: new Date('2022-07-08T19:00:00'),
      //   end: new Date('2022-07-08T23:30:00'),
      //   attendees: [
      //     {
      //       name: 'John Doe',
      //       email: 'john@doe.com',
      //       icsOptions: {
      //         rsvp: true
      //       }
      //     },
      //     {
      //       name: 'Jane Doe',
      //       email: 'jane@doe.com'
      //     }
      //   ],
      //   // an event that recurs every two weeks:
      //   recurrence: {
      //     frequency: 'WEEKLY',
      //     interval: 2
      //   }
      // }
     
      
    }
    console.log("config:", config);
    const googleCalendar = new GoogleCalendar(config);
    this.calendarUrl = googleCalendar.render();
    // const d = new Date();
    // let ms = d.valueOf();
    // const fileName = 'calender' + ms + '.ics'
    // this.calendarEvents = this.calendarService.createEvent(events);
    // this.calendarService.download(fileName, this.calendarEvents);
  }

  ngOnInit() {
    this.addToCalendar();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  okClick(appt) {
    if(this.calender){      
      if (appt.service.livetrack && this.type !== 'reschedule') {
        let queryParams= {
          accountId: this.infoParams.account_id,
          theme:this.theme 
      }
      if (this.customId) {
        queryParams['customId'] = this.customId;
      }
      if(this.from){
        queryParams['isFrom'] = this.from;
      }
      let navigationExtras: NavigationExtras = {
          queryParams: queryParams
      };
      this.router.navigate(['consumer', 'appointment', 'track', this.infoParams.uuid], navigationExtras);
      } else {
        let queryParams= {
          theme:this.theme,
          accountId: this.accountId
        }
        if (this.customId) {
            queryParams['customId'] = this.customId;
        }
        let navigationExtras: NavigationExtras = {
            queryParams: queryParams
        };
        if(this.from){
          this.router.navigate(['consumer']);
        }else{
          this.router.navigate(['consumer'], navigationExtras);
        }
        
      }
      this.lStorageService.setitemonLocalStorage('orderStat', false);
    }
    else{
      if (appt.service.livetrack && this.type !== 'reschedule') {
        let queryParams= {
          accountId: this.infoParams.account_id,
          theme:this.theme 
      }
      if (this.customId) {
        queryParams['customId'] = this.customId;
      }
      if(this.from){
        queryParams['isFrom'] = this.from;
      }
      let navigationExtras: NavigationExtras = {
          queryParams: queryParams
      };
      this.router.navigate(['consumer', 'appointment', 'track', this.infoParams.uuid], navigationExtras);
      } else {
        let queryParams= {
          theme:this.theme,
          accountId: this.accountId
        }
        if (this.customId) {
            queryParams['customId'] = this.customId;
        }
        let navigationExtras: NavigationExtras = {
            queryParams: queryParams
        };
        if(this.from){
          this.router.navigate(['consumer']);
        }else{
          this.router.navigate(['consumer'], navigationExtras);
        }
        
      }
      this.lStorageService.setitemonLocalStorage('orderStat', false);
    } 
  }
  getSingleTime(slot) {
    if (slot) {
      const slots = slot.split('-');
      return this.dateTimeProcessor.convert24HourtoAmPm(slots[0]);
    }
  }
  updateEmail() {
  }
}
