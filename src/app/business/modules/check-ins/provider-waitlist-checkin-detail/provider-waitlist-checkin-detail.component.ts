import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../services/provider-services.service';
import { Messages } from '../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../app.component';
import { ProviderSharedFuctions } from '../../../functions/provider-shared-functions';
import * as moment from 'moment';
import { AddProviderWaitlistCheckInProviderNoteComponent } from '../add-provider-waitlist-checkin-provider-note/add-provider-waitlist-checkin-provider-note.component';
import { CheckinActionsComponent } from '../checkin-actions/checkin-actions.component';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { DateTimeProcessor } from '../../../../shared/services/datetime-processor.service';
import { JaldeeTimeService } from '../../../../shared/services/jaldee-time-service';
import { CommunicationService } from '../../../../business/services/communication-service';
import { BookingHistoryComponent } from '../../appointments/booking-history/booking-history.component';
import { CommunicationPopupComponent } from '../../bookings/communication-popup/communication-popup.component';

@Component({
  selector: 'app-provider-waitlist-checkin-detail',
  templateUrl: './provider-waitlist-checkin-detail.component.html',
  styleUrls: ['./provider-details.component.css']
})

export class ProviderWaitlistCheckInDetailComponent implements OnInit, OnDestroy {
  go_back_cap = Messages.CHECK_DET_GO_BACK_CAP;
  details_cap = Messages.CHECK_DET_DETAILS_CAP;
  name_cap = Messages.CHECK_DET_NAME_CAP;
  date_cap = Messages.CHECK_DET_DATE_CAP;
  location_cap = Messages.CHECK_DET_LOCATION_CAP;
  waitlist_for_cap = Messages.CHECK_DET_WAITLIST_FOR_CAP;
  service_cap = Messages.CHECK_DET_SERVICE_CAP;
  queue_cap = Messages.CHECK_DET_QUEUE_CAP;
  pay_status_cap = Messages.CHECK_DET_PAY_STATUS_CAP;
  not_paid_cap = Messages.CHECK_DET_NOT_PAID_CAP;
  partially_paid_cap = Messages.CHECK_DET_PARTIALLY_PAID_CAP;
  paid_cap = Messages.CHECK_DET_PAID_CAP;
  party_size_cap = Messages.CHECK_DET_PARTY_SIZE_CAP;
  send_msg_cap = Messages.CHECK_DET_SEND_MSG_CAP;
  add_pvt_note_cap = Messages.CHECK_DET_ADD_PRVT_NOTE_CAP;
  cancel_cap = Messages.CHECK_DET_CANCEL_CAP;
  communication_history_cap = Messages.CHECK_DET_COMM_HISTORY_CAP;
  pvt_notes_cap = Messages.CHECK_DET_PRVT_NOTES_CAP;
  cust_notes_cap = Messages.CHECK_DET_CUST_NOTES_CAP;
  no_pvt_notes_cap = Messages.CHECK_DET_NO_PVT_NOTES_FOUND_CAP;
  no_cus_notes_cap = Messages.CHECK_DET_NO_CUS_NOTES_FOUND_CAP;
  no_history_found = Messages.CHECK_DET_NO_HISTORY_FOUND_CAP;
  check_in_statuses = projectConstantsLocal.CHECK_IN_STATUSES;
  optinal_fields = Messages.DISPLAYBOARD_OPTIONAL_FIELDS;
  waitlist_id = null;
  waitlist_data;
  waitlist_notes: any = [];
  waitlist_history: any = [];
  settings: any = [];
  showToken = false;
  esttime: string = null;
  apptTime;
  communication_history: any = [];
  est_tooltip = Messages.ESTDATE;
  api_success = null;
  api_error = null;
  userDet;
  dateFormatSp = projectConstants.PIPE_DISPLAY_DATE_FORMAT_WITH_DAY;
  newDateFormat = projectConstantsLocal.DATE_EE_MM_DD_YY_FORMAT;
  newTimeDateFormat = projectConstantsLocal.DATE_MM_DD_YY_HH_MM_A_FORMAT;
  timeFormat = projectConstants.PIPE_DISPLAY_TIME_FORMAT;
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  dateTimeFormat = projectConstants.PIPE_DISPLAY_DATE_TIME_FORMAT;
  today = new Date();
  customer_label = '';
  provider_label = '';
  checkin_label = '';
  checkin_upper = '';
  timeCaption = Messages.CHECKIN_TIME_CAPTION;
  minCaption = Messages.EST_WAIT_TIME_CAPTION;
  sendmsgdialogRef;
  notedialogRef;
  isCheckin;
  showEditView = false;
  api_loading = true;
  pdtype;
  editAppntTime = false;
  board_count = 0;
  showTimePicker = false;
  availableSlots: any = [];
  callingModes = projectConstants.CALLING_MODES;
  pos = false;
  iconClass: string;
  spfname: any;
  splname: any;
  view_more = false;
  multiSelection = false;
  timetype;
  spName: any;
  showImages: any = [];
  internalStatuslog: any = [];
  statusLog: any = [];
  questionnaires: any = [];
  teams: any;
  waitlistModes = [
    { mode: 'WALK_IN_CHECKIN', value: 'Walk in ' },
    { mode: 'PHONE_CHECKIN', value: 'Phone in ' },
    { mode: 'ONLINE_CHECKIN', value: 'Online ' },
  ];
  bookinghistorydialogref: any;
  booking_stat;
  consumerBills: any = [];
  historyvisitDetails: any;
  small_device_display: boolean;
  showStart: boolean = true;
  constructor(
    private provider_services: ProviderServices,
    private shared_Functionsobj: SharedFunctions,
    private dialog: MatDialog,
    private router: Router,
    private activated_route: ActivatedRoute,
    private locationobj: Location,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor,
    private groupService: GroupStorageService,
    private dateTimeProcessor: DateTimeProcessor,
    private jaldeeTimeService: JaldeeTimeService,
    private communicationService: CommunicationService,
    private provider_shared_functions: ProviderSharedFuctions) {
    this.activated_route.params.subscribe(params => {
      this.waitlist_id = params.id;
    });
    this.activated_route.queryParams.subscribe(params => {
      this.timetype = JSON.parse(params.timetype);
      
    });
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
    this.checkin_label = this.wordProcessor.getTerminologyTerm('waitlist');
    this.checkin_upper = this.wordProcessor.firstToUpper(this.checkin_label);
    this.cust_notes_cap = Messages.CHECK_DET_CUST_NOTES_CAP.replace('[customer]', this.customer_label);
    this.no_cus_notes_cap = Messages.CHECK_DET_NO_CUS_NOTES_FOUND_CAP.replace('[customer]', this.customer_label);
    
  }
  ngOnInit() {
    this.getPos();
    // this.getDisplayboardCount();
    this.api_loading = true;
    this.pdtype = this.groupService.getitemFromGroupStorage('pdtyp');
    if (!this.pdtype) {
      this.pdtype = 1;
    }
    this.userDet = this.groupService.getitemFromGroupStorage('ynw-user');
    if (this.waitlist_id) {
      // this.getWaitlistDetail();
      this.getProviderSettings();
    } else {
      this.goBack();
    }
    this.isCheckin = this.groupService.getitemFromGroupStorage('isCheckin');
    if (this.userDet.accountType === 'BRANCH') {
      this.getTeams().then((data) => {
        this.teams = data;
      });
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 767) {
      this.small_device_display = true;
    } else {
      this.small_device_display = false;
    }
  }

