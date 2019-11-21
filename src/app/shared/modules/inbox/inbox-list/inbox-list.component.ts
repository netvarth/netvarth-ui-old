
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
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
export class InboxListComponent implements OnInit, OnDestroy {
  provider_consumer_cap = Messages.PROVIDER_CONSUMER_CAP;
  service_cap = Messages.SERVICE_CAP;
  message_cap = Messages.MESSAGE_CAP;
  date_time_cap = Messages.DATE_TIME_CAP;
  reply_cap = Messages.REPLY_CAP;
  close_cap = Messages.CLOSE_BTN;
  delete_msg_cap = Messages.DELETE_MSG_CAP;
  no_msg_exists_cap = Messages.NO_MSG_EXISTS_CAP;
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
  msgdialogRef;
  fileTooltip = Messages.FILE_TOOLTIP;
  showImages = false;

  @Input() messages: any;
  @Input() fromsource: any;
  @Output() reloadApi = new EventEmitter<any>();

  constructor(private inbox_services: InboxServices,
    private dialog: MatDialog,
    private shared_functions: SharedFunctions) { }

  ngOnInit() {
console.log(this.messages);
    if (this.fromsource === 'provider_checkin_detail' ||
      this.fromsource === 'consumer_checkin_detail') {
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
          () => {
            this.loading = false;
          }
        );
    } else {
      const userDet = this.shared_functions.getitemfromLocalStorage('ynw-user');
      this.user_id = userDet.id;
      this.loading = false;
    }

    this.cronHandle = Observable.interval(this.refreshTime * 1000).subscribe(() => {
      this.reloadApi.emit();
    });

  }

  ngOnDestroy() {
    if (this.cronHandle) {
      this.cronHandle.unsubscribe();
    }
    if (this.msgdialogRef) {
      this.msgdialogRef.close();
    }
  }
  replyMessage(message) {

    const pass_ob = {};
    let name = null;

    let source = this.usertype + '-';
    if (message.waitlistId) {
      source = source + 'waitlist';
      pass_ob['uuid'] = 'h_' + message.waitlistId;
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

    this.msgdialogRef = this.dialog.open(AddInboxMessagesComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      autoFocus: true,
      data: pass_ob,
    });

    this.msgdialogRef.afterClosed().subscribe(result => {
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
  formatDateDisplay(dateStr) {
    let retdate = '';
    const pubDate = new Date(dateStr);
    const obtdate = new Date(pubDate.getFullYear() + '-' + this.shared_functions.addZero((pubDate.getMonth() + 1)) + '-' + this.shared_functions.addZero(pubDate.getDate()));
    const obtshowdate = this.shared_functions.addZero(pubDate.getDate()) + '/' + this.shared_functions.addZero((pubDate.getMonth() + 1)) + '/' + pubDate.getFullYear();
    const obtshowtime = this.shared_functions.addZero(pubDate.getHours()) + ':' + this.shared_functions.addZero(pubDate.getMinutes());
    const today = new Date();
    const todaydate = new Date(today.getFullYear() + '-' + this.shared_functions.addZero((today.getMonth() + 1)) + '-' + this.shared_functions.addZero(today.getDate()));

    if (obtdate.getTime() === todaydate.getTime()) {
      retdate = this.shared_functions.convert24HourtoAmPm(obtshowtime);
    } else {
      retdate = obtshowdate + ' ' + this.shared_functions.convert24HourtoAmPm(obtshowtime);
    }
    return retdate;
  }
  showImagesection() {
    (this.showImages) ? this.showImages = false : this.showImages = true;
  }
  getThumbUrl(attachment) {
    if (attachment.s3path.indexOf('.pdf') !== -1) {
      return attachment.thumbPath;
    } else {
      return attachment.s3path;
    }
  }
}
