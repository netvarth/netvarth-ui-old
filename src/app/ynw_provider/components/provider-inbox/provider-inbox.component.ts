import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import * as moment from 'moment';

import { ProviderServices } from '../../services/provider-services.service';
import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { ConfirmBoxComponent } from '../../shared/component/confirm-box/confirm-box.component';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Messages } from '../../../shared/constants/project-messages';

import { AddProviderInboxMessageComponent } from '../add-provider-inbox-message/add-provider-inbox-message.component';

@Component({
  selector: 'app-provider-inbox',
  templateUrl: './provider-inbox.component.html',
  styleUrls: ['./provider-inbox.component.scss']
})
export class ProviderInboxComponent implements OnInit {

  messages: any = [];
  constructor( private provider_services: ProviderServices,
    private router: Router, private dialog: MatDialog,
    private shared_functions: SharedFunctions) {}

  ngOnInit() {
    this.getInboxMessages();
  }

  getInboxMessages() {
    this.provider_services.getProviderInbox()
    .subscribe(
      data => {
        this.messages = data;
        this.sortMessages();
      },
      error => {

      }
    );
  }

  sortMessages() {


    this.messages.sort( function(message1, message2) {
      if ( message1.timeStamp < message2.timeStamp ) {
        return 11;
      } else if ( message1.timeStamp > message2.timeStamp ) {
        return -1;
      } else {
        return 0;
      }
    });

  }

  replyMessage(message) {
    const dialogRef = this.dialog.open(AddProviderInboxMessageComponent, {
      width: '50%',
      data: {
        message: message
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
        this.getInboxMessages();
      }
    });
  }

}
