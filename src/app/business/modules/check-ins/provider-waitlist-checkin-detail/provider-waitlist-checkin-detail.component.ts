import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Location } from '@angular/common';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../shared/constants/project-constants';
import { ProviderSharedFuctions } from '../../../../ynw_provider/shared/functions/provider-shared-functions';
import * as moment from 'moment';
import { AddProviderWaitlistCheckInProviderNoteComponent } from '../add-provider-waitlist-checkin-provider-note/add-provider-waitlist-checkin-provider-note.component';
@Component({
  selector: 'app-provider-waitlist-checkin-detail',
  templateUrl: './provider-waitlist-checkin-detail.component.html'
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
  check_in_statuses = projectConstants.CHECK_IN_STATUSES;
  waitlist_id = null;
  waitlist_data;
  waitlist_notes: any = [];
  waitlist_history: any = [];
  settings: any = [];
  esttime: string = null;
  communication_history: any = [];
  est_tooltip = Messages.ESTDATE;
  breadcrumbs_init: any = [
    {
      title: 'Dashboard',
      url: '/provider/check-ins'
    }
  ];
  breadcrumbs = this.breadcrumbs_init;
  api_success = null;
  api_error = null;
  userDet;

  dateFormatSp = projectConstants.PIPE_DISPLAY_DATE_FORMAT_WITH_DAY;
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

  constructor(
    private provider_services: ProviderServices,
    private shared_Functionsobj: SharedFunctions,
    private dialog: MatDialog,
    private router: Router,
    private activated_route: ActivatedRoute,
    private locationobj: Location,
    private provider_shared_functions: ProviderSharedFuctions) {

    this.activated_route.params.subscribe(params => {
      this.waitlist_id = params.id;
    });
    this.customer_label = this.shared_Functionsobj.getTerminologyTerm('customer');
    this.provider_label = this.shared_Functionsobj.getTerminologyTerm('provider');
    this.checkin_label = this.shared_Functionsobj.getTerminologyTerm('waitlist');
    this.checkin_upper = this.shared_Functionsobj.firstToUpper(this.checkin_label);
    this.cust_notes_cap = Messages.CHECK_DET_CUST_NOTES_CAP.replace('[customer]', this.customer_label);
    this.no_cus_notes_cap = Messages.CHECK_DET_NO_CUS_NOTES_FOUND_CAP.replace('[customer]', this.customer_label);
    this.breadcrumbs_init.push({
      'title': this.checkin_upper
    });
  }

  ngOnInit() {
    this.api_loading = true;
    this.pdtype = this.shared_Functionsobj.getitemfromLocalStorage('pdtyp');
    if (!this.pdtype) {
      this.pdtype = 1;
    }
    this.userDet = this.shared_Functionsobj.getitemfromLocalStorage('ynw-user');
    if (this.waitlist_id) {
      // this.getWaitlistDetail();
      this.getProviderSettings();
    } else {
      this.goBack();
    }
    this.isCheckin = this.shared_Functionsobj.getitemfromLocalStorage('isCheckin');
  }

  ngOnDestroy() {
    if (this.sendmsgdialogRef) {
      this.sendmsgdialogRef.close();
    }
    if (this.notedialogRef) {
      this.notedialogRef.close();
    }
  }
  getProviderSettings() {
    this.api_loading = true;
    this.provider_services.getWaitlistMgr()
      .subscribe(data => {
        this.settings = data;
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
          const waitlist_date = new Date(this.waitlist_data.date);

          this.today.setHours(0, 0, 0, 0);
          waitlist_date.setHours(0, 0, 0, 0);

          this.waitlist_data.history = false;

          if (this.today.valueOf() > waitlist_date.valueOf()) {
            this.waitlist_data.history = true;
          }

          this.getWaitlistNotes();
          this.getCheckInHistory(this.waitlist_data.ynwUuid);
          this.getCommunicationHistory(this.waitlist_data.ynwUuid);
        },
        error => {
          this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.goBack();
        }
      );
  }

  getWaitlistNotes() {
    this.provider_services.getProviderWaitlistNotes(this.waitlist_data.consumer.id)
      .subscribe(
        data => {
          this.waitlist_notes = data;
        },
        () => {
          //  this.shared_Functionsobj.openSnackBar(error.error, {'panelClass': 'snackbarerror'});
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
          //  this.shared_Functionsobj.openSnackBar(error.error, {'panelClass': 'snackbarerror'});
        }
      );
  }

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
          //  this.shared_Functionsobj.openSnackBar(error.error, {'panelClass': 'snackbarerror'});
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
    this.notedialogRef = this.dialog.open(AddProviderWaitlistCheckInProviderNoteComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        checkin_id: checkin.ynwUuid
      }
    });

    this.notedialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
        this.getWaitlistNotes();
      }
    });
  }

  changeWaitlistStatus() {

    this.provider_shared_functions.changeWaitlistStatus(this, this.waitlist_data, 'CANCEL');

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

    const uuid = this.waitlist_data.ynwUuid || null;
    this.provider_shared_functions.addConsumerInboxMessage(this.waitlist_data, this)
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
            return this.shared_Functionsobj.convertMinutesToHourMinute(waitlist.appxWaitingTime);
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
    // alert(sHours + ':' + sMinutes);
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
   this. esttime = '';
  }
  saveClicked(esttime) {
    if (esttime) {
      this.provider_services.editWaitTime(this.waitlist_data.ynwUuid, esttime).subscribe(
        () => {
          this.showEditView = false;
          this.getWaitlistDetail();
        }, (error) => {
          this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
    }
    this. esttime = '';
  }
  isNumeric(evt) {
    return this.shared_Functionsobj.isNumeric(evt);
  }
  isvalid(evt) {
    return this.shared_Functionsobj.isValid(evt);
  }
}
