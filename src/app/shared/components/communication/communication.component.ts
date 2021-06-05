import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { GroupStorageService } from '../../services/group-storage.service';
import { projectConstantsLocal } from '../../constants/project-constants';
import { ProviderSharedFuctions } from '../../../ynw_provider/shared/functions/provider-shared-functions';
import { AddInboxMessagesComponent } from '../add-inbox-messages/add-inbox-messages.component';



@Component({
  selector: 'app-communication',
  templateUrl: './communication.component.html',
  styleUrls: ['./communication.component.css']
})
export class CommunicationComponent implements OnInit {

  addnotedialogRef: any;
  showImages: any = [];
  orderDetails: any;
  loading: boolean;
  user_id: any;
  usertype: any;
  type: any;
  message: any;
  uid: any;
  ownerName = 'Provider';
  selectedMsg = -1;
  newTimeDateFormat = projectConstantsLocal.DATE_MM_DD_YY_HH_MM_A_FORMAT;
  dateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
  constructor(public dialogRef: MatDialogRef<CommunicationComponent>,
    private groupService: GroupStorageService,
    private dialog: MatDialog,
    private provider_shared_functions: ProviderSharedFuctions,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.uid = this.data.id;
    this.message = this.data.message;
    console.log(JSON.stringify(this.message));
    this.type = this.data.type;
    this.orderDetails = this.data.orderDetails;
    console.log(JSON.stringify(this.orderDetails));
    this.message.sort(function (message1, message2) {
      if (message1.timeStamp < message2.timeStamp) {
        return -1;
      } else if (message1.timeStamp > message2.timeStamp) {
        return 1;
      } else {
        return 0;
      }
    });
    console.log(JSON.stringify(this.message));
    const userDet = this.groupService.getitemFromGroupStorage('ynw-user');
    this.user_id = userDet.id;
    this.loading = false;
  }
  sendMessage() {
    if (this.type === 'consumer') {
      this.addWaitlistMessage(this.orderDetails, 'orders');
    } else {
      let order = [];
      if (this.orderDetails.length > 1) {
        order = this.orderDetails;
      } else {
        order.push(this.orderDetails);
      }
      console.log(order);
      this.provider_shared_functions.addConsumerInboxMessage(order, this, 'order-provider')
        .then(
          () => {
            this.dialogRef.close('reloadlist');
          },
          () => { }

        );
      // this.dialogRef.close('reloadlist');
    }
  }
  addWaitlistMessage(waitlist, type?) {
    const pass_ob = {};
    pass_ob['source'] = 'consumer-waitlist';
    pass_ob['user_id'] = waitlist.providerAccount.id;
    pass_ob['name'] = waitlist.providerAccount.businessName;
    pass_ob['typeOfMsg'] = 'single';
    if (type === 'appt') {
      pass_ob['appt'] = type;
      pass_ob['uuid'] = waitlist.uid;
    } else if (type === 'orders') {
      pass_ob['orders'] = type;
      pass_ob['uuid'] = waitlist.uid;
    } else {
      pass_ob['uuid'] = waitlist.ynwUuid;
    }
    this.addNote(pass_ob);
  }
  addNote(pass_ob) {
    this.addnotedialogRef = this.dialog.open(AddInboxMessagesComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'popup-class'],
      disableClose: true,
      autoFocus: true,
      data: pass_ob
    });
    this.addnotedialogRef.afterClosed().subscribe(result => {
      // if (result === 'reloadlist') {
      this.dialogRef.close('reloadlist');
      // }
    });
  }


  splitMessageByColon(message) {
    let newmessage = message;
    if (message.includes(':')) {
      newmessage = message.split(':')[1];

    }
    return newmessage;

  }
  showImagesection(index) {
    (this.showImages[index]) ? this.showImages[index] = false : this.showImages[index] = true;
  }
  getThumbUrl(attachment) {
    if (attachment.s3path.indexOf('.pdf') !== -1) {
      return attachment.thumbPath;
    } else {
      return attachment.s3path;
    }
  }
}
