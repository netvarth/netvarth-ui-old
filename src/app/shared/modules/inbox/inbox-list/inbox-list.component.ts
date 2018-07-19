import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';



import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { Messages } from '../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../shared/constants/project-constants';
import { InboxServices } from '../inbox.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import { Subscription, ISubscription } from 'rxjs/Subscription';


import { AddInboxMessagesComponent } from '../../../components/add-inbox-messages/add-inbox-messages.component';

@Component({
  selector: 'app-inbox-list',
  templateUrl: './inbox-list.component.html'
  /*,
  styleUrls: ['./provider-inbox.component.scss']*/
})
export class InboxListComponent implements OnInit, OnDestroy {


  dateFormat = projectConstants.PIPE_DISPLAY_DATE_TIME_FORMAT;
  selectedMsg = -1;
  user_id;
  shownomsgdiv = false;
  hide_reply_button = false;
  terminologies = null;
  usertype = null;
  loading = true;

  cronHandle: Subscription;
  refreshTime = projectConstants.INBOX_REFRESH_TIME;

  @Input() messages: any;
  @Input() fromsource: any;
  @Output() reloadApi = new EventEmitter<any>();

  constructor( private inbox_services: InboxServices,
    private router: Router, private dialog: MatDialog,
    private shared_functions: SharedFunctions) {}

  ngOnInit() {

    if (this.fromsource === 'provider_checkin_detail' ||
    this.fromsource === 'consumer_checkin_detail' ) {
      this.hide_reply_button = true;
    } else {
      this.hide_reply_button = false;
    }
    this.terminologies = this.shared_functions.getTerminologies();
    this.usertype = this.shared_functions.isBusinessOwner('returntyp');

    if (this.usertype === 'provider') {
      this.inbox_services.getBussinessProfile()
      .subscribe(
        (data: any) => {
          this.user_id = data.id;
          this.loading = false;
        },
        error => {
          this.loading = false;
        }
      );
    } else {
      const userDet = this.shared_functions.getitemfromLocalStorage('ynw-user');
      this.user_id = userDet.id;
      this.loading = false;
    }

    this.cronHandle = Observable.interval(this.refreshTime * 1000).subscribe(x => {
      this.reloadApi.emit();
    });

  }

  ngOnDestroy() {
     if (this.cronHandle) {
      this.cronHandle.unsubscribe();
     }
  }

  replyMessage(message, type) {

    const pass_ob = {};
    let name = null;

    let source = this.usertype + '-';
    if (message.waitlistId) {
      source = source + 'waitlist';
      pass_ob['uuid'] = message.waitlistId;
    } else {
      source = source + 'common';
    }

    if (this.usertype === 'consumer') {
      name = message.owner.userName || null;
    }

    pass_ob['source'] = source;
    pass_ob['user_id'] = message['owner']['id'];
    pass_ob['type'] = 'reply';
    pass_ob['terminologies'] = this.terminologies;
    pass_ob['name'] = name;

    const dialogRef = this.dialog.open(AddInboxMessagesComponent, {
      width: '50%',
      panelClass: 'commonpopupmainclass',
      autoFocus: true,
      data: pass_ob,
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
