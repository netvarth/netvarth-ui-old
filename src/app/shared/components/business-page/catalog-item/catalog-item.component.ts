import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { S3UrlProcessor } from '../../../../shared/services/s3-url-processor.service';
import { AccountService } from '../../../../shared/services/account.service';
import { OrderService } from '../../../../shared/services/order.service';
import { SubSink } from 'subsink';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { ConfirmBoxComponent } from '../../confirm-box/confirm-box.component';
import { MatDialog } from '@angular/material/dialog';
import { ConsumerJoinComponent } from '../../../../ynw_consumer/components/consumer-join/join.component';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { SignUpComponent } from '../../signup/signup.component';

@Component({
  selector: 'app-catalog-item',
  templateUrl: './catalog-item.component.html',
  styleUrls: ['./catalog-item.component.css']
})
export class CatalogItemComponent implements OnInit {

  accountEncId: any; // Account Enc Id / Custom Business Id
  catalogId: any;
  itemId: any;
  private subscriptions = new SubSink();
  businessCustomId: any;
  accountId: any;
  s3UniqueId: any;
  businessProfile: any;
  bLogo: any;
  bNameStart: any;
  bNameEnd: any;
  bgCover: any;
  profileSettings: any;
  accountProperties: any;
  loading: boolean = false;

  cartItems: any = [];
  itemQuantity;
  cartItem;
  // showitemprice: boolean = true;
  isPrice: boolean;
  isPromotionalpricePertage;
  isPromotionalpriceFixed;
  userType: any;
  from: any;
  activeCatalog: any;
  minQuantity: any;
  maxQuantity: any;
  orderItem: { type: string; minqty: any; maxqty: any; id: any; item: any; showpric: any; };

  constructor(private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private accountService: AccountService,
    private router: Router,
    private s3Processor: S3UrlProcessor,
    public sharedFunctions: SharedFunctions,
    private lStorageService: LocalStorageService,
    private dialog: MatDialog) {
    this.activatedRoute.paramMap.subscribe(
      (params: any) => {
        this.accountEncId = params.get('id');
        this.catalogId = params.get('catalogId');
        this.itemId = params.get('itemId');
      }
    )
  }

