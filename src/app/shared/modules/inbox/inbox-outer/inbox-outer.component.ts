import { Component, OnInit } from '@angular/core';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { InboxServices } from '../inbox.service';
import { Messages } from '../../../../shared/constants/project-messages';

@Component({
  selector: 'app-inbox-outer',
  templateUrl: './inbox-outer.component.html'
  /*,
  styleUrls: ['./provider-inbox.component.scss']*/
})
export class InboxOuterComponent implements OnInit {

  messages: any = [];
  breadcrumbs = [
    {
      title: 'Inbox'
    }
  ];
  selectedMsg = -1;
  userDet;
  obtainedMsgs = false;

  constructor(private inbox_services: InboxServices,
    private shared_functions: SharedFunctions) { }

  ngOnInit() {
    this.userDet = this.shared_functions.getitemfromLocalStorage('ynw-user');
    this.getInboxMessages();
  }

  getInboxMessages() {
    const usertype = this.shared_functions.isBusinessOwner('returntyp');
    this.inbox_services.getInbox(usertype)
      .subscribe(
        data => {
          this.messages = data;
          this.sortMessages();
          this.obtainedMsgs = true;
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

}
