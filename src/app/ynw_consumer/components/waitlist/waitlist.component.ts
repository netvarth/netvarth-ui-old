import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';


import { ConsumerServices } from '../../services/consumer-services.service';
import { ConsumerDataStorageService } from '../../services/consumer-datastorage.service';
import { SearchFields } from '../../../shared/modules/search/searchfields';
import { projectConstants } from '../../../shared/constants/project-constants';

import { AddInboxMessagesComponent } from '../../../shared/components/add-inbox-messages/add-inbox-messages.component';
import { SharedServices } from '../../../shared/services/shared-services';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

import { ConfirmBoxComponent } from '../../shared/component/confirm-box/confirm-box.component';


@Component({
  selector: 'app-consumer-waitlist',
  templateUrl: './waitlist.component.html'
})
export class WaitlistComponent implements OnInit {

  waitlist_detail;
  provider_id = null;
  waitlist_id = null;
  communication_history: any =  [];

  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;

  public searchfields: SearchFields = new SearchFields();

  constructor( private consumer_services: ConsumerServices,
  private shared_functions: SharedFunctions,
  private router: Router,
  private route: ActivatedRoute,
  private dialog: MatDialog,
  private shared_services: SharedServices) {}

  ngOnInit() {
    this.route.params
    .subscribe((data) => {
      this.provider_id = data.provider_id;
      this.waitlist_id = data.uuid;
      if (this.provider_id && this.waitlist_id) {
        this.getWaitlist();
      } else {
        this.router.navigate(['/consumer']);
      }
    });

  }

  getWaitlist() {
    const params = {
      account:  this.provider_id
    };
    this.consumer_services.getWaitlistDetail(this.waitlist_id, params)
    .subscribe(
      data => {
        this.waitlist_detail = data;
        const waitlist_date = new Date(this.waitlist_detail.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        waitlist_date.setHours(0, 0, 0, 0);

        this.waitlist_detail.history = false;

        if (today.valueOf() > waitlist_date.valueOf()) {
          this.waitlist_detail.history = true;
        }
        this.getCommunicationHistory();
      },
      error => {
        this.shared_functions.openSnackBar(error, {'panelClass': 'snackbarerror'});
      }
    );
  }
  addWaitlistMessage(waitlist) {
    const pass_ob = {};
    pass_ob['source'] = 'consumer-waitlist';
    pass_ob['uuid'] = waitlist.ynwUuid;
    pass_ob['user_id'] = waitlist.provider.id;
    pass_ob['name'] = waitlist.provider.businessName;
    this.addNote(pass_ob);

  }

  addNote(pass_ob) {

    const dialogRef = this.dialog.open(AddInboxMessagesComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'consumerpopupmainclass'],
      autoFocus: true,
      data: pass_ob
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {

      }
    });
  }

  doCancelWaitlist(waitlist) {
    if (!waitlist.ynwUuid || !waitlist.provider.id) {
      return false;
    }

    this.shared_functions.doCancelWaitlist(waitlist)
    .then (
      data => {
        if (data === 'reloadlist') {
          this.getWaitlist();
        }
      },
      error => {
        this.shared_functions.openSnackBar(error, {'panelClass': 'snackbarerror'});
      }
    );
  }

  doDeleteFavProvider(fav) {

    if (!fav.id) {
      return false;
    }

    this.shared_functions.doDeleteFavProvider(fav)
    .then(
      data => {
        if (data === 'reloadlist') {

        }
      },
      error => {
        this.shared_functions.openSnackBar(error, {'panelClass': 'snackbarerror'});
      });
  }

  addFavProvider(id) {
    if (!id) {
      return false;
    }

    this.shared_services.addProvidertoFavourite(id)
    .subscribe(
    data => {

    },
    error => {
      this.shared_functions.openSnackBar(error, {'panelClass': 'snackbarerror'});
    }
    );
  }


  getCommunicationHistory() {
    this.consumer_services.getConsumerCommunications(this.waitlist_detail.provider.id)
    .subscribe(
      data => {
        const history: any = data;
        this.communication_history = [];

        for (const his of history) {
          if (his.waitlistId === this.waitlist_detail.ynwUuid) {
            this.communication_history.push(his);
          }
        }
        this.sortMessages();
      },
      error => {
        this.shared_functions.openSnackBar(error, {'panelClass': 'snackbarerror'});
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

}