  /**
  * 
  * @param encId encId/customId which represents the Account
  * @returns the unique provider id which will gives access to the s3
  */
  getAccountIdFromEncId(encId) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.accountService.getBusinessUniqueId(encId).subscribe(
        (id) => {
          resolve(id);
        },
        error => {
          if (error.status === 404) {
            // _this.router.navigate(['/not-found']);
          }
          reject();
        }
      );
    });
  }

  ngOnInit() {
    const _this = this;


    this.getAccountIdFromEncId(this.accountEncId).then(
      (s3UniqueId: any) => {
        this.s3UniqueId = s3UniqueId;
        this.getBusinessAccountInfo(s3UniqueId).then(
          () => {

            _this.setItemDetails(this.catalogId, this.itemId, this.accountId);

          }
        )
      }
    )
  }

  setItemDetails(catalogId, itemId, accountId) {
    this.cartItems = [];
    if (this.lStorageService.getitemfromLocalStorage('order_spId') && this.lStorageService.getitemfromLocalStorage('order_spId') == this.accountId) {
      this.cartItems = this.lStorageService.getitemfromLocalStorage('order');
    } else {
      this.lStorageService.removeitemfromLocalStorage('order');
      this.lStorageService.removeitemfromLocalStorage('order_sp');
      this.lStorageService.removeitemfromLocalStorage('order_spId');
    }

    this.subscriptions.sink = this.orderService.getConsumerCatalogs(accountId).subscribe(
      (catalogs: any) => {

        this.activeCatalog = this.orderService.getCatalogById(catalogs, catalogId);
        console.log(this.activeCatalog);
        let catalogItem = this.orderService.getCatalogItemById(this.activeCatalog, itemId);
        console.log("Catalog Item:", catalogItem);
        const showpric = this.activeCatalog.showPrice;
        this.cartItem = catalogItem.item;
        this.minQuantity = catalogItem.minQuantity;
        this.maxQuantity = catalogItem.maxQuantity;

        this.orderItem = { 'type': 'item', 'minqty': catalogItem.minQuantity, 'maxqty': catalogItem.maxQuantity, 'id': catalogItem.id, 'item': catalogItem.item, 'showpric': showpric };
        // this.cartItems.push(this.orderItem);

        const businessObject = {
          'bname': this.businessProfile.businessName,
          'blocation': this.businessProfile.baseLocation.place,
          // 'logo': this.businessjson.logo.url
        };

        this.lStorageService.setitemonLocalStorage('order_sp', businessObject);


        // this.itemCount++;
        // this.shared_services.setaccountId(account_Id);
        // this.shared_services.setOrderDetails(this.activeCatalog);

        // this.cartItem = item;
        this.itemQuantity = this.orderService.getItemQty(this.cartItems, itemId);

        if (this.cartItem.showPromotionalPrice) {
          if (this.cartItem.promotionalPriceType === 'FIXED') {
            this.isPromotionalpriceFixed = true;
          } else {
            this.isPromotionalpricePertage = true;
          }
        } else {
          this.isPrice = true;
        }
      }
    )
  }

  /**
   * 
   * @param uniqueId 
   * @returns 
   */
  getBusinessAccountInfo(uniqueId) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      let accountS3List = 'businessProfile';
      _this.subscriptions.sink = _this.s3Processor.getJsonsbyTypes(uniqueId,
        null, accountS3List).subscribe(
          (accountS3s: any) => {

            _this.setBusinesssProfile(accountS3s.businessProfile);
            resolve(true);
          });
    })
  }

  setBusinesssProfile(businessProfile) {
    this.businessProfile = businessProfile;
    this.accountId = businessProfile.id;
    if (businessProfile.customId) {
      this.businessCustomId = businessProfile.customId;
    }
    let provideraccEncUid = businessProfile.accEncUid;
    if (this.businessCustomId) {
      this.lStorageService.setitemonLocalStorage('customId', this.businessCustomId);
    } else {
      this.lStorageService.setitemonLocalStorage('customId', provideraccEncUid);
    }
    this.lStorageService.setitemonLocalStorage('accountId', businessProfile.id);
    if (businessProfile.cover) {
      this.bgCover = businessProfile.cover.url;
    }
    if (businessProfile.logo !== null && businessProfile.logo !== undefined) {
      if (businessProfile.logo.url !== undefined && businessProfile.logo.url !== '') {
        this.bLogo = businessProfile.logo.url;
      }
    } else {
      this.bLogo = '../../../assets/images/img-null.svg';
    }
    const holdbName = businessProfile.businessDesc || '';
    const maxCnt = 120;
    if (holdbName.length > maxCnt) {
      this.bNameStart = holdbName.substr(0, maxCnt);
      this.bNameEnd = holdbName.substr(maxCnt, holdbName.length);
    } else {
      this.bNameStart = holdbName;
    }
  }

  increment() {
    this.addToCart();
  }
  decrement() {
    this.removeFromCart();
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
        this.cartItems = [];
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
  // OrderItem add to cart
  addToCart() {
    const spId = this.lStorageService.getitemfromLocalStorage('order_spId');
    if (spId === null) {
      // this.cartItems = [];
      this.lStorageService.setitemonLocalStorage('order_spId', this.accountId);
      this.cartItems.push(this.orderItem);
      this.lStorageService.setitemonLocalStorage('order', this.cartItems);
      console.log("Cart Item:", this.cartItem);
      //this.lStorageService.setitemonLocalStorage('order_sp', this.businessDetails);
      this.itemQuantity = this.orderService.getItemQty(this.cartItems, this.itemId);

    } else {
      if (this.cartItems !== null && this.cartItems.length !== 0) {
        if (spId !== this.accountId) {
          if (this.getConfirmation()) {
            this.lStorageService.removeitemfromLocalStorage('order');
          }
        } else {
          this.cartItems.push(this.orderItem);
          this.lStorageService.setitemonLocalStorage('order', this.cartItems);
          this.itemQuantity = this.orderService.getItemQty(this.cartItems, this.itemId);
        }
      } else {
        this.cartItems.push(this.orderItem);
        this.lStorageService.setitemonLocalStorage('order', this.cartItems);

        this.itemQuantity = this.orderService.getItemQty(this.cartItems, this.itemId);
      }
    }
  }
  removeFromCart() {
    console.log(this.cartItems);
    // for (const i in this.cartItems) {
    // if (this.cartItems[i].id === this.) {
    if (this.cartItems.length > 0) {
      this.cartItems.splice(0, 1);
      this.lStorageService.setitemonLocalStorage('order', this.cartItems);
    }
    // break;
    // }
    // }
    this.itemQuantity = this.orderService.getItemQty(this.cartItems, this.itemId);
    // this.updateCartCount();
  }


  checkout() {
    this.userType = '';
    if (this.lStorageService.getitemfromLocalStorage('isBusinessOwner')) {
      this.userType = (this.lStorageService.getitemfromLocalStorage('isBusinessOwner') === 'true') ? 'provider' : 'consumer';
    }

    if (this.userType === 'consumer') {
      this.lStorageService.setitemonLocalStorage('order', this.cartItems);
      let queryParams = {
        account_id: this.accountId,
        'logo': this.bLogo,
        unique_id: this.s3UniqueId,
        isFrom: this.from ? this.from : ''
      }
      if (this.businessCustomId) {
        queryParams['customId'] = this.businessCustomId;
      }
      const navigationExtras: NavigationExtras = {
        queryParams: queryParams
      };
      this.router.navigate(['order/shoppingcart'], navigationExtras);
    } else if (this.userType === '') {
      const passParam = { callback: 'order' };
      this.doLogin('consumer', passParam);
    }
  }
  doLogin(origin?, passParam?) {
    const is_test_account = true;
    const dialogRef = this.dialog.open(ConsumerJoinComponent, {
      width: '40%',
      panelClass: ['loginmainclass', 'popup-class'],
      disableClose: true,
      data: {
        type: origin,
        is_provider: false,
        test_account: is_test_account,
        moreparams: { source: 'searchlist_checkin', bypassDefaultredirection: 1 }
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        const pdata = { 'ttype': 'updateuserdetails' };
        this.sharedFunctions.sendMessage(pdata);
        this.sharedFunctions.sendMessage({ ttype: 'main_loading', action: false });
        if (passParam['callback'] === 'order') {
          this.checkout();
        }
        else if (result === 'showsignup') {
          this.doSignup(passParam);
        }
      }
    });
  }
  doSignup(passParam?) {
    const dialogRef = this.dialog.open(SignUpComponent, {
      width: '50%',
      panelClass: ['signupmainclass', 'popup-class'],
      disableClose: true,
      data: {
        is_provider: 'false',
        moreParams: { source: 'searchlist_checkin', bypassDefaultredirection: 1 }
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        const pdata = { 'ttype': 'updateuserdetails' };
        this.sharedFunctions.sendMessage(pdata);
        this.sharedFunctions.sendMessage({ ttype: 'main_loading', action: false });
        if (passParam['callback'] === 'order') {
          this.checkout();
        }
      }
    });
  }
}
