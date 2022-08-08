import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../services/provider-services.service';
import { ApplyLabelComponent } from '../../check-ins/apply-label/apply-label.component';
import { ConfirmBoxComponent } from '../../../shared/confirm-box/confirm-box.component';
import { VoiceConfirmComponent } from '../../customers/voice-confirm/voice-confirm.component';
import { CommunicationService } from '../../../../business/services/communication-service';
import { GroupStorageService } from '../../../../../../src/app/shared/services/group-storage.service';

@Component({
  selector: 'app-order-actions',
  templateUrl: './order-actions.component.html',
  styleUrls: ['./order-actions.component.css']
})
export class OrderActionsComponent implements OnInit {
  orderList: any[];
  image_list_popup: any[];
  orderItems: any[];
  orderDetails;
  mulipleSelection = false;
  showBill = false;
  showSendDetails = false;
  pos = false;
  customer_label = '';
  loading = false;
  catalog_list: any = [];
  catalogStatuses: any = [];
  catalogfilterStats: any = [];
  activeCatalog: any;
  catalog_Id: any;
  orderStatusClasses = projectConstantsLocal.ORDER_STATUS_CLASS;
  choose_type: string;
  action = '';
  providerLabels: any = [];
  labelMap = {};
  timeType;
  labelsforRemove: any = [];
  ordersByLabel: any = [];
  status: any = projectConstantsLocal.ORDER_STATUS_FILTER;
  showApply = false;
  cancelorderDialog: any;
  meet_data: any;
  id: any;
  providerMeetingUrl: any;
  showQnr = false;
  accountType: any;
  userid: any;
  users: any = [];
  user_arr: any;
  isUserdisable;
  provider_label = '';
  constructor(public dialogRef: MatDialogRef<OrderActionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public router: Router, public provider_services: ProviderServices,
    public shared_functions: SharedFunctions,
    private wordProcessor: WordProcessor,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    private groupService: GroupStorageService,
    private communicationService: CommunicationService
) { }