  getAgent(fileName){
    //'BROWSER' || 'IOS' || 'ANDROID'
    if(fileName){
    return fileName.toLocaleLowerCase();
    }
  }
  getReqFrom(browser,agent) {
    let browserName = ''
     if(browser){
  //   if(browser === "WEB_UI"){
  //   browserName = browser.slice(0, 3);
  //   }
  //   if(browser === 'WEB_LINK'){
  //     browserName = 'IOS'
  //   }
  //   if(browser){
  //    if(browser.length >8){
  //     browserName = browser.slice(0,8);
  //   }
  // }
      
    if(browser.includes("Android")){
      browserName = 'Android'
      return browserName.toLocaleLowerCase();

    }
    if(browser.includes("iPhone")){
      browserName = 'IOS'
      return browserName.toLocaleLowerCase();

    }
    if(browser.includes("Windows") || browser.includes("Intel Mac OS") || browser.includes("iPhone")){
      browserName = 'Web'
      return browserName.toLocaleLowerCase();

    }
   
  

  }
  if(browser === undefined && agent === "BROWSER"){
    browserName = 'web'
    return browserName;
  }
    
  
  
}

getConsumerBills() {
  const filter = { 'providerConsumer-eq': this.waitlist_data.waitlistingFor[0].id };
  this.provider_services.getProviderBills(filter).subscribe(data => {
      this.consumerBills = data;
  })
  console.log("consumer bills called")
}

getCustomerHistoryVisit() {
  this.provider_services.getCustomerHistoryVisit(this.waitlist_data.waitlistingFor[0].id).subscribe(
      (data: any) => {
          this.historyvisitDetails = data;
      }
  );
}

editCustomerDetails() {
  const navigationExtras: NavigationExtras = {
      queryParams: { action: 'edit', id: this.waitlist_data.waitlistingFor[0].id}
  };
  this.router.navigate(['/provider/customers/create'], navigationExtras);
}

