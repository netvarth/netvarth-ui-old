import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
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
  labelMap = {};
  timeType = '';
  labelsforRemove: any = [];
  ordersByLabel: any = [];
  status: any = projectConstantsLocal.ORDER_STATUS_FILTER;
  showApply = false;
  constructor(public dialogRef: MatDialogRef<OrderActionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public router: Router, public provider_services: ProviderServices,
    public shared_functions: SharedFunctions,
    private wordProcessor: WordProcessor,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    private provider_shared_functions: ProviderSharedFuctions,
) { }

  ngOnInit() {
    this.loading = true;
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.orderDetails = this.data.selectedOrder;
    if(this.data.type){
      this.timeType = this.data.type;
    }
    console.log(this.timeType);
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
          this.router.navigate(['provider', 'bill', this.orderDetails.uid], { queryParams: { source: 'order' } });
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


addLabeltoOrder(label, event) {
  // this.labelMap = new Object();
  // if (event.checked) {
  //     this.labelMap[label] = true;
  //     this.addLabel();
  // } else {
  //     this.deleteLabel();
  // }
  console.log(event.checked);
  this.showApply = false;
  let labelArr = this.providerLabels.filter(lab => lab.label === label);
  if (this.labelMap[label]) {
      delete this.labelMap[label];
  }
  if (this.labelsforRemove.indexOf(label) !== -1) {
      this.labelsforRemove.splice(this.labelsforRemove.indexOf(label), 1);
  }
  console.log(labelArr);
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
  // this.provider_services.addLabeltoCheckin(this.orderDetails.ynwUuid, this.labelMap).subscribe(data => {
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
    'labels':  this.labelMap,
    'uuid': ids
};
  this.provider_services.addLabeltoMultipleOrder(postData).subscribe(data => {
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
      console.log(this.providerLabels);
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
  console.log(checkin);
  this.provider_shared_functions.addConsumerInboxMessage(checkin, this ,'order-provider')
      .then(
          () => { },
          () => { }
      );
}
}
