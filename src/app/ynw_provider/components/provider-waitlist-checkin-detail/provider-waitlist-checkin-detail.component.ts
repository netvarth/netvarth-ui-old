import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HeaderComponent } from '../../../shared/modules/header/header.component';
import { Location } from '@angular/common';

import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { ProviderServices } from '../../services/provider-services.service';
import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { FormMessageDisplayService } from '../../../shared/modules/form-message-display/form-message-display.service';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';
import { ProviderSharedFuctions } from '../../shared/functions/provider-shared-functions';
import { AddProviderWaitlistCheckInProviderNoteComponent } from '../../components/add-provider-waitlist-checkin-provider-note/add-provider-waitlist-checkin-provider-note.component';
import * as moment from 'moment';
import { AddInboxMessagesComponent } from '../../../shared/components/add-inbox-messages/add-inbox-messages.component';

@Component({
    selector: 'app-provider-waitlist-checkin-detail',
    templateUrl: './provider-waitlist-checkin-detail.component.html'
})

export class ProviderWaitlistCheckInDetailComponent implements OnInit {

    waitlist_id = null;
    waitlist_data;
    waitlist_notes: any = [];
    waitlist_history: any = [];
    communication_history: any = [];
    est_tooltip = Messages.ESTDATE;
    breadcrumbs_init: any = [
        {
          title: 'Dashboard',
          url: '/provider'
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

    constructor(
        private provider_services: ProviderServices,
        private provider_datastorage: ProviderDataStorageService,
        private shared_Functionsobj: SharedFunctions,
        private dialog: MatDialog,
        private router: Router,
        private activated_route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private locationobj: Location,
        private provider_shared_functions: ProviderSharedFuctions) {

            this.activated_route.params.subscribe(params => {
                this.waitlist_id = params.id;
            });
            this.customer_label = this.shared_Functionsobj.getTerminologyTerm('customer');
            this.provider_label = this.shared_Functionsobj.getTerminologyTerm('provider');
            this.checkin_label = this.shared_Functionsobj.getTerminologyTerm('waitlist');
            this.checkin_upper  = this.shared_Functionsobj.firstToUpper(this.checkin_label);

            this.breadcrumbs_init.push({
                'title': this.checkin_upper
              });
        }

    ngOnInit() {
      this.userDet = this.shared_Functionsobj.getitemfromLocalStorage('ynw-user');
        if (this.waitlist_id) {
          this.getWaitlistDetail();

        } else {
            this.goBack();
        }

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
            this.shared_Functionsobj.openSnackBar(error, {'panelClass': 'snackbarerror'});
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
          error => {
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
          error => {
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
              if (his.waitlistId === uuid) {
                this.communication_history.push(his);
              }
            }
            this.sortMessages();
            this.shared_Functionsobj.sendMessage({'ttype': 'load_unread_count', 'action': 'setzero'});

          },
          error => {
           //  this.shared_Functionsobj.openSnackBar(error.error, {'panelClass': 'snackbarerror'});
          }
      );
    }

    sortMessages() {
      this.communication_history.sort( function(message1, message2) {
        if ( message1.timeStamp < message2.timeStamp ) {
          return 11;
        } else if ( message1.timeStamp > message2.timeStamp ) {
          return -1;
        } else {
          return 0;
        }
      });

    }

    goBack() {
      this.router.navigate(['provider']);
    }

    addProviderNote(checkin) {
      const dialogRef = this.dialog.open(AddProviderWaitlistCheckInProviderNoteComponent, {
        width: '50%',
        panelClass: ['commonpopupmainclass'],
        data: {
          checkin_id: checkin.ynwUuid
        }
      });

      dialogRef.afterClosed().subscribe(result => {
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
        result => {
          this.getWaitlistDetail();
        }
      );
    }

    addConsumerInboxMessage() {

      const uuid = this.waitlist_data.ynwUuid || null;

      this.provider_shared_functions.addConsumerInboxMessage(uuid)
      .then(
        result => {
          this.getCommunicationHistory(uuid);
        },
        error => {

        }
      );
    }
    gotoPrev() {
      this.locationobj.back();
    }

    getAppxTime(waitlist) {
       // console.log('wait', waitlist.date, waitlist.queue.queueStartTime);
        /*if (!waitlist.future && waitlist.appxWaitingTime === 0) {
          return 'Now';
        } else if (!waitlist.future && waitlist.appxWaitingTime !== 0) {
          return this.shared_Functionsobj.convertMinutesToHourMinute(waitlist.appxWaitingTime);
        }  else {*/
        // if (waitlist.waitlistStatus === 'arrived' || waitlist.waitlistStatus === 'checkedIn') {
        if (this.checkTimedisplayAllowed(waitlist)) {
          if (waitlist.queue.queueStartTime !== undefined) {
            if (waitlist.hasOwnProperty('serviceTime')) {
              return waitlist.serviceTime;
            } else {
                // const moment_date =  this.AMHourto24(waitlist.date, waitlist.queue.queueStartTime);
                // return moment_date.add(waitlist.appxWaitingTime, 'minutes') ;
                return this.shared_Functionsobj.convertMinutesToHourMinute(waitlist.appxWaitingTime);
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
}
