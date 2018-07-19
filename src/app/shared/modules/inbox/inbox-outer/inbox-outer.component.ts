import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';



import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { InboxServices } from '../inbox.service';

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
      title: 'Dashboard',
      url: '/' + this.shared_functions.isBusinessOwner('returntyp')
    },
    {
      title: 'Inbox'
    }
  ];
  selectedMsg = -1;
  userDet;
  obtainedMsgs = false;

  constructor( private inbox_services: InboxServices,
    private router: Router, private dialog: MatDialog,
    private shared_functions: SharedFunctions) {}

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
          this.shared_functions.sendMessage({'ttype': 'load_unread_count', 'action': 'setzero'});
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

}
