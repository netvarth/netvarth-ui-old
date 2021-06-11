import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { projectConstants } from '../../../../app.component';
import { DateTimeProcessor } from '../../../../shared/services/datetime-processor.service';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { JaldeeTimeService } from '../../../../shared/services/jaldee-time-service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.component.html',
  styleUrls: ['./booking-detail.component.css','../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css', '../../../../../assets/css/style.bundle.css']
})


export class BookingDetailComponent implements OnInit {

  waitlist_data;
  iconClass: string;
  waitlist_id = null;
  apptTime;
  today = new Date();
  waitlist_notes: any = [];
  waitlist_history: any = [];
  spName: any;
  spfname: any;
  splname: any;
  availableSlots: any = [];
  pdtype;
  userDet;
  isCheckin
  api_loading = true;
  bookingType;
source = '';
uuid;
customer;
provider;
customerId;
domain;
subdomain;
  constructor(
    private groupService: GroupStorageService,
    private provider_services: ProviderServices,
    private activated_route: ActivatedRoute,
    private snackbarService: SnackbarService,
    private dateTimeProcessor: DateTimeProcessor,
    private jaldeeTimeService: JaldeeTimeService,
private sharedFunctions: SharedFunctions
  ) { 
    this.activated_route.params.subscribe(params => {
      this.waitlist_id = params.id;
    });
    this.activated_route.queryParams.subscribe(params => {
      this.bookingType = params.type;
      console.log(this.bookingType)
    });
    
    this.sharedFunctions.getMessage().subscribe((message) => {
      console.log(message.type);
      switch (message.type) {
        case 'statuschange':
          this.api_loading = true;
          if (this.bookingType === 'checkin') {
            this.getWaitlistDetail();
          } else{
            this.getApptDetails();
          }
          break;
      }
    });
  }
  

  ngOnInit(): void {
        this.api_loading = true;

        if (this.bookingType === 'checkin') {
          this.source = 'proCheckin';
          this.getWaitlistDetail();
        } else{
          this.source = 'proAppt';
          this.getApptDetails();
        }
    // this.api_loading = true;
    this.pdtype = this.groupService.getitemFromGroupStorage('pdtyp');
    if (!this.pdtype) {
      this.pdtype = 1;
    }
    this.userDet = this.groupService.getitemFromGroupStorage('ynw-user');
    this.domain = this.userDet.sector;
    this.subdomain = this.userDet.subSector;
    if (this.waitlist_id) {
      // this.getWaitlistDetail();
      // this.getProviderSettings();
    } else {
      // this.goBack();
    }
    this.isCheckin = this.groupService.getitemFromGroupStorage('isCheckin');
  }

