import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';



import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';
import { InboxServices } from './inbox.service';

import { InboxMessageComponent } from '../../components/inbox-message/inbox-message.component';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html'
  /*,
  styleUrls: ['./provider-inbox.component.scss']*/
})
export class InboxComponent implements OnInit {

  messages: any = [];
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  breadcrumbs = [
    {
      title: 'Dashboard',
      url: '/' + this.shared_functions.isBusinessOwner('returntyp')
    },
    {
      title: 'Inbox'
    }
  ];
  selectedMsg = -1;

  constructor( private inbox_services: InboxServices,
    private router: Router, private dialog: MatDialog,
    private shared_functions: SharedFunctions) {}

  ngOnInit() {
    this.getInboxMessages();
  }

  getInboxMessages() {
    const usertype = this.shared_functions.isBusinessOwner('returntyp');
    this.inbox_services.getInbox(usertype)
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
    const dialogRef = this.dialog.open(InboxMessageComponent, {
      width: '50%',
      panelClass: 'commonpopupmainclass',
      autoFocus: true,
      data: {
        message: message,
        heading: 'Send Reply'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
        this.getInboxMessages();
      }
    });
  }
  showMsg(indx) {
    this.selectedMsg = indx;
  }
  closeMsg() {
    this.selectedMsg = -1;
  }
}
