
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../app.component';
import { InboxServices } from '../../../shared/modules/inbox/inbox.service';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { AddInboxMessagesComponent } from '../../../shared/components/add-inbox-messages/add-inbox-messages.component';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-provider-inbox-list',
  templateUrl: './inbox-list.component.html'
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
  terminologies = null;
  usertype = null;
  loading = true;
  cronHandle: Subscription;
  refreshTime = projectConstants.INBOX_REFRESH_TIME;
  msgdialogRef;
  fileTooltip = Messages.FILE_TOOLTIP;
  showImages: any = [];
  messages: any = [];
  users: any = [];
  constructor(private inbox_services: InboxServices,
    private dialog: MatDialog, private provider_services: ProviderServices,
    private shared_functions: SharedFunctions) { }

  ngOnInit() {
    this.getUsers();
    this.terminologies = this.shared_functions.getTerminologies();
    this.inbox_services.getBussinessProfile()
      .subscribe(
        (data: any) => {
          this.user_id = data.id;
        },
        () => {
        }
      );
    this.getInboxMessages();
  }

  ngOnDestroy() {
    if (this.cronHandle) {
      this.cronHandle.unsubscribe();
    }
    if (this.msgdialogRef) {
      this.msgdialogRef.close();
    }
  }

  readConsumerMessages(consumerId, messageId, providerId) {
      this.provider_services.readConsumerMessages(consumerId, messageId, providerId).subscribe(data => {
        this.getInboxMessages();
      });
  }
  replyMessage(message) {
    const pass_ob = {};
    let source = 'provider-';
    if (message.waitlistId) {
      source = source + 'waitlist-inbox';
      pass_ob['uuid'] = 'h_' + message.waitlistId;
    } else {
      source = source + 'common';
    }
    pass_ob['source'] = source;
    pass_ob['user_id'] = message.owner.id;
    pass_ob['type'] = 'reply';
    pass_ob['terminologies'] = this.terminologies;
    pass_ob['name'] = message.owner.name;
    pass_ob['typeOfMsg'] = 'single';
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
        this.getInboxMessages();
      }
    });
  }
  showMsg(indx, message) {
    this.selectedMsg = indx;
    if (!message.read && this.isRecievedOrSent(message) === 'receive') {
      const consumerId = message.owner.id;
      const providerId = message.receiver.id;
      this.readConsumerMessages(consumerId, message.messageId, providerId);
    }
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
  showImagesection(index, message) {
    (this.showImages[index]) ? this.showImages[index] = false : this.showImages[index] = true;
  }
  getThumbUrl(attachment) {
    if (attachment.s3path.indexOf('.pdf') !== -1) {
      return attachment.thumbPath;
    } else {
      return attachment.s3path;
    }
  }

  getInboxMessages() {
    const usertype = this.shared_functions.isBusinessOwner('returntyp');
    this.inbox_services.getInbox(usertype)
      .subscribe(
        data => {
          this.messages = data;
          this.sortMessages();
          this.loading = false;
          this.shared_functions.sendMessage({ 'ttype': 'load_unread_count', 'action': 'setzero' });
        },
        () => {

        }
      );
  }
  sortMessages() {
    this.messages.sort(function (message1, message2) {
      if (message1.timeStamp < message2.timeStamp) {
        return 11;
      } else if (message1.timeStamp > message2.timeStamp) {
        return -1;
      } else {
        return 0;
      }
    });
  }
  isRecievedOrSent(msg) {
    if (msg.receiver.id === 0) {
      return 'receive';
    } else if (msg.owner.id === 0) {
      return 'sent';
    } else {
      const receiverArray = this.users.filter(user => user.id === msg.receiver.id);
      const senterArray = this.users.filter(user => user.id === msg.owner.id);
      if (receiverArray.length > 0) {
        return 'receive';
      } else if (senterArray.length > 0) {
        return 'sent';
      }
    }
  }

  getUsers() {
    this.provider_services.getUsers().subscribe(
      (data: any) => {
        this.users = data;
      },
      (error: any) => {
        this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
  }
}
