import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { ApplyLabelComponent } from '../../check-ins/apply-label/apply-label.component';
import { ProviderSharedFuctions } from '../../../../ynw_provider/shared/functions/provider-shared-functions';

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
  labelMap;
  status: any = projectConstantsLocal.ORDER_STATUS_FILTER;
  constructor(public dialogRef: MatDialogRef<OrderActionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public router: Router, public provider_services: ProviderServices,
    public shared_functions: SharedFunctions,
    private providerservice: ProviderServices,
    private groupService: GroupStorageService,
    private wordProcessor: WordProcessor,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    private provider_shared_functions: ProviderSharedFuctions,
    private lStorageService:LocalStorageService) { }

  ngOnInit() {
    this.loading = true;
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.orderDetails = this.data.selectedOrder;
    console.log(this.orderDetails);
    console.log(this.orderDetails.orderStatus);
    if (this.orderDetails.length > 1) {
      this.mulipleSelection = true;
    }
    this.getLabel();
    this.getPos();
  }
  setActions() {
    if (!this.mulipleSelection) {
      this.showSendDetails = true;
      if (this.pos && (this.orderDetails.orderStatus !== 'Cancelled' || (this.orderDetails.orderStatus === 'Cancelled' && this.orderDetails.bill && this.orderDetails.bill.billPaymentStatus !== 'NotPaid'))) {
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
  gotoBill() {
    this.provider_services.getWaitlistBill(this.orderDetails.uid)
      .subscribe(
        data => {
          this.router.navigate(['provider', 'bill', this.orderDetails.uid], { queryParams: { source: 'order' } });
          this.dialogRef.close();
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  orderEdit() {
    this.lStorageService.removeitemfromLocalStorage('order');
    console.log(this.orderDetails);
    const cuser = this.groupService.getitemFromGroupStorage('accountId');
    const location = this.groupService.getitemFromGroupStorage('location');
    const ynwbp = this.groupService.getitemFromGroupStorage('ynwbp');
    const businessObject = {
      'bname': ynwbp.bn,
      'blocation': location,
      'logo': ''
    };
    this.lStorageService.setitemonLocalStorage('order_sp', businessObject);
    this.loading = true;
    this.orderList = [];
    this.image_list_popup = [];
    this.providerservice.getProviderOrderById(this.orderDetails.uid).subscribe(data => {
      this.orderDetails = data;
      if (this.orderDetails && this.orderDetails.orderItem) {
        console.log(this.orderDetails.orderItem);
        for (const item of this.orderDetails.orderItem) {
          const itemqty: number = item.quantity;
          for (let i = 0; i <= itemqty; i++) {
            const itemObj = {
              'itemId': item.id,
              'displayName': item.name,
              'price': item.price,
              'itemImages': item.itemImages

            };
            console.log(itemObj);
            this.orderList.push({'type': 'item', 'item': itemObj});
            console.log(this.orderList);
         }

        }
      }
      console.log(JSON.stringify(this.orderList));
      this.lStorageService.setitemonLocalStorage('order', this.orderList);
      // if (this.orderDetails && this.orderDetails.shoppingList) {
      //   this.imagelist = this.orderDetails.shoppingList;
      //   for (let i = 0; i < this.imagelist.length; i++) {
      //     const imgobj = new Image(
      //       i,
      //       { // modal
      //           img: this.imagelist[i].s3path,
      //           description: ''
      //       });
      //   this.image_list_popup.push(imgobj);
      //   }
      // }
      this.loading = false;
    });
    if (this.orderDetails.storePickup) {
      this.choose_type = 'store';
    }
    if(this.orderDetails.homeDelivery) {
      this.choose_type = 'home';
    }
     const navigationExtras: NavigationExtras = {
      queryParams: {
        account_id: cuser,
        choosetype:  this.choose_type,
        uid : this.orderDetails.uid
      }
    };
    const chosenDateTime = {
      delivery_type: this.choose_type,
      // catlog_id: this.activeCatalog.id,
     nextAvailableTime: this.orderDetails.timeSlot['sTime'] + ' - ' +  this.orderDetails.timeSlot['eTime'],
      order_date: this.orderDetails.orderDate,
    };
    this.lStorageService.setitemonLocalStorage('chosenDateTime', chosenDateTime);
    this.router.navigate(['provider', 'orders', 'edit' ], navigationExtras);
    this.dialogRef.close();

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
    this.provider_services.changeOrderStatus(this.orderDetails.uid, status).subscribe(data => {
      this.dialogRef.close();
    },
      error => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
  }
  getCatalog() {
    this.provider_services.getProviderCatalogs()
      .subscribe(data => {
        this.catalog_list = data;
        const catalog = this.catalog_list.filter(cata => cata.id === this.orderDetails.catalog.id);
        if (catalog[0]) {
          this.catalogStatuses = catalog[0].orderStatuses;
          console.log(this.catalogStatuses);
          console.log(this.status);
            if (this.orderDetails.homeDelivery) {
              for (let i = 0; i < this.status.length; i++) {
                for (let j = 0; j < this.catalogStatuses.length; j++) {
                  if (this.catalogStatuses[j] === this.status[i].value && this.status[i].delivery) {
                    this.catalogfilterStats.push(this.catalogStatuses[j]);
                  }
                }
              }
              console.log(this.catalogfilterStats);
            } else if (this.orderDetails.storePickup) {
              for (let i = 0; i < this.status.length; i++) {
                for (let j = 0; j < this.catalogStatuses.length; j++) {
                  if (this.catalogStatuses[j] === this.status[i].value && this.status[i].pickup) {
                    this.catalogfilterStats.push(this.catalogStatuses[j]);
                  }
                }
              }
              console.log(this.catalogfilterStats);
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
addLabeltoOrder(label, event) {
  this.labelMap = new Object();
  if (event.checked) {
      this.labelMap[label] = true;
      this.addLabel(label);
  } else {
      this.deleteLabel(label, this.orderDetails.uid);
  }
}

addLabel(label) {
  // this.provider_services.addLabeltoCheckin(this.checkin.ynwUuid, this.labelMap).subscribe(data => {
  //     this.dialogRef.close('reload');
  // },
  //     error => {
  //         this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
  //     });
  const ids = [];
  if (this.mulipleSelection) {
      for (const order of this.orderDetails) {
          ids.push(order.uid);
      }
  } else {
      ids.push(this.orderDetails.uid);
  }
  const postData = {
      'labelName': label,
      'labelValue': 'true',
      'uuid': ids
  };
  this.provider_services.addLabeltoMultipleOrder(postData).subscribe(data => {
      this.dialogRef.close('reload');
  },
      error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
}

getLabel() {
  this.loading = true;
  this.providerLabels = [];
  this.provider_services.getLabelList().subscribe((data: any) => {
      this.providerLabels = data.filter(label => label.status === 'ENABLED');
      if (!this.mulipleSelection) {
          this.labelselection();
      }
      this.loading = false;
  });
}
deleteLabel(label, orderId) {
  this.provider_services.deleteLabelfromOrder(orderId, label).subscribe(data => {
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
          this.addLabel(data.label);
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
  console.log(checkin);
  this.provider_shared_functions.addConsumerInboxMessage(checkin, this ,'order-provider')
      .then(
          () => { },
          () => { }
      );
}
}
