import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-order-actions',
  templateUrl: './order-actions.component.html',
  styleUrls: ['./order-actions.component.css']
})
export class OrderActionsComponent implements OnInit {
  orderDetails;
  mulipleSelection = false;
  showCancel = false;
  showBill = false;
  showDelivered = false;
  showOntheWay = false;
  showPreparing = false;
  showAccept = false;
  showSendDetails = false;
  pos = false;
  customer_label = '';
  loading = false;
  constructor(public dialogRef: MatDialogRef<OrderActionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public router: Router, public provider_services: ProviderServices,
    public shared_functions: SharedFunctions) { }

  ngOnInit() {
    console.log(this.data);
    this.loading = true;
    this.customer_label = this.shared_functions.getTerminologyTerm('customer');
    this.orderDetails = this.data.selectedOrder;
    if (this.orderDetails.length > 1) {
      this.mulipleSelection = true;
    }
    this.getPos();
  }
  setActions() {
    console.log(this.mulipleSelection);
    this.loading = false;
    if (!this.mulipleSelection) {
      this.showCancel = true;
      this.showSendDetails = true;
      this.showDelivered = true;
      this.showOntheWay = true;
      this.showPreparing = true;
      this.showAccept = true;
      this.showSendDetails = true;
      if (this.pos) {
        this.showBill = true;
      }
    }
  }
  gotoDetails() {
    this.dialogRef.close();
    this.router.navigate(['provider', 'orders', this.orderDetails.uid]);
  }
  gotoBill() {
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
    const navigationExtras: NavigationExtras = {
      queryParams: { action: 'view' }
    };
    this.router.navigate(['/provider/customers/' + this.orderDetails.orderFor.id], navigationExtras);
  }
  changeOrderStatus(status) {
    this.dialogRef.close();
    this.provider_services.changeOrderStatus(this.orderDetails.uid, status).subscribe(data => {
    },
      error => {
        this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
  }
}
