import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { SharedServices } from '../../../../shared/services/shared-services';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';

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
  loading = true;


  constructor(public dialogRef: MatDialogRef<OrderItemsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public shared_functions: SharedFunctions,
    private shared_services: SharedServices,
    public sharedFunctionobj: SharedFunctions,
    private groupService: GroupStorageService,
    private lStorageService: LocalStorageService,
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
      for (let itemIndex = 0; itemIndex < this.catalog_details.catalogItem.length; itemIndex++) {
        const catalogItemId = this.catalog_details.catalogItem[itemIndex].id;
        const minQty = this.catalog_details.catalogItem[itemIndex].minQuantity;
        const maxQty = this.catalog_details.catalogItem[itemIndex].maxQuantity;
        const showpric = this.catalog_details.showPrice;
        this.orderItems.push({ 'type': 'item', 'minqty': minQty, 'maxqty': maxQty, 'id': catalogItemId, 'item': this.catalog_details.catalogItem[itemIndex].item, 'showpric': showpric });
        this.itemCount++;
        console.log(this.orderItems);
      }
      this.loading = false;
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
  showConsumerNote(item) {
    console.log(item);
    // const notedialogRef = this.dialog.open(ProviderWaitlistCheckInConsumerNoteComponent, {
    //   width: '50%',
    //   panelClass: ['popup-class', 'commonpopupmainclass'],
    //   disableClose: true,
    //   data: {
    //     checkin: item,
    //     type: 'order-details'
    //   }
    // });
    // notedialogRef.afterClosed().subscribe(result => {
    //   if (result === 'reloadlist') {
    //   }
    // });
  }

  cardClicked(actionObj) {
    if (actionObj['type'] === 'item') {
      if (actionObj['action'] === 'add') {
        this.increment(actionObj['service']);
      } else if (actionObj['action'] === 'remove') {
        this.decrement(actionObj['service']);
      }
    }
  }
  increment(item) {
    console.log(item);
    this.addToCart(item);
  }
  decrement(item) {
    console.log(item);
    this.removeFromCart(item);
  }
  addToCart(itemObj) {
    const item = itemObj.item;
    this.orderList.push(itemObj);
    console.log(this.orderList);
    console.log(item);
    console.log(itemObj);
    this.lStorageService.setitemonLocalStorage('order', this.orderList);
    // this.getTotalItemAndPrice();
    // this.getItemQty(item);   
  }
  removeFromCart(itemObj) {
    const item = itemObj.item;

    for (const i in this.orderList) {
      if (this.orderList[i].item.itemId === item.itemId) {
        this.orderList.splice(i, 1);
        if (this.orderList.length > 0 && this.orderList !== null) {
          this.lStorageService.setitemonLocalStorage('order', this.orderList);
        } else {
          this.lStorageService.removeitemfromLocalStorage('order');
        }
        break;
      }
    }
  }

  // getItemQty(itemObj) {
  //   let qty = 0;
  //   if (this.orderList !== null && this.orderList.filter(i => i.item.itemId === itemObj.itemId)) {
  //     qty = this.orderList.filter(i => i.item.itemId === itemObj.itemId).length;
  //   }
  //   console.log(qty);
  //   return qty;
  
  // }
     



}
