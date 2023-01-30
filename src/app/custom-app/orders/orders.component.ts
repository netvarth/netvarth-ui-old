import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { AdvancedLayout, ButtonsConfig, ButtonsStrategy, ButtonType, Image, PlainGalleryConfig, PlainGalleryStrategy } from '@ks89/angular-modal-gallery';
import { SharedFunctions } from '../../shared/functions/shared-functions';
import { ConfirmBoxComponent } from '../../shared/components/confirm-box/confirm-box.component';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { SharedServices } from '../../shared/services/shared-services';
import { ConsumerJoinComponent } from '../../ynw_consumer/components/consumer-join/join.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  @Input() selectedLocation;
  @Input() terminologiesjson;
  @Input() templateJson;
  @Input() apptSettings;
  @Input() businessProfile;

  activeCatalog: any;
  orderList: any = [];
  catalogItem: any;
  order_count: number;
  counter = 0;
  itemCount: any;
  orderItems: any = [];
  itemQty: number;
  catalogimage_list_popup: Image[];
  catalogImage = 'assets/images/order/catalogueimg.svg';
  orderstatus: any;
  orderType = '';
  advance_amount: any;
  store_pickup: boolean;
  home_delivery: boolean;
  choose_type = 'store';
  sel_checkindate;
  deliveryCharge = 0;
  nextAvailableTime;
  price: number;
  spId_local_id: any;
  userType='';
  showmoreDesc = false;
  showmoreSpec = false;
  onlyVirtualItems = false;
  customPlainGalleryRowConfig: PlainGalleryConfig = {
    strategy: PlainGalleryStrategy.CUSTOM,
    layout: new AdvancedLayout(-1, true)
  };
  customPlainGallerycatalogRowConfig: PlainGalleryConfig = {
    strategy: PlainGalleryStrategy.CUSTOM,
    layout: new AdvancedLayout(-1, true)
  };
  customButtonsFontAwesomeConfig: ButtonsConfig = {
    visible: true,
    strategy: ButtonsStrategy.CUSTOM,
    buttons: [
      {
        className: 'inside close-image',
        type: ButtonType.CLOSE,
        ariaLabel: 'custom close aria label',
        title: 'Close',
        fontSize: '20px'
      }
    ]
  };

  constructor(
    private lStorageService: LocalStorageService,
    private shared_services: SharedServices,
    private dialog:MatDialog,
    private router: Router,
    private sharedFunctionObj: SharedFunctions,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.translate.use(JSON.parse(localStorage.getItem('translatevariable')));
    this.shared_services.getOrderSettings(this.businessProfile.id).subscribe(
      (settings: any) => {
        this.orderstatus = settings.enableOrder;
        this.getCatalogs(this.selectedLocation.id);
      }
    );
  }

  shoppinglistupload() {
    const chosenDateTime = {
      delivery_type: this.choose_type,
      catlog_id: this.activeCatalog.id,
      nextAvailableTime: this.nextAvailableTime,
      order_date: this.sel_checkindate,
      advance_amount: this.advance_amount,
      account_id: this.businessProfile.id

    };
    this.lStorageService.setitemonLocalStorage('chosenDateTime', chosenDateTime);
    this.userType = this.sharedFunctionObj.isBusinessOwner('returntyp');
    if (this.userType === 'consumer') {
      let blogoUrl;
      if (this.businessProfile.logo) {
        blogoUrl = this.businessProfile.logo.url;
      } else {
        blogoUrl = '';
      }
      const businessObject = {
        'bname': this.businessProfile.businessName,
        'blocation': this.selectedLocation.place,
        'logo': blogoUrl
      };
      this.lStorageService.setitemonLocalStorage('order_sp', businessObject);
      const navigationExtras: NavigationExtras = {
        queryParams: {

          providerId: this.businessProfile.id,
          unique_id: this.businessProfile.uniqueId,
        }

      };
      this.router.navigate(['order', 'shoppingcart', 'checkout'], navigationExtras);
    } else if (this.userType === '') {
      const passParam = { callback: 'order' };
      this.doLogin('consumer', passParam);
    }
  }
  doLogin(origin?, passParam?) {
    // const current_provider = passParam['current_provider'];
    const is_test_account = true;
    const dialogRef = this.dialog.open(ConsumerJoinComponent, {
      width: '40%',
      panelClass: ['loginmainclass', 'popup-class', this.templateJson['theme']],
      disableClose: true,
      data: {
        type: origin,
        is_provider: false,
        test_account: is_test_account,
        theme: this.templateJson['theme'],
        moreparams: { source: 'searchlist_checkin', bypassDefaultredirection: 1 }
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        
      } else if (result === 'showsignup') {
        // this.doSignup(passParam);
      } else {
        //this.loading = false;
      }
    });
  }
  showSpec() {
    if (this.showmoreSpec) {
      this.showmoreSpec = false;
    } else {
      this.showmoreSpec = true;
    }
  }
  onButtonBeforeHook() {
  }
  onButtonAfterHook() { }
  isPhysicalItemsPresent() {
    let physical_item_present = true;
    const virtualItems = this.activeCatalog.catalogItem.filter(catalogItem => catalogItem.item.itemType === 'VIRTUAL')
    if (virtualItems.length > 0 && this.activeCatalog.catalogItem.length === virtualItems.length) {
      physical_item_present = false;
      this.onlyVirtualItems = true;
    }
    return physical_item_present;
  }
