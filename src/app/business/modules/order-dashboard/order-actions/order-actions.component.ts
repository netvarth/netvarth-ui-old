import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
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
  showBill = false;
  showSendDetails = false;
  pos = false;
  customer_label = '';
  loading = false;
  catalog_list: any = [];
  catalogStatuses: any = [];
  orderStatusClasses = projectConstantsLocal.ORDER_STATUS_CLASS;
  constructor(public dialogRef: MatDialogRef<OrderActionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public router: Router, public provider_services: ProviderServices,
    public shared_functions: SharedFunctions) { }

  ngOnInit() {
    this.loading = true;
    this.customer_label = this.shared_functions.getTerminologyTerm('customer');
    this.orderDetails = this.data.selectedOrder;
    if (this.orderDetails.length > 1) {
      this.mulipleSelection = true;
    }
    this.getPos();
  }
  setActions() {
    if (!this.mulipleSelection) {
      this.showSendDetails = true;
      if (this.pos) {
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
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
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
    const navigationExtras: NavigationExtras = {
      queryParams: { action: 'view' }
    };
    this.router.navigate(['/provider/customers/' + this.orderDetails.orderFor.id], navigationExtras);
  }
  changeOrderStatus(status) {
    this.provider_services.changeOrderStatus(this.orderDetails.uid, status).subscribe(data => {
      this.dialogRef.close();
    },
      error => {
        this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
  }
  getCatalog() {
    this.provider_services.getProviderCatalogs()
      .subscribe(data => {
        this.catalog_list = data;
        const catalog = this.catalog_list.filter(cata => cata.id === this.orderDetails.catalog.id);
        if (catalog[0]) {
          this.catalogStatuses = catalog[0].orderStatuses;
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
}
