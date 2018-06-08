import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';



import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { Messages } from '../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../shared/constants/project-constants';
import { InboxServices } from '../inbox.service';

import { AddInboxMessagesComponent } from '../../../components/add-inbox-messages/add-inbox-messages.component';

@Component({
  selector: 'app-inbox-list',
  templateUrl: './inbox-list.component.html'
  /*,
  styleUrls: ['./provider-inbox.component.scss']*/
})
export class InboxListComponent implements OnInit {


  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  selectedMsg = -1;
  userDet;
  hide_reply_button = false;

  @Input() messages: any;
  @Input() fromsource: any;
  @Output() reloadApi = new EventEmitter<any>();

  constructor( private inbox_services: InboxServices,
    private router: Router, private dialog: MatDialog,
    private shared_functions: SharedFunctions) {}

  ngOnInit() {
    this.userDet = this.shared_functions.getitemfromLocalStorage('ynw-user');
    if (this.fromsource === 'provider_checkin_detail') {
      this.hide_reply_button = true;
    } else {
      this.hide_reply_button = false;
    }
  }


  replyMessage(message, type) {

    const pass_ob = {};
    const usertype = this.shared_functions.isBusinessOwner('returntyp');
    let source = usertype + '-';
    if (message.waitlistId) {
      source = source + 'waitlist';
      pass_ob['uuid'] = message.waitlistId;
    } else {
      source = source + 'common';
    }

    pass_ob['source'] = source;
    pass_ob['user_id'] = message['owner']['id'];
    pass_ob['type'] = 'reply';

    const dialogRef = this.dialog.open(AddInboxMessagesComponent, {
      width: '50%',
      panelClass: 'commonpopupmainclass',
      autoFocus: true,
      data: pass_ob
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
        this.selectedMsg = -1;
        this.reloadApi.emit();
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