checkVirtualOrPhysical() {
    // console.log('checkvirtualorphysical');
    let showCatalogItems = false;
    if (this.activeCatalog.nextAvailableDeliveryDetails || this.activeCatalog.nextAvailablePickUpDetails) {
      showCatalogItems = true;
    }

    if (!this.isPhysicalItemsPresent()) {
      showCatalogItems = true;
    }
    return showCatalogItems
  }
  private getCurrentIndexCustomLayout(image: Image, images: Image[]): number {
    return image ? images.indexOf(image) : -1;
  }
  openCatalogImageModalRow(image: Image) {

    const index: number = this.getCurrentIndexCustomLayout(image, this.catalogimage_list_popup);
    this.customPlainGallerycatalogRowConfig = Object.assign({}, this.customPlainGallerycatalogRowConfig, { layout: new AdvancedLayout(index, true) });
  }
  getCatalogs(locationId) {
    const account_Id = this.businessProfile.id;
    this.shared_services.setaccountId(account_Id);
    this.orderItems = [];
    const orderItems = [];
    if (this.orderstatus) {
      this.shared_services.getConsumerCatalogs(account_Id).subscribe(
        (catalogs: any) => {
          if (catalogs.length > 0) {
            this.activeCatalog = catalogs[0];
            this.orderType = this.activeCatalog.orderType;
            if (this.activeCatalog.catalogImages && this.activeCatalog.catalogImages[0]) {
              this.catalogImage = this.activeCatalog.catalogImages[0].url;
              this.catalogimage_list_popup = [];
              const imgobj = new Image(0,
                { // modal
                  img: this.activeCatalog.catalogImages[0].url,
                  description: ''
                });
              this.catalogimage_list_popup.push(imgobj);
            }
            this.catlogArry();


            this.advance_amount = this.activeCatalog.advanceAmount;
            if (this.activeCatalog.pickUp) {
              if (this.activeCatalog.pickUp.orderPickUp && this.activeCatalog.nextAvailablePickUpDetails) {
                this.store_pickup = true;
                this.choose_type = 'store';
                this.sel_checkindate = this.activeCatalog.nextAvailablePickUpDetails.availableDate;
                this.nextAvailableTime = this.activeCatalog.nextAvailablePickUpDetails.timeSlots[0]['sTime'] + ' - ' + this.activeCatalog.nextAvailablePickUpDetails.timeSlots[0]['eTime'];
              }
            }
            if (this.activeCatalog.homeDelivery) {
              if (this.activeCatalog.homeDelivery.homeDelivery && this.activeCatalog.nextAvailableDeliveryDetails) {
                this.home_delivery = true;

                if (!this.store_pickup) {
                  this.choose_type = 'home';
                  this.deliveryCharge = this.activeCatalog.homeDelivery.deliveryCharge;
                  this.sel_checkindate = this.activeCatalog.nextAvailableDeliveryDetails.availableDate;
                  this.nextAvailableTime = this.activeCatalog.nextAvailableDeliveryDetails.timeSlots[0]['sTime'] + ' - ' + this.activeCatalog.nextAvailableDeliveryDetails.timeSlots[0]['eTime'];
                }
              }
            }
            this.shared_services.setOrderDetails(this.activeCatalog);
            if (this.activeCatalog && this.activeCatalog.catalogItem) {
              for (let itemIndex = 0; itemIndex < this.activeCatalog.catalogItem.length; itemIndex++) {
                const catalogItemId = this.activeCatalog.catalogItem[itemIndex].itemId;
                const minQty = this.activeCatalog.catalogItem[itemIndex].minQuantity;
                const maxQty = this.activeCatalog.catalogItem[itemIndex].maxQuantity;
                const showpric = this.activeCatalog.showPrice;
                if (this.activeCatalog.catalogItem[itemIndex].item.isShowOnLandingpage) {
                  orderItems.push({ 'type': 'item', 'minqty': minQty, 'maxqty': maxQty, 'id': catalogItemId, 'item': this.activeCatalog.catalogItem[itemIndex].item, 'showpric': showpric });
                  this.itemCount++;
                }
              }
            }
            this.orderItems = orderItems;
          }
        }
      );
    }
  }
  catlogArry() {

    if (this.lStorageService.getitemfromLocalStorage('order') !== null) {
      this.orderList = this.lStorageService.getitemfromLocalStorage('order');
    }
    this.getTotalItemAndPrice();
  }

  // OrderItem add to cart
  addToCart(itemObj) {
    //  const item = itemObj.item;
    const spId = this.lStorageService.getitemfromLocalStorage('order_spId');
    if (spId === null) {
      this.orderList = [];
      this.lStorageService.setitemonLocalStorage('order_spId', this.businessProfile.id);
      this.orderList.push(itemObj);
      this.lStorageService.setitemonLocalStorage('order', this.orderList);
      this.getTotalItemAndPrice();
      this.getItemQty(itemObj);
    } else {
      if (this.orderList !== null && this.orderList.length !== 0) {
        if (spId !== this.businessProfile.id) {
          if (this.getConfirmation()) {
            this.lStorageService.removeitemfromLocalStorage('order');
          }
        } else {
          this.orderList.push(itemObj);
          this.lStorageService.setitemonLocalStorage('order', this.orderList);
          this.getTotalItemAndPrice();
          this.getItemQty(itemObj);
        }
      } else {
        this.orderList.push(itemObj);
        this.lStorageService.setitemonLocalStorage('order', this.orderList);
        this.getTotalItemAndPrice();
        this.getItemQty(itemObj);
      }
    }
  }