  getWaitlistDetail() {
    this.provider_services.getProviderWaitlistDetailById(this.waitlist_id)
      .subscribe(
        data => {
          this.waitlist_data = data;
          this.uuid = this.waitlist_data.ynwUuid;
          this.customerId = this.waitlist_data.waitlistingFor[0].id;
          if (this.waitlist_data.jaldeeConsumer) {
          this.customer = this.waitlist_data.jaldeeConsumer.id;
          }
          if (this.userDet.accountType === 'BRANCH') {
            if (this.waitlist_data.provider) {
              this.provider = this.waitlist_data.provider.id;
            } else {
            this.provider = this.waitlist_data.providerAccount.id;
          }
        }
          console.log(this.customer);
          console.log(this.provider);
          console.log(this.waitlist_data)
          this.api_loading = false;
          console.log(this.api_loading)
          if (this.waitlist_data.service.serviceType === 'virtualService') {
            switch (this.waitlist_data.service.virtualCallingModes[0].callingMode) {
              case 'Zoom': {
                this.iconClass = 'fa zoom-icon';
                break;
              }
              case 'GoogleMeet': {
                this.iconClass = 'fa meet-icon';
                break;
              }
              case 'WhatsApp': {
                if (this.waitlist_data.service.virtualServiceType === 'audioService') {
                  this.iconClass = 'fa wtsapaud-icon';
                } else {
                  this.iconClass = 'fa wtsapvid-icon';
                }
                break;
              }
              case 'Phone': {
                this.iconClass = 'fa phon-icon';
                break;
              }
            }
          }
          const interval = this.groupService.getitemFromGroupStorage('interval');
          if (interval) {
            this.getTimeSlots(this.waitlist_data.queue.queueStartTime, this.waitlist_data.queue.queueEndTime, interval);
          }
          if (this.waitlist_data.appointmentTime) {
            // tslint:disable-next-line: radix
            // this.appttime = { hour: parseInt(moment(this.waitlist_data.appointmentTime, ['h:mm A']).format('HH')), minute: parseInt(moment(this.waitlist_data.appointmentTime, ['h:mm A']).format('mm')) };
            this.apptTime = this.waitlist_data.appointmentTime;
          } else {
            this.apptTime = { hour: parseInt(moment(projectConstants.DEFAULT_STARTTIME, ['h:mm A']).format('HH'), 10), minute: parseInt(moment(projectConstants.DEFAULT_STARTTIME, ['h:mm A']).format('mm'), 10) };
          }
          const waitlist_date = new Date(this.waitlist_data.date);
          this.today.setHours(0, 0, 0, 0);
          waitlist_date.setHours(0, 0, 0, 0);
          this.waitlist_data.history = false;
          if (this.today.valueOf() > waitlist_date.valueOf()) {
            this.waitlist_data.history = true;
          }
          // if (this.waitlist_data.waitlistStatus !== 'blocked') {
          //   this.getWaitlistNotes(this.waitlist_data.ynwUuid);
          // }
          this.getCheckInHistory(this.waitlist_data.ynwUuid);
          // this.getCommunicationHistory(this.waitlist_data.ynwUuid);
          if (this.waitlist_data.provider) {
            this.spName = this.waitlist_data.provider.businessName;
            this.spfname = this.waitlist_data.provider.firstName;
            this.splname = this.waitlist_data.provider.lastName;
          }
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.api_loading = false;
          // this.goBack();
        }
      );
  }

  getApptDetails() {
    this.provider_services.getAppointmentById(this.waitlist_id)
      .subscribe(
        data => {
          this.waitlist_data = data;
          this.uuid = this.waitlist_data.uid;
          this.customerId = this.waitlist_data.appmtFor[0].id;
          if (this.waitlist_data.consumer) {
          this.customer = this.waitlist_data.consumer.id;
          }
          if (this.userDet.accountType === 'BRANCH') {
            if (this.waitlist_data.provider) {
              this.provider = this.waitlist_data.provider.id;
            } else {
            this.provider = this.waitlist_data.providerAccount.id;
          }
        }
          console.log(this.provider);
          this.api_loading = false;
          console.log(this.waitlist_data)
          if (this.waitlist_data.service.serviceType === 'virtualService') {
            switch (this.waitlist_data.service.virtualCallingModes[0].callingMode) {
              case 'Zoom': {
                this.iconClass = 'fa zoom-icon';
                break;
              }
              case 'GoogleMeet': {
                this.iconClass = 'fa meet-icon';
                break;
              }
              case 'WhatsApp': {
                if (this.waitlist_data.service.virtualServiceType === 'audioService') {
                  this.iconClass = 'fa wtsapaud-icon';
                } else {
                  this.iconClass = 'fa wtsapvid-icon';
                }
                break;
              }
              case 'Phone': {
                this.iconClass = 'fa phon-icon';
                break;
              }
            }
          }
          // this.getTimeSlots();
          if (this.waitlist_data.appmtTime) {
            this.apptTime = this.waitlist_data.appmtTime;
          }
          const waitlist_date = new Date(this.waitlist_data.date);
          this.today.setHours(0, 0, 0, 0);
          waitlist_date.setHours(0, 0, 0, 0);
          this.waitlist_data.history = false;
          if (this.today.valueOf() > waitlist_date.valueOf()) {
            this.waitlist_data.history = true;
          }
          // if (this.waitlist_data.apptStatus !== 'blocked') {
          //   this.getWaitlistNotes(this.waitlist_data.uid);
          // }
          this.getApptHistory(this.waitlist_data.uid);
          if (this.waitlist_data.provider) {
            this.spfname = this.waitlist_data.provider.firstName;
            this.splname = this.waitlist_data.provider.lastName;
          }

        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.api_loading = false;
        }
      );
  }

