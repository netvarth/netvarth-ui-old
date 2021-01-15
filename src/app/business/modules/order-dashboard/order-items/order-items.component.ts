import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { SharedServices } from '../../../../shared/services/shared-services';

@Component({
  selector: 'app-order-items',
  templateUrl: './order-items.component.html',
  styleUrls: ['./order-items.component.css']
})
export class OrderItemsComponent implements OnInit {
  account_id: any;
  catalog_details: any;
  orderItems: any[];
  itemCount: any;
  orderList: any = [];

 
  constructor(public dialogRef: MatDialogRef<OrderItemsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public shared_functions: SharedFunctions,
    private shared_services: SharedServices,
    public sharedFunctionobj: SharedFunctions,
    private groupService: GroupStorageService
    ) { }

  ngOnInit() {
    const cuser = this.groupService.getitemFromGroupStorage('accountId');
    this.account_id = cuser;
    this.orderList = JSON.parse(localStorage.getItem('order'));
    console.log(this.orderList);
    this.fetchCatalog();
  }
  fetchCatalog() {
    this.getCatalogDetails(this.account_id).then(data => {
      this.catalog_details = data;
      console.log(this.catalog_details);
      this.orderItems = [];
      const orderItems = [];
      for (let itemIndex = 0; itemIndex < this.catalog_details.catalogItem.length; itemIndex++) {
        const catalogItemId = this.catalog_details.catalogItem[itemIndex].id;
        const minQty = this.catalog_details.catalogItem[itemIndex].minQuantity;
        const maxQty = this.catalog_details.catalogItem[itemIndex].maxQuantity;
        const showpric = this.catalog_details.showPrice;
        orderItems.push({ 'type': 'item', 'minqty': minQty, 'maxqty': maxQty, 'id': catalogItemId, 'item': this.catalog_details.catalogItem[itemIndex].item ,'showpric':showpric});
        this.itemCount++;
        console.log(orderItems);
      }
    });
  }
  getCatalogDetails(accountId) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.shared_services.getConsumerCatalogs(accountId)
        .subscribe(
          (data: any) => {
            resolve(data[0]);
          },
          () => {
            reject();
          }
        );
    });
  }

}