getConfirmation() {
    let can_remove = false;
    const dialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': '  All added items in your cart for different Provider will be removed ! '
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        can_remove = true;
        this.orderList = [];
        this.lStorageService.removeitemfromLocalStorage('order_sp');
        this.lStorageService.removeitemfromLocalStorage('chosenDateTime');
        this.lStorageService.removeitemfromLocalStorage('order_spId');
        this.lStorageService.removeitemfromLocalStorage('order');
        return true;
      } else {
        can_remove = false;

      }
    });
    return can_remove;
  }
  removeFromCart(itemObj) {
    const item = itemObj.item;

    for (const i in this.orderList) {
      if (this.orderList[i].item.itemId === item.itemId) {
        this.orderList.splice(i, 1);
        if (this.orderList.length > 0 && this.orderList !== null) {
          this.lStorageService.setitemonLocalStorage('order', this.orderList);
        } else {
          this.lStorageService.removeitemfromLocalStorage('order_sp');
          this.lStorageService.removeitemfromLocalStorage('chosenDateTime');
          this.lStorageService.removeitemfromLocalStorage('order_spId');
          this.lStorageService.removeitemfromLocalStorage('order');
        }

        break;
      }
    }
    this.getTotalItemAndPrice();
  }
  getTotalItemAndPrice() {
    this.price = 0;
    this.order_count = 0;
    for (const itemObj of this.orderList) {
      let item_price = itemObj.item.price;
      if (itemObj.item.showPromotionalPrice) {
        item_price = itemObj.item.promotionalPrice;
      }
      this.price = this.price + item_price;
      this.order_count = this.order_count + 1;
    }
  }

  getItemQty(itemObj) {
    let qty = 0;
    if (this.orderList !== null && this.orderList.filter(i => i.item.itemId === itemObj.item.itemId)) {
      qty = this.orderList.filter(i => i.item.itemId === itemObj.item.itemId).length;
    }
    return qty;
  }
  cardClicked(actionObj) {
    if (actionObj['type'] === 'item') {
      if (actionObj['action'] === 'view') {
        this.itemDetails(actionObj['service']);
      } else if (actionObj['action'] === 'add') {
        this.increment(actionObj['service']);
      } else if (actionObj['action'] === 'remove') {
        this.decrement(actionObj['service']);
      }
    }
  }
  itemDetails(item) {
    const businessObject = {
      'bname': this.businessProfile.businessName,
      'blocation': this.selectedLocation.place,
      // 'logo': this.businessjson.logo.url
    };
    this.lStorageService.setitemonLocalStorage('order', this.orderList);
    this.lStorageService.setitemonLocalStorage('order_sp', businessObject);
    const navigationExtras: NavigationExtras = {
      queryParams: {
        item: JSON.stringify(item),
        providerId: this.businessProfile.id,
        showpric: this.activeCatalog.showPrice,
        unique_id: this.businessProfile.uniqueId
      }

    };
    this.router.navigate(['order', 'item-details'], navigationExtras);
  }
  increment(item) {
    this.addToCart(item);
  }

  decrement(item) {
    this.removeFromCart(item);
  }
  showOrderFooter() {
    let showFooter = false;
    this.spId_local_id = this.lStorageService.getitemfromLocalStorage('order_spId');
    if (this.spId_local_id !== null) {
      if (this.orderList !== null && this.orderList.length !== 0) {
        if (this.spId_local_id !== this.businessProfile.id) {
          showFooter = false;
        } else {
          showFooter = true;
        }
      }

    }
    return showFooter;
  }
  checkout() {
    this.userType = this.sharedFunctionObj.isBusinessOwner('returntyp');
    if (this.userType === 'consumer') {
      let blogoUrl;
      if (this.businessProfile.logo) {
        blogoUrl = this.businessProfile.logo.url;
      } else {
        blogoUrl = '';
      }
      const businessObject = {
        'bname': this.businessProfile.businessName,
        'blocation': this.selectedLocation.place,
        'logo': blogoUrl
      };
      this.lStorageService.setitemonLocalStorage('order', this.orderList);
      this.lStorageService.setitemonLocalStorage('order_sp', businessObject);
      // const navigationExtras: NavigationExtras = {
      //   queryParams: {
      //     account_id: this.provider_bussiness_id,
      //     unique_id: this.provider_id,
      //   }
      // };
      let queryParam = {
        account_id: this.businessProfile.id,
        unique_id: this.businessProfile.uniqueId,
      };
      queryParam['customId'] = this.businessProfile.accEncUid;
      const navigationExtras: NavigationExtras = {
        queryParams: queryParam,
      };
      this.router.navigate(['order/shoppingcart'], navigationExtras);
    }
    else if (this.userType === '') {
      const passParam = { callback: 'order' };
      this.doLogin('consumer', passParam);
    }
  }
}