  ngOnInit() {
    this.loading = true;
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.orderDetails = this.data.selectedOrder;
    console.log(this.orderDetails)
   
    if(this.data.type){
      this.timeType = this.data.type;
    }
    if (this.orderDetails.length > 1) {
      this.mulipleSelection = true;
    }
    if (!this.mulipleSelection && this.orderDetails.releasedQnr && this.orderDetails.releasedQnr.length > 0) {
      this.showQnr = true;
   }
    this.getLabel();
    this.getPos();
    const user = this.groupService.getitemFromGroupStorage('ynw-user');
        this.accountType = user.accountType;
        this.userid = user.id
        if (this.accountType === 'BRANCH') {
          this.getUser();
      }
      this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
  }
  setActions() {
    if (!this.mulipleSelection) {
      this.showSendDetails = true;
      if (this.pos && (this.orderDetails.orderStatus !== 'Cancelled' || (this.orderDetails.orderStatus === 'Cancelled' && this.orderDetails.bill && this.orderDetails.bill.billPaymentStatus !== 'NotPaid'))
      ||  (this.orderDetails.orderStatus === 'Cancelled' && this.orderDetails.advanceAmountPaid > 0 )) {
        this.showBill = true;
      }
      this.getCatalog();
    } else {
      this.loading = false;
    }
  }
  gotoDetails() {
    this.dialogRef.close();
    this.router.navigate(['provider', 'orders', this.orderDetails.uid]);
  }
  orderEdit() {
    this.dialogRef.close();
     this.router.navigate(['provider', 'orders', 'edit', this.orderDetails.uid ]);


  }
  gotoBill() {
    this.provider_services.getWaitlistBill(this.orderDetails.uid)
      .subscribe(
        data => {
          this.router.navigate(['provider', 'bill', this.orderDetails.uid], { queryParams: { source: 'order', timetype: this.timeType } });
          this.dialogRef.close();
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }

  getPos() {
    this.provider_services.getProviderPOSStatus().subscribe(data => {
      this.pos = data['enablepos'];
      this.setActions();
    },
      error => {
        this.setActions();
      });
  }
  gotoCustomerDetails() {
    this.dialogRef.close();
    this.router.navigate(['/provider/customers/' + this.orderDetails.orderFor.id]);
  }
  changeOrderStatus(status) {
    if(status === 'Cancelled'){
      this.cancelorderDialog = this.dialog.open(ConfirmBoxComponent, {
        width: '50%',
        panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
        disableClose: true,
        data: {
          'message': 'Do you really want to cancel the order?',
          'type':'order'
        }
      });
      this.cancelorderDialog.afterClosed().subscribe(result => {
        if (result) {
          this.provider_services.changeOrderStatus(this.orderDetails.uid, status).subscribe(data => {
            this.dialogRef.close();
          },
            error => {
              this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            });
        }
      });
    } else {
    this.provider_services.changeOrderStatus(this.orderDetails.uid, status).subscribe(data => {
      this.dialogRef.close();
    },
      error => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
  }
}
  getCatalog() {
    this.provider_services.getProviderCatalogs()
      .subscribe(data => {
        this.catalog_list = data;
        const catalog = this.catalog_list.filter(cata => cata.id === this.orderDetails.catalog.id);
        if (catalog[0]) {
          this.catalogStatuses = catalog[0].orderStatuses;
            if (this.orderDetails.homeDelivery) {
              for (let i = 0; i < this.status.length; i++) {
                for (let j = 0; j < this.catalogStatuses.length; j++) {
                  if (this.catalogStatuses[j] === this.status[i].value && this.status[i].delivery) {
                    this.catalogfilterStats.push(this.catalogStatuses[j]);
                  }
                }
              }
            } else if (this.orderDetails.storePickup) {
              for (let i = 0; i < this.status.length; i++) {
                for (let j = 0; j < this.catalogStatuses.length; j++) {
                  if (this.catalogStatuses[j] === this.status[i].value && this.status[i].pickup) {
                    this.catalogfilterStats.push(this.catalogStatuses[j]);
                  }
                }
              }
            }


        }
        this.loading = false;
      });
  }
  getOrderActionClass(status) {
    const retdet = this.orderStatusClasses.filter(
      soc => soc.value === status);
    const returndet = retdet[0].class;
    return returndet;
  }

  showLabels() {
    this.action = 'label';
}
showStatus() {
  this.action = 'status';
}
goBack() {
  this.action = '';
}
getUser() {
  if (this.userid) {
      this.provider_services.getUsers()
          .subscribe((data: any) => {
              this.users = data;
              this.user_arr = this.users.filter(user => user.id === this.userid);
              if (this.user_arr[0].status === 'ACTIVE') {
                  this.isUserdisable = true
              } else {
                  this.isUserdisable = false
              }
          }
              , error => {
              });
  }
}

addLabeltoOrder(label, event) {
  this.showApply = false;
  let labelArr = this.providerLabels.filter(lab => lab.label === label);
  if (this.labelMap[label]) {
      delete this.labelMap[label];
  }
  if (this.labelsforRemove.indexOf(label) !== -1) {
      this.labelsforRemove.splice(this.labelsforRemove.indexOf(label), 1);
  }
  if (event.checked) {
      if (labelArr[0] && labelArr[0].selected) {
      } else {
          this.labelMap[label] = true;
      }
  } else {
      if (labelArr[0] && labelArr[0].selected) {
          this.labelsforRemove.push(label);
      }
  }
  if (Object.keys(this.labelMap).length > 0 || this.labelsforRemove.length > 0) {
      this.showApply = true;
  }
}

addLabel() {
  const ids = [];
  if (this.mulipleSelection) {
      for (const order of this.orderDetails) {
          ids.push(order.uid);
      }
  } else {
      ids.push(this.orderDetails.uid);
  }
  const postData = {
    'labels':  this.labelMap,
    'uuid': ids
};
  this.provider_services.addLabeltoMultipleOrder(postData).subscribe(data => {
    this.snackbarService.openSnackBar('Label applied successfully', { 'panelclass': 'snackbarerror' });
    this.dialogRef.close('reload');
  },
      error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
}
applyLabel() {
  if (Object.keys(this.labelMap).length > 0) {
      this.addLabel();
  }
  if (this.labelsforRemove.length > 0) {
      this.deleteLabel();
  }
}

getLabel() {
  this.loading = true;
  this.providerLabels = [];
  this.provider_services.getLabelList().subscribe((data: any) => {
      this.providerLabels = data.filter(label => label.status === 'ENABLED');
      if (!this.mulipleSelection) {
          this.labelselection();
      }else {
        this.multipleLabelselection();
    }
      this.loading = false;
  });
}
labelselection() {
  const values = [];
  if (this.orderDetails.label && Object.keys(this.orderDetails.label).length > 0) {
      Object.keys(this.orderDetails.label).forEach(key => {
          values.push(key);
      });
      for (let i = 0; i < this.providerLabels.length; i++) {
          for (let k = 0; k < values.length; k++) {
              if (this.providerLabels[i].label === values[k]) {
                  this.providerLabels[i].selected = true;
              }
          }
      }
  }
}
multipleLabelselection() {
  let values = [];
  this.ordersByLabel = [];
  for (let i = 0; i < this.orderDetails.length; i++) {
      if (this.orderDetails[i].label) {
          Object.keys(this.orderDetails[i].label).forEach(key => {
              values.push(key);
              if (!this.ordersByLabel[key]) {
                  this.ordersByLabel[key] = [];
              }
              this.ordersByLabel[key].push(this.orderDetails[i].uid);
          });
      }
  }
  for (let i = 0; i < this.providerLabels.length; i++) {
      for (let k = 0; k < values.length; k++) {
          const filteredArr = values.filter(value => value === this.providerLabels[i].label);
          if (filteredArr.length === this.orderDetails.length) {
              this.providerLabels[i].selected = true;
          }
      }
  }
}
deleteLabel() {
  // this.provider_services.deleteLabelfromOrder(label).subscribe(data => {
  //     this.dialogRef.close('reload');
  // },
  //     error => {
  //         this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
  //     });
   // this.provider_services.deleteLabelfromCheckin(checkinId, label).subscribe(data => {
        //     this.dialogRef.close('reload');
        // },
        //     error => {
        //         this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        //     });
        let ids = [];
        // if (this.data.multiSelection) {
        //     ids = this.ordersByLabel[label];
        // } else {
        //     ids.push(this.orderDetails.ynwUuid);
        // }
        if (this.data.multiSelection) {
            for (let label of this.labelsforRemove) {
                ids = ids.concat(this.ordersByLabel[label]);
            }
        } else {
            ids.push(this.orderDetails.uid);
        }
        const postData = {
            'labelNames': this.labelsforRemove,
            'uuid': ids
        };
        this.provider_services.deleteLabelfromOrder(postData).subscribe(data => {
          if (Object.keys(this.labelMap).length === 0) {
            this.snackbarService.openSnackBar('Label removed', { 'panelclass': 'snackbarerror' });
        }
            this.dialogRef.close('reload');
        },
            error => {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            });
}
gotoLabel() {
  this.router.navigate(['provider', 'settings', 'general', 'labels'], { queryParams: { source: 'order' } });
  this.dialogRef.close();
}
addLabelvalue(source, label?) {
  const labeldialogRef = this.dialog.open(ApplyLabelComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'privacyoutermainclass'],
      disableClose: true,
      autoFocus: true,
      data: {
          checkin: this.orderDetails,
          source: source,
          label: label
      }
  });
  labeldialogRef.afterClosed().subscribe(data => {
      if (data) {
          // setTimeout(() => {
          // this.labels();
          this.labelMap = new Object();
          this.labelMap[data.label] = data.value;
          this.addLabel();
          this.getDisplayname(data.label);
          // }, 500);
      }
      this.getLabel();
  });
}
getDisplayname(label) {
  for (let i = 0; i < this.providerLabels.length; i++) {
      if (this.providerLabels[i].label === label) {
          return this.providerLabels[i].displayName;
      }
  }
}
addConsumerInboxMessage() {
  this.dialogRef.close();
  let checkin = [];
  if (this.orderDetails.length > 1) {
      checkin = this.orderDetails;
  } else {
      checkin.push(this.orderDetails);
  }
  this.communicationService.addConsumerInboxMessage(checkin, this ,'order-provider')
      .then(
          () => { },
          () => { }
      );
}
  getEditOrderstatus(){
    let stat = false;
    if(this.timeType != 3 && (this.orderDetails.orderStatus === 'Order Received' || this.orderDetails.orderStatus === 'Order Acknowledged' || this.orderDetails.orderStatus === 'Order Confirmed')){
      stat = true;
        if(this.orderDetails.bill && this.orderDetails.bill.billStatus === 'Settled'){
          stat = false;
        }
    }
    return stat;
    
  }

gotoSecureVideo() {
  this.closeDialog();
  const customerId = this.orderDetails.orderFor.id
    //  const whtasappNum = this.orderDetails.virtualService.WhatsApp;
    const num = this.orderDetails.countryCode + ' ' + this.orderDetails.phoneNumber;

  const navigationExtras: NavigationExtras = {
      queryParams: {
          id : customerId,
         phoneNum : num,
      }
  };
  this.router.navigate(['provider', 'secure-video'], navigationExtras);
}
startVoiceCall() {
  this.closeDialog();
  this.voiceCallConfirmed()
  
  // this.provider_services.voiceCallReady(customerId).subscribe(data => {
  //     this.voiceCallConfirm()
  // },
  //     error => {
  //         this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
  //     });
}
voiceCallConfirmed() {
  const customerId =  this.orderDetails.orderFor.id;
  const num = this.orderDetails.countryCode + ' ' + this.orderDetails.phoneNumber;
  
  // const customerId = customerDetails[0].id;
  const dialogref = this.dialog.open(VoiceConfirmComponent, {
    width: '60%',
    // height: '35%',
    panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
    disableClose: true,
    data: {
      customerId: customerId,
      customer : num,
    }
  });
  dialogref.afterClosed().subscribe(
    result => {
      this.closeDialog();
      // if (result) {
      // }
    }
  );
}
  closeDialog() {
    this.dialogRef.close();
}
printOrder() {
  this.dialogRef.close();
  this.router.navigate(['provider', 'orders', this.orderDetails.uid, 'print'],{queryParams:{bookingType:'order'}});
  // this.qrCodegeneration(this.checkin);
  // const bprof = this.groupService.getitemFromGroupStorage('ynwbp');
  // const bname = bprof.bn;
  // const fname = (this.checkin.waitlistingFor[0].firstName) ? this.checkin.waitlistingFor[0].firstName : '';
  // const lname = (this.checkin.waitlistingFor[0].lastName) ? this.checkin.waitlistingFor[0].lastName : '';
  // setTimeout(() => {
  //     const printContent = document.getElementById('print-section');
  //     const params = [
  //         'height=' + screen.height,
  //         'width=' + screen.width,
  //         'fullscreen=yes'
  //     ].join(',');
  //     const printWindow = window.open('', '', params);
  //     let checkin_html = '';
  //     checkin_html += '<table style="width:100%;"><thead>';
  //     checkin_html += '<tr><td colspan="3" style="border-bottom: 1px solid #eee;text-align:center;line-height:30px;font-size:1.25rem">' + this.dateformat.transformToDIsplayFormat(this.checkin.date) + '<br/>';
  //     if (this.checkin.token) {
  //         checkin_html += 'Token# <span style="font-weight:bold">' + this.checkin.token + '</span>';
  //     }
  //     checkin_html += '</td></tr>';
  //     checkin_html += '<tr><td colspan="3" style="text-align:center">' + bname.charAt(0).toUpperCase() + bname.substring(1) + '</td></tr>';
  //     // checkin_html += '<tr><td colspan="3" style="text-align:center">' + this.checkin.queue.location.place + '</td></tr>';
  //     checkin_html += '<tr><td width="48%" align="right">Location</td><td>:</td><td>' + this.checkin.queue.location.place + '</td></tr>';

  //     checkin_html += '</thead><tbody>';
  //     if (fname !== '' || lname !== '') {
  //         checkin_html += '<tr><td width="48%" align="right">' + this.customer_label.charAt(0).toUpperCase() + this.customer_label.substring(1) + '</td><td>:</td><td>' + fname + ' ' + lname + '</td></tr>';
  //     } else {
  //         checkin_html += '<tr><td width="48%" align="right">' + this.customer_label.charAt(0).toUpperCase() + this.customer_label.substring(1) + ' Id </td><td>:</td><td>' + this.checkin.consumer.jaldeeId + '</td></tr>';
  //     }
  //     if (this.checkin.service && this.checkin.service.deptName) {
  //         checkin_html += '<tr><td width="48%" align="right">Department</td><td>:</td><td>' + this.checkin.service.deptName + '</td></tr>';
  //     }
  //     checkin_html += '<tr><td width="48%" align="right">Service</td><td>:</td><td>' + this.checkin.service.name + '</td></tr>';
  //     if (this.checkin.provider && this.checkin.provider.firstName && this.checkin.provider.lastName) {
  //         checkin_html += '<tr><td width="48%" align="right">' + this.provider_label.charAt(0).toUpperCase() + this.provider_label.substring(1) + '</td><td>:</td><td>' + this.checkin.provider.firstName.charAt(0).toUpperCase() + this.checkin.provider.firstName.substring(1) + ' ' + this.checkin.provider.lastName + '</td></tr>';
  //     }
  //     checkin_html += '<tr><td width="48%" align="right">Queue</td><td>:</td><td>' + this.checkin.queue.name + ' [' + this.checkin.queue.queueStartTime + ' - ' + this.checkin.queue.queueEndTime + ']' + '</td></tr>';
  //     checkin_html += '<tr><td colspan="3" align="center">' + printContent.innerHTML + '</td></tr>';
  //     checkin_html += '<tr><td colspan="3" align="center">Scan to know your status or log on to ' + this.qr_value + '</td></tr>';
  //     checkin_html += '</tbody></table>';
  //     printWindow.document.write('<html><head><title></title>');
  //     printWindow.document.write('</head><body>');
  //     printWindow.document.write(checkin_html);
  //     printWindow.document.write('</body></html>');
  //     printWindow.moveTo(0, 0);
  //     printWindow.print();
  // });
}
showQuestionnaires() {
  this.dialogRef.close();
  this.router.navigate(['provider', 'orders', 'questionnaires'], { queryParams: { source: 'order', uid: this.orderDetails.uid } });
}
changeWaitlistservice() {
  this.dialogRef.close();
  this.router.navigate(['provider', 'orders', this.orderDetails.uid, 'user'], { queryParams: { source: 'order' } });
}
removeProvider() {
  // this.dialogRef.close();
  let msg = '';
  msg = 'Do you want to remove this ' + this.provider_label + '?';
  const dialogrefd = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
          'message': msg,
          'type': 'yes/no'
      }
  });
  dialogrefd.afterClosed().subscribe(result => {
      if (result) {
          const post_data = {
              'uid': this.orderDetails.uid,
              
          };
          this.provider_services.updateUserOrder(post_data)
              .subscribe(
                  data => {
                      this.dialogRef.close('reload');
                  },
                  error => {
                      this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                      this.dialogRef.close('reload');
                  }
              );
      }
  });
}
}