  getTimeSlots(QStartTime, QEndTime, interval) {
    this.availableSlots = [];
    const _this = this;
    const locId = this.groupService.getitemFromGroupStorage('loc_id');
    // const curTimeSub = moment(new Date().toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION })).subtract(interval, 'm');
    // const curTimeSubDt = moment(curTimeSub, 'YYYY-MM-DD HH:mm A').format(projectConstants.POST_DATE_FORMAT_WITHTIME_A);
    const nextTimeDt = this.dateTimeProcessor.getDateFromTimeString(moment(new Date().toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION }), ['YYYY-MM-DD HH:mm A']).format('HH:mm A').toString());
    const filter = {};
    this.availableSlots = [];
    filter['queue-eq'] = _this.groupService.getitemFromGroupStorage('pdq');
    filter['location-eq'] = locId.id;
    filter['waitlistStatus-eq'] = 'arrived,checkedIn,done,started';
    const activeSlots = [];
    const allSlots = this.jaldeeTimeService.getTimeSlotsFromQTimings(interval, QStartTime, QEndTime);
    if (this.pdtype === 1) {
      _this.provider_services.getTodayWaitlist(filter).subscribe(
        (waitlist: any) => {
          for (let i = 0; i < waitlist.length; i++) {
            if (waitlist[i]['appointmentTime']) {
              activeSlots.push(waitlist[i]['appointmentTime']);
            }
          }
          activeSlots.splice(activeSlots.indexOf(this.waitlist_data.appointmentTime), 1);
          const slots = allSlots.filter(x => !activeSlots.includes(x));
          for (let i = 0; i < slots.length; i++) {
            const endTimeStr = moment(slots[i], ['HH:mm A']).format('HH:mm A').toString();
            const endDTime = this.dateTimeProcessor.getDateFromTimeString(endTimeStr);
            if (nextTimeDt <= endDTime) {
              this.availableSlots.push(slots[i]);
            }
          }
        }
      );
    } else {
      filter['date-eq'] = _this.waitlist_data.date;
      _this.provider_services.getFutureWaitlist(filter).subscribe(
        (waitlist: any) => {
          for (let i = 0; i < waitlist.length; i++) {
            if (waitlist[i]['appointmentTime']) {
              activeSlots.push(waitlist[i]['appointmentTime']);
            }
          }
          activeSlots.splice(activeSlots.indexOf(this.waitlist_data.appointmentTime), 1);
          const slots = allSlots.filter(x => !activeSlots.includes(x));
          this.availableSlots = slots;
        }
      );
    }
  }

  getWaitlistNotes(uuid) {
    this.provider_services.getProviderWaitlistNotesnew(uuid)
      .subscribe(
        data => {
          this.waitlist_notes = data;
        },
        () => {
          //  this.snackbarService.openSnackBar(error.error, {'panelClass': 'snackbarerror'});
        }
      );
  }
  getCheckInHistory(uuid) {
    this.provider_services.getProviderWaitlistHistroy(uuid)
      .subscribe(
        data => {
          this.waitlist_history = data;
        },
        () => {
          //  this.snackbarService.openSnackBar(error.error, {'panelClass': 'snackbarerror'});
        }
      );
  }
  getApptHistory(uuid) {
    this.provider_services.getProviderAppointmentHistory(uuid)
      .subscribe(
        data => {
          this.waitlist_history = data;
        },
        () => {
          //  this.snackbarService.openSnackBar(error.error, {'panelClass': 'snackbarerror'});
        }
      );
  }

}
