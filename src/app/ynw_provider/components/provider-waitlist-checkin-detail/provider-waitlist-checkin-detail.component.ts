import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HeaderComponent } from '../../../shared/modules/header/header.component';

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
    breadcrumbs_init: any = [
        {
          title: 'Dashboard',
          url: '/provider'
        }
      ];
    breadcrumbs = this.breadcrumbs_init;
    api_success = null;
    api_error = null;
    dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
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
        }
      );
    }

}