  getBookingReqFrom(browser, reqFrom) {
    let browserName = ''
    //let status;
    if(browser){
      if(browser.includes("Android")){
        browserName = 'Android'
        return browserName.toLocaleLowerCase();
  
      }
      if(browser.includes("iPhone")){
        browserName = 'IOS'
        return browserName.toLocaleLowerCase();
  
      }
      if(browser.includes("Windows") || browser.includes("Intel Mac OS") || browser.includes("Linux") || browser.includes("CrOS")){
        browserName = 'Web'
        return browserName.toLocaleLowerCase();
  
      }
     
     
    }
    if (browser === undefined && reqFrom === "SP_APP" || "CONSUMER_APP") {
      browserName = "App";
      return browserName.toLocaleLowerCase();
    }
    // if(browser === 'WEB_LINK'){
    //   browserName = 'IOS'
    // }
    // if(browser){
    //  if(browser.length >8){
    //   browserName = browser.slice(0,8);
    // }
  

    return browserName.toLocaleLowerCase();
  }
  getWaitListMode(mode) {
    let currentmode=[];
    currentmode=this.waitlistModes.filter(obj=>obj.mode===mode);
    return currentmode[0].value;

  }
  ngOnDestroy() {
    if (this.sendmsgdialogRef) {
      this.sendmsgdialogRef.close();
    }
    if (this.notedialogRef) {
      this.notedialogRef.close();
    }
  }
  checkDataNull(value) {
    return value.trim() !== "";
  }
  getProviderSettings() {
    this.api_loading = true;
    this.provider_services.getWaitlistMgr()
      .subscribe(data => {
        this.settings = data;
        this.showToken = this.settings.showTokenId;
        this.getWaitlistDetail();
        this.api_loading = false;
      }, () => {
        this.api_loading = false;
      });
  }
  getWaitlistDetail() {
    this.provider_services.getProviderWaitlistDetailById(this.waitlist_id)
      .subscribe(
        data => {
          this.waitlist_data = data; 
          this.getConsumerBills();
          this.getCustomerHistoryVisit();
          console.log('waitlist dtata',this.waitlist_data)
          if (this.waitlist_data.questionnaires && this.waitlist_data.questionnaires.length > 0) {
            this.questionnaires = this.waitlist_data.questionnaires;
          }
          if (this.waitlist_data.releasedQnr && this.waitlist_data.releasedQnr.length > 0) {
            const releasedQnrs = this.waitlist_data.releasedQnr.filter(qnr => qnr.status === 'released');
            if (releasedQnrs.length > 0) {
              this.getReleasedQnrs(releasedQnrs);
            }
          }
          if (this.waitlist_data.service.serviceType === 'virtualService') {
            switch (this.waitlist_data.service.virtualCallingModes[0].callingMode) {
              case 'Zoom': {
                this.iconClass = 'fa zoom-icon';
                break;
              }
              case 'VideoCall': {
                this.iconClass = 'fa jvideo-icon jvideo-icon-s jvideo-icon-mgm5';
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
          this.getWaitlistNotes(this.waitlist_data.ynwUuid);
          if (this.waitlist_data.waitlistStatus !== 'blocked') {
            this.getWaitlistNotes(this.waitlist_data.ynwUuid);
          }
          this.getCheckInHistory(this.waitlist_data.ynwUuid).then(data => {
            this.waitlist_history = data;
            console.log('waitlisthistory',this.waitlist_history)
            this.getInternalStatusLog(this.waitlist_data.ynwUuid).then((status: any) => {
              this.internalStatuslog = status;
              // for(let stat of status){

              // const newStatus={'waitlistStatus':stat.InternalStatus,'time':stat.DateTime,'user':stat.User}
              // this.internalStatuslog.push(newStatus)
              // }

              // this.statusLog=this.waitlist_history.concat(this.internalStatuslog);
              //this.statusLog =  this.statusLog.sort((a,b) => 0 - (a.DateTime > b.DateTime ? -1 : 1));            
            });
          });
          this.getCommunicationHistory(this.waitlist_data.ynwUuid);
          if (this.waitlist_data.provider) {
            this.spName = (this.waitlist_data.provider.businessName) ? this.waitlist_data.provider.businessName : this.waitlist_data.provider.firstName + ' ' + this.waitlist_data.provider.lastName;
            this.spfname = this.waitlist_data.provider.firstName;
            this.splname = this.waitlist_data.provider.lastName;
          }
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.goBack();
        }
      );
  }

  getCheckInHistory(uuid) {
    const _this = this;
    return new Promise(function (resolve, reject) {

      _this.provider_services.getProviderWaitlistHistroy(uuid)
        .subscribe(
          data => {
            resolve(data);
          },
          () => {
            reject();
          }
        );
    });
  }
  showCommunications() {
    console.log("communication data : ",this.waitlist_data.virtualService.WhatsApp.slice(2,));
    this.dialog.open(CommunicationPopupComponent, {
        width: '50%',
        panelClass: ['commonpopupmainclass', 'confirmationmainclass', 'newPopupClass'],
        disableClose: true,
        data: {
            whatsappCountryCode: this.waitlist_data.countryCode,
            whatsappNumber: this.waitlist_data.virtualService.WhatsApp.slice(2,),
            number: this.waitlist_data.waitlistingFor[0].phoneNo,
            customerId: this.waitlist_data.waitlistingFor[0].id,
            email: this.waitlist_data.waitlistingFor[0].email,
            type: 'customer'
        }
    });
}

  getInternalStatusLog(uuid) {
    const _this = this;
    return new Promise(function (resolve, reject) {

      _this.provider_services.getProviderWaitlistinternalHistroy(uuid)
        .subscribe(
          data => {
            resolve(data);
          },
          () => {
            reject();
          }
        );
    });

  }

  openbookinghistory() {
    this.bookinghistorydialogref = this.dialog.open(BookingHistoryComponent, {
      width: '60%',
      height: 'auto',
      data: {
        type:'Token History',
        providername:this.spName,
        appointmentby:this.waitlist_data.waitlistedBy,
        bookingmode:this.getWaitListMode(this.waitlist_data.waitlistMode),
        consumername:this.waitlist_data.consumer.firstName+" "+this.waitlist_data.consumer.lastName,
        details:this.waitlist_history,
        booking_stat : this.booking_stat
      }
    })
  }
  // getWaitlistNotes() {
  //   this.provider_services.getProviderWaitlistNotes(this.waitlist_data.consumer.id)
  getWaitlistNotes(uuid) {
    this.provider_services.getProviderWaitlistNotesnew(uuid)
      .subscribe(
        data => {
          this.waitlist_notes = data;
          console.log(this.waitlist_notes,';;;;;;;;;;;;')
        },
        () => {
          //  this.snackbarService.openSnackBar(error.error, {'panelClass': 'snackbarerror'});
        }
      );
  }
  // getCheckInHistory(uuid) {
  //   this.provider_services.getProviderWaitlistHistroy(uuid)
  //     .subscribe(
  //       data => {
  //         this.waitlist_history = data;
  //       },
  //       () => {
  //         //  this.snackbarService.openSnackBar(error.error, {'panelClass': 'snackbarerror'});
  //       }
  //     );
  // }

  getCommunicationHistory(uuid) {
    this.provider_services.getProviderInbox()
      .subscribe(
        data => {
          const history: any = data;
          this.communication_history = [];
          for (const his of history) {
            if (his.waitlistId === uuid || his.waitlistId === uuid.replace('h_', '')) {
              this.communication_history.push(his);
            }
          }
          this.sortMessages();
          this.shared_Functionsobj.sendMessage({ 'ttype': 'load_unread_count', 'action': 'setzero' });
        },
        () => {
          //  this.snackbarService.openSnackBar(error.error, {'panelClass': 'snackbarerror'});
        }
      );
  }

  sortMessages() {
    this.communication_history.sort(function (message1, message2) {
      if (message1.timeStamp < message2.timeStamp) {
        return 11;
      } else if (message1.timeStamp > message2.timeStamp) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  goBack() {
    this.api_loading = false;
    this.router.navigate(['provider']);
  }

  addProviderNote(checkin) {
    console.log("dialog box opened")
    this.notedialogRef = this.dialog.open(AddProviderWaitlistCheckInProviderNoteComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        checkin_id: checkin.ynwUuid
      }
    });

    this.notedialogRef.afterClosed().subscribe(result => {
      console.log("result ..",result)
      if (result === 'reloadlist') {
        // this.getWaitlistNotes();
        console.log("dialog box losed")
        this.getWaitlistNotes(this.waitlist_data.ynwUuid);

      }
    });
  }

  changeWaitlistStatus(action) {
    if(action == "STARTED")
    {
      this.showStart = false;
    }
    this.provider_shared_functions.changeWaitlistStatus(this, this.waitlist_data, action);
  }

  changeWaitlistStatusApi(waitlist, action, post_data = {}) {
    this.provider_shared_functions.changeWaitlistStatusApi(this, waitlist, action, post_data)
      .then(
        () => {
          this.getWaitlistDetail();
        }
      );
  }

  addConsumerInboxMessage() {
    const waitlist = [];
    waitlist.push(this.waitlist_data);
    const uuid = this.waitlist_data.ynwUuid || null;
    this.communicationService.addConsumerInboxMessage(waitlist, this)
      .then(
        () => {
          this.getCommunicationHistory(uuid);
        },
        () => {

        }
      );
  }
  gotoPrev() {
    this.locationobj.back();
  }
  getTimeSlots(QStartTime, QEndTime, interval) {
    this.availableSlots = [];
    const _this = this;
    const locId = this.groupService.getitemFromGroupStorage('loc_id');
    // const curTimeSub = moment(new Date().toLocaleString(this.dateTimeProcessor.REGION_LANGUAGE, { timeZone: this.dateTimeProcessor.TIME_ZONE_REGION })).subtract(interval, 'm');
    // const curTimeSubDt = moment(curTimeSub, 'YYYY-MM-DD HH:mm A').format(projectConstants.POST_DATE_FORMAT_WITHTIME_A);
    const nextTimeDt = this.dateTimeProcessor.getDateFromTimeString(moment(new Date().toLocaleString(this.dateTimeProcessor.REGION_LANGUAGE, { timeZone: this.dateTimeProcessor.TIME_ZONE_REGION }), ['YYYY-MM-DD HH:mm A']).format('HH:mm A').toString());
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
  getAppxTime(waitlist, retcap?) {
    /*if (!waitlist.future && waitlist.appxWaitingTime === 0) {
      return 'Now';
    } else if (!waitlist.future && waitlist.appxWaitingTime !== 0) {
      return this.shared_Functionsobj.convertMinutesToHourMinute(waitlist.appxWaitingTime);
    }  else {*/
    // if (waitlist.waitlistStatus === 'arrived' || waitlist.waitlistStatus === 'checkedIn') {
    if (this.checkTimedisplayAllowed(waitlist)) {
      if (waitlist.queue.queueStartTime !== undefined) {
        if (waitlist.hasOwnProperty('serviceTime')) {
          if (retcap) {
            return this.timeCaption;
          } else {
            return waitlist.serviceTime;
          }
        } else {
          // const moment_date =  this.AMHourto24(waitlist.date, waitlist.queue.queueStartTime);
          // return moment_date.add(waitlist.appxWaitingTime, 'minutes') ;
          if (retcap) {
            // if (this.settings['calculationMode'] !== 'NoCalc') {
            //   return 'Date-Est Wait Time'; // this.minCaption;
            // } else {
            return 'Date'; // this.minCaption;
            // }
          } else {
            return this.dateTimeProcessor.convertMinutesToHourMinute(waitlist.appxWaitingTime);
          }
        }
      } else {
        return -1;
      }
    } else {
      return -1;
    }
    //  }
  }
  checkTimedisplayAllowed(waitlist) {
    if ((waitlist.waitlistStatus === 'arrived' || waitlist.waitlistStatus === 'checkedIn') && !this.checkIsHistory(waitlist)) {
      if (waitlist.queue.queueStartTime !== undefined) {
        return true;
      }
    }
    return false;
  }

  checkIsHistory(waitlist) {
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
    const checkindate = waitlist.date;
    const dtoday = yyyy + '-' + cmon + '-' + cday;
    const date1 = new Date(checkindate);
    const date2 = new Date(dtoday);
    if (date2.getTime() > date1.getTime()) {
      return true;
    } else {
      return false;
    }
  }
  AMHourto24(date, time12) {
    const time = time12;
    let hours = Number(time.match(/^(\d+)/)[1]);
    const minutes = Number(time.match(/:(\d+)/)[1]);
    const AMPM = time.match(/\s(.*)$/)[1];
    if (AMPM === 'PM' && hours < 12) { hours = hours + 12; }
    if (AMPM === 'AM' && hours === 12) { hours = hours - 12; }
    const sHours = hours;
    const sMinutes = minutes;
    const mom_date = moment(date);
    mom_date.set('hour', sHours);
    mom_date.set('minute', sMinutes);
    return mom_date;
  }
  editClicked() {
    this.showEditView = true;
  }
  cancelClicked() {
    this.showEditView = false;
    this.esttime = '';
  }
  saveClicked(esttime) {
    if (esttime) {
      this.provider_services.editWaitTime(this.waitlist_data.ynwUuid, esttime).subscribe(
        () => {
          this.showEditView = false;
          this.getWaitlistDetail();
        }, (error) => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
    }
    this.esttime = '';
  }
  isNumeric(evt) {
    return this.shared_Functionsobj.isNumeric(evt);
  }
  isvalid(evt) {
    return this.shared_Functionsobj.isValid(evt);
  }
  editApptTime() {
    // tslint:disable-next-line: radix
    this.editAppntTime = true;
    this.apptTime = this.waitlist_data.appointmentTime;
  }
  cancelUpdation() {
    this.editAppntTime = false;
  }
  // changetime(passtime) {
  //   this.appttime = passtime;
  // }
  saveApptTime(time) {
    // const apptTimeFormat = moment(this.appttime).format('hh:mm A') || null;
    this.provider_services.updateApptTime(this.waitlist_data.ynwUuid, time).subscribe(
      () => {
        this.editAppntTime = false;
        this.getWaitlistDetail();
      }, (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      }
    );
  }
  getDisplayboardCount() {
    let layout_list: any = [];
    this.provider_services.getDisplayboardsWaitlist()
      .subscribe(
        data => {
          layout_list = data;
          this.board_count = layout_list.length;
        });
  }
  setApptTime() {
    (this.showTimePicker) ? this.showTimePicker = false : this.showTimePicker = true;
  }
  getPos() {
    this.provider_services.getProviderPOSStatus().subscribe(data => {
      this.pos = data['enablepos'];
    });
  }
  viewMore() {
    this.view_more = !this.view_more;
  }
  gotoActions(checkin?) {
    console.log("opend")
    let waitlist = [];
    if (checkin) {
      waitlist = checkin;
    }
    const actiondialogRef = this.dialog.open(CheckinActionsComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'checkinactionclass'],
      disableClose: true,
      data: {
        checkinData: waitlist,
        multiSelection: this.multiSelection,
        timetype: this.timetype,
        NoViewDetail: 'true'
      }
    });
    actiondialogRef.afterClosed().subscribe(data => {
      // console.log("data....",data);
      this.getProviderSettings();
    });
  }
  showImagesection(index) {
    (this.showImages[index]) ? this.showImages[index] = false : this.showImages[index] = true;
  }
  getThumbUrl(attachment) {
    if (attachment.s3path.indexOf('.pdf') !== -1) {
      return attachment.thumbPath;
    } else {
      return attachment.s3path;
    }
  }
  getformatedTime(time) {
    let timeDate;
    timeDate = time.replace(/\s/, 'T');
    return timeDate;
  }
  getFormatedDateTime(date) {
    return this.dateTimeProcessor.transformToYMDFormat(date);
  }
  getReleasedQnrs(releasedQnrs) {
    this.provider_services.getWaitlistQuestionnaireByUid(this.waitlist_data.ynwUuid).subscribe((data: any) => {
      const qnrs = data.filter(function (o1) {
        return releasedQnrs.some(function (o2) {
          return o1.id === o2.id;
        });
      });
      this.questionnaires = this.questionnaires.concat(qnrs);
    });
  }
  getQuestionAnswers(event) {
    if (event === 'reload') {
      this.getWaitlistDetail();
    }
  }
  getQnrStatus(qnr) {
    const id = (qnr.questionnaireId) ? qnr.questionnaireId : qnr.id;
    const questr = this.waitlist_data.releasedQnr.filter(questionnaire => questionnaire.id === id);
    if (questr[0]) {
      return questr[0].status;
    }
  }
  getTeams() {
    const _this = this;
    return new Promise<void>(function (resolve) {
      _this.provider_services.getTeamGroup().subscribe(data => {
        _this.teams = data;
      },
        () => {
          resolve();
        });
    });
  }
  getUsersList(teamid) {
    const userObject = this.teams.filter(user => parseInt(user.id) === teamid);
    if (userObject[0] && userObject[0].name) {
      return userObject[0].name;
    }
  }

}
