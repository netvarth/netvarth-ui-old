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
import { CalendarService } from '../../../../../shared/services/calendar-service';

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
  constructor(
    public route: ActivatedRoute, public router: Router,
    private shared_services: SharedServices, public sharedFunctionobj: SharedFunctions,
    private wordProcessor: WordProcessor, private lStorageService: LocalStorageService,
    private dateTimeProcessor: DateTimeProcessor,
    private calendarService: CalendarService) {
    this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
    this.subs.sink = this.route.queryParams.subscribe(
      params => {
        this.infoParams = params;
        if (params.uuid && params.account_id) {
          this.subs.sink = this.shared_services.getAppointmentByConsumerUUID(params.uuid, params.account_id).subscribe(
            (appt: any) => {
              this.appointment = appt;
              this.apiloading = false;
            });
        }
        if (params.isFrom) {
          this.from = params.isFrom;
        }
        if (params.type) {
          this.type = params.type;
        }
        if (params.selectedApptsTime) {
          this.selectedApptsTime = params.selectedApptsTime;
        }
        if (params.selectedSlots) {
          this.selectedSlots = JSON.parse(params.selectedSlots);
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

  addToCalendar() {
    const events = [];
    let eventInfo;
  
    if (this.selectedApptsTime) {
      if(this.appointment.providerAccount && this.appointment.providerAccount.businessName){
        this.businessName = this.appointment.providerAccount.businessName;
      }
      console.log(this.selectedSlots);
      for (let i=0; i< this.selectedSlots.length; i++) {
        let times = this.selectedSlots[i].time.split("-");
        const startTime = times[0];
        const endTime = times[1];
        const startDate = new Date(this.appointment.appmtDate + 'T' + startTime);
        const endDate = new Date(this.appointment.appmtDate + 'T' + endTime);
        eventInfo = {
          start: startDate,
          end: endDate,
          location: this.appointment.location?.place,
          description : 'Service provider : ' + this.businessName,
          summary: 'Booking with - ' + this.businessName
        }
        events.push(eventInfo);
      }
    } else {
      if(this.appointment.providerAccount && this.appointment.providerAccount.businessName){
        this.businessName = this.appointment.providerAccount.businessName;
      }
      let times = this.appointment.appmtTime.split("-");
      const startTime = times[0];
      const endTime = times[1];
      const startDate = new Date(this.appointment.appmtDate + 'T' + startTime);
      const endDate = new Date(this.appointment.appmtDate + 'T' + endTime);
     
      eventInfo = {
        start: startDate,
        end: endDate,
        description : 'Service provider : ' + this.businessName,
        location: this.appointment.location?.place,
        summary: 'Booking with - ' + this.businessName,
      }
      events.push(eventInfo);
    }
    this.calendarEvents = this.calendarService.createEvent(events);
    this.calendarService.download('event.ics', this.calendarEvents);
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  okClick(appt) {
    if(this.calender){
      this.addToCalendar();
      // if (appt.service.livetrack && this.type !== 'reschedule') {
      //   let queryParams= {
      //     account_id: this.infoParams.account_id,
      //     theme:this.theme 
      // }
      // if (this.customId) {
      //   queryParams['customId'] = this.customId;
      // }
      // if(this.from){
      //   queryParams['isFrom'] = this.from;
      // }
      // let navigationExtras: NavigationExtras = {
      //     queryParams: queryParams
      // };
      // this.router.navigate(['consumer', 'appointment', 'track', this.infoParams.uuid], navigationExtras);
      // } else {
      //   let queryParams= {
      //     theme:this.theme,
      //     accountId: this.accountId
      //   }
      //   if (this.customId) {
      //       queryParams['customId'] = this.customId;
      //   }
      //   let navigationExtras: NavigationExtras = {
      //       queryParams: queryParams
      //   };
      //   if(this.from){
      //     this.router.navigate(['consumer']);
      //   }else{
      //     this.router.navigate(['consumer'], navigationExtras);
      //   }
        
      // }
      // this.lStorageService.setitemonLocalStorage('orderStat', false);
    }
    else{
      if (appt.service.livetrack && this.type !== 'reschedule') {
        let queryParams= {
          account_id: this.infoParams.account_id,
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
