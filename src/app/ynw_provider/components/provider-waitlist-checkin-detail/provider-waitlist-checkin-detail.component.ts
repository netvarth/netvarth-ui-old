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

@Component({
    selector: 'app-provider-waitlist-checkin-detail',
    templateUrl: './provider-waitlist-checkin-detail.component.html'
})

export class ProviderWaitlistCheckInDetailComponent implements OnInit {

    waitlist_id = null;
    waitlist_data;
    waitlist_notes: any = [];
    breadcrumbs_init = [
        {
          title: 'Dashboard',
          url: '/provider'
        },
        {
          title: 'Check-In'
        },
      ];
    breadcrumbs = this.breadcrumbs_init;
    api_success = null;
    api_error = null;

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
            this.getWaitlistNotes();
          },
          error => {
            this.shared_Functionsobj.openSnackBar(error.error, {'panelClass': 'snackbarerror'});
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

}
