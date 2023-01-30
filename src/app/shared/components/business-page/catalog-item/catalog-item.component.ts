import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { S3UrlProcessor } from '../../../../shared/services/s3-url-processor.service';
import { AccountService } from '../../../../shared/services/account.service';
import { OrderService } from '../../../../shared/services/order.service';
import { SubSink } from 'subsink';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { ConfirmBoxComponent } from '../../confirm-box/confirm-box.component';
import { MatDialog } from '@angular/material/dialog';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ButtonsConfig, ButtonsStrategy, AdvancedLayout, PlainGalleryStrategy, PlainGalleryConfig, Image, ButtonType } from '@ks89/angular-modal-gallery';
import { SharedServices } from '../../../../shared/services/shared-services';
import { DomainConfigGenerator } from '../../../../shared/services/domain-config-generator.service';

@Component({
  selector: 'app-catalog-item',
  templateUrl: './catalog-item.component.html',
  styleUrls: ['./catalog-item.component.css']
})
export class CatalogItemComponent implements OnInit {
  catalogimage_list_popup: Image[];
  image_list_popup: Image[];
  catalogImage = '../../../../assets/images/order/catalogueimg.svg';
  accountEncId: any; // Account Enc Id / Custom Business Id
  catalogId: any;
  orderType = '';
  itemId: any;
  private subscriptions = new SubSink();
  businessCustomId: any;
  accountId: any;
  s3UniqueId: any;
  businessProfile: any;
  bLogo: any;
  bNameStart: any;
  bNameEnd: any;
  orderItems: any = [];
  terminologiesjson: any = null;
  selectedLocation;
  bgCover: any;
  profileSettings: any;
  accountProperties: any;
  loading: boolean = false;
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
  cartItems: any = [];
  itemQuantity;
  cartItem;
  onlyVirtualItems = false;
  isPrice: boolean;
  isPromotionalpricePertage;
  isPromotionalpriceFixed;
  userType: any;
  from: any;
  activeCatalog: any;
  minQuantity: any;
  maxQuantity: any;
  orderItem: { type: string; minqty: any; maxqty: any; id: any; item: any; showpric: any; };
  businessjson: any = [];
  locationjson: any = [];
  showmoreSpec: any;
  showmoreDesc: any;
  spId_local_id: any;
  order_count: number;
  price: number;
  orderList: any = [];
  provider_bussiness_id: any;
  advance_amount: any;
  store_pickup: boolean;
  choose_type: string;
  sel_checkindate: any;
  nextAvailableTime: string;
  home_delivery: boolean;
  deliveryCharge: any;
  itemCount: any;
  screenWidth: number;
  small_device_display: boolean;
  homeView: any;
  constructor(private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private accountService: AccountService,
    private router: Router,
    private shared_services: SharedServices,
    private s3Processor: S3UrlProcessor,
    public sharedFunctionobj: SharedFunctions,
    private lStorageService: LocalStorageService,
    private domainConfigService: DomainConfigGenerator,
    private dialog: MatDialog) {
    this.activatedRoute.paramMap.subscribe(
      (params: any) => {
        this.accountEncId = params.get('id');
        this.catalogId = params.get('catalogId');
        this.itemId = params.get('itemId');
      }
    )
    this.activatedRoute.queryParams.subscribe(qparams => {
      if (qparams.src) {
        this.lStorageService.setitemonLocalStorage('source', qparams.src);
        this.lStorageService.setitemonLocalStorage('reqFrom', 'CUSTOM_WEBSITE');
      }
    });
    this.image_list_popup = [];
    this.catalogimage_list_popup = [];
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 767) {
    } else {
      this.small_device_display = false;
    }
    if (this.screenWidth <= 1040) {
      this.small_device_display = true;
    } else {
      this.small_device_display = false;
    }
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
    console.log("Catalog Item Component");
    const _this = this;
    _this.getAccountIdFromEncId(_this.accountEncId).then(
      (s3UniqueId: any) => {
        _this.businessCustomId = _this.accountEncId;
        console.log(_this.businessCustomId);
        _this.s3UniqueId = s3UniqueId;
        _this.getBusinessAccountInfo(s3UniqueId).then(
          () => {
            _this.domainConfigService.getUIAccountConfig(s3UniqueId).subscribe(
              (uiconfig: any) => {
                // _this.viewMode =
                if (uiconfig['mode']) {
                  _this.homeView = uiconfig['mode'];
                  _this.setItemDetails(_this.catalogId, _this.itemId, _this.accountId);
                }
              }, () => {
                _this.setItemDetails(this.catalogId, _this.itemId, _this.accountId);
              })
          }
        )
      }
    )
  }
  catlogArry() {
    if (this.lStorageService.getitemfromLocalStorage('order') !== null) {
      this.orderList = this.lStorageService.getitemfromLocalStorage('order');
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

  setItemDetails(catalogId, itemId, accountId) {
    this.cartItems = [];
    this.orderItems = [];
    const orderItems = [];
    if (this.lStorageService.getitemfromLocalStorage('order_spId') && this.lStorageService.getitemfromLocalStorage('order_spId') == this.accountId) {
      this.cartItems = this.lStorageService.getitemfromLocalStorage('order');
    } else {
      this.lStorageService.removeitemfromLocalStorage('order');
      this.lStorageService.removeitemfromLocalStorage('order_sp');
      this.lStorageService.removeitemfromLocalStorage('order_spId');
    }

    this.subscriptions.sink = this.orderService.getConsumerCatalogs(accountId).subscribe(
      (catalogs: any) => {
        //  console.log("catalogssss :",catalogs)
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
        this.activeCatalog = this.orderService.getCatalogById(catalogs, catalogId);
        let catalogItem = this.orderService.getCatalogItemById(this.activeCatalog, itemId);
        const showpric = this.activeCatalog.showPrice;
        if (catalogItem && catalogItem.item) {
          this.cartItem = catalogItem.item;
        }
        if (catalogItem && catalogItem.minQuantity) {
          this.minQuantity = catalogItem.minQuantity;
        }
        if (catalogItem && catalogItem.maxQuantity) {
          this.maxQuantity = catalogItem.maxQuantity;
        }
        // this.minQuantity = catalogItem.minQuantity;
        // this.maxQuantity = catalogItem.maxQuantity;
        if (catalogItem && catalogItem.item) {
          this.orderItem = { 'type': 'item', 'minqty': catalogItem.minQuantity, 'maxqty': catalogItem.maxQuantity, 'id': catalogItem.id, 'item': catalogItem.item, 'showpric': showpric };
        }
        const businessObject = {
          'bname': this.businessProfile.businessName,
          'blocation': this.businessProfile.baseLocation.place,
        };
        this.lStorageService.setitemonLocalStorage('order_sp', businessObject);
        this.itemQuantity = this.orderService.getItemQty(this.cartItems, itemId);
        if (this.cartItem && this.cartItem.showPromotionalPrice) {
          if (this.cartItem.promotionalPriceType === 'FIXED') {
            this.isPromotionalpriceFixed = true;
          } else {
            this.isPromotionalpricePertage = true;
          }
        } else {
          this.isPrice = true;
        }

        if (this.activeCatalog.catalogType == 'submission') {
          this.loading = true;
          if (this.cartItems.length == 0) {
            this.addToCart();
          }
          this.checkout();
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
    this.provider_bussiness_id = this.businessjson.id;
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
  itemDetails(item) {
    const businessObject = {
      'bname': this.businessjson.businessName,
      'blocation': this.businessProfile.baseLocation.place,
      'logo': this.businessProfile.logo.url
    };
    this.lStorageService.setitemonLocalStorage('order', this.orderList);
    this.lStorageService.setitemonLocalStorage('order_sp', businessObject);
    this.router.navigate([this.accountEncId, 'catalog', this.catalogId, 'item', item.id]);
  }
  incrementItem(item) {
    this.addToCartItems(item);
  }
  decrementItem(item) {
    this.removeFromCartItem(item);
  }
  getItemQty(itemObj) {
    let qty = 0;
    if (this.orderList !== null && this.orderList.filter(i => i.item.itemId === itemObj.item.itemId)) {
      qty = this.orderList.filter(i => i.item.itemId === itemObj.item.itemId).length;
    }
    return qty;
  }
  removeFromCartItem(itemObj) {
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
  addToCartItems(itemObj) {
    //  const item = itemObj.item;
    const spId = this.lStorageService.getitemfromLocalStorage('order_spId');
    if (spId === null) {
      this.orderList = [];
      this.lStorageService.setitemonLocalStorage('order_spId', this.provider_bussiness_id);
      this.orderList.push(itemObj);
      this.lStorageService.setitemonLocalStorage('order', this.orderList);
      this.getTotalItemAndPrice();
      this.getItemQty(itemObj);
    } else {
      if (this.orderList !== null && this.orderList.length !== 0) {
        if (spId !== this.provider_bussiness_id) {
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
      this.lStorageService.setitemonLocalStorage('order_spId', this.accountId);
      this.cartItems.push(this.orderItem);
      this.lStorageService.setitemonLocalStorage('order', this.cartItems);
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
    if (this.cartItems.length > 0) {
      this.cartItems.splice(0, 1);
      this.lStorageService.setitemonLocalStorage('order', this.cartItems);
    }
    this.itemQuantity = this.orderService.getItemQty(this.cartItems, this.itemId);
  }
  checkoutItems() {
    this.userType = '';
    if (this.lStorageService.getitemfromLocalStorage('isBusinessOwner')) {
      this.userType = (this.lStorageService.getitemfromLocalStorage('isBusinessOwner') === 'true') ? 'provider' : 'consumer';
    }
    const businessObject = {
      'bname': this.businessjson.businessName,
      'blocation': this.businessProfile.baseLocation.place,
      'logo': this.businessProfile.logo.url
    };
    this.lStorageService.setitemonLocalStorage('order', this.orderList);
    this.lStorageService.setitemonLocalStorage('order_sp', businessObject);
    let cartUrl = 'order/shoppingcart?account_id=' + this.accountId + '&customId=' + this.accountEncId + '&unique_id=' + this.s3UniqueId;
    if (this.userType === 'consumer') {
      this.router.navigateByUrl(cartUrl);
    }
    else if (this.userType === '') {
      this.lStorageService.setitemonLocalStorage('target', cartUrl);
      this.router.navigate([this.accountEncId, 'login']);
    }
  }

  checkout() {
    this.userType = '';
    if (this.lStorageService.getitemfromLocalStorage('isBusinessOwner')) {
      this.userType = (this.lStorageService.getitemfromLocalStorage('isBusinessOwner') === 'true') ? 'provider' : 'consumer';
    }

    if (!this.itemId) {
      const businessObject = {
        'bname': this.businessjson.businessName,
        'blocation': this.businessProfile.baseLocation.place,
        'logo': this.businessProfile.logo.url
      };

      this.lStorageService.setitemonLocalStorage('order', this.orderList);
      this.lStorageService.setitemonLocalStorage('order_sp', businessObject);
    }
    else {
      this.lStorageService.setitemonLocalStorage('order', this.cartItems);
    }
    let cartUrl = 'order/shoppingcart?account_id=' + this.accountId + '&customId=' + this.businessCustomId + '&unique_id='
      + this.s3UniqueId + '&logo=' + this.bLogo + '&isFrom=' + (this.from ? this.from : '');
    console.log("cartUrl :", cartUrl);
    if (this.activeCatalog.catalogType == 'submission') {
      cartUrl += '&source=paper';
    }
    console.log("cartUrl :", cartUrl);
    if (this.userType === 'consumer') {
      // cartUrl = 'order/shoppingcart?account_id=' + this.accountId + '&customId=' + this.businessCustomId + '&unique_id='
      //   + this.s3UniqueId + '&source=paper' + '&logo=' + this.bLogo + '&isFrom=' + (this.from ? this.from : '');
      this.router.navigateByUrl(cartUrl);
    } else {
      this.lStorageService.setitemonLocalStorage('target', cartUrl);
      this.router.navigate([this.accountEncId, 'login']);
    }
  }
  showDesc() {
    if (this.showmoreDesc) {
      this.showmoreDesc = false;
    } else {
      this.showmoreDesc = true;
    }
  }
  showSpec() {
    if (this.showmoreSpec) {
      this.showmoreSpec = false;
    } else {
      this.showmoreSpec = true;
    }
  }
  openImageModalRow(image: Image) {
    const index: number = this.getCurrentIndexCustomLayout(image, this.image_list_popup);
    this.customPlainGalleryRowConfig = Object.assign({}, this.customPlainGalleryRowConfig, { layout: new AdvancedLayout(index, true) });
  }
  openCatalogImageModalRow(image: Image) {

    const index: number = this.getCurrentIndexCustomLayout(image, this.catalogimage_list_popup);
    this.customPlainGallerycatalogRowConfig = Object.assign({}, this.customPlainGallerycatalogRowConfig, { layout: new AdvancedLayout(index, true) });
  }
  private getCurrentIndexCustomLayout(image: Image, images: Image[]): number {
    return image ? images.indexOf(image) : -1;
  }
  shoppinglistupload() {
    const chosenDateTime = {
      delivery_type: this.choose_type,
      catlog_id: this.activeCatalog.id,
      nextAvailableTime: this.nextAvailableTime,
      order_date: this.sel_checkindate,
      advance_amount: this.advance_amount,
      account_id: this.provider_bussiness_id
    };
    console.log("shoppinglistupload :", chosenDateTime)
    this.lStorageService.setitemonLocalStorage('chosenDateTime', chosenDateTime);
    this.userType = this.sharedFunctionobj.isBusinessOwner('returntyp');
    const businessObject = {
      'bname': this.businessjson.businessName,
      'logo': this.businessProfile.logo.url
    };
    this.lStorageService.setitemonLocalStorage('order_sp', businessObject);
    let cartUrl = 'order/shoppingcart/checkout?providerId=' + this.provider_bussiness_id + '&customId=' + this.accountEncId + '&unique_id=' + this.s3UniqueId;
    if (this.userType === 'consumer') {
      this.router.navigateByUrl(cartUrl);
    } else if (this.userType === '') {
      this.lStorageService.setitemonLocalStorage('target', cartUrl);
      this.router.navigate([this.accountEncId, 'login']);
    }
  }
  handlesearchClick() {
  }
  onButtonBeforeHook() {
  }
  onButtonAfterHook() { }
  showOrderFooter() {
    let showFooter = false;
    this.spId_local_id = this.lStorageService.getitemfromLocalStorage('order_spId');
    if (this.spId_local_id !== null) {
      if (this.orderList !== null && this.orderList.length !== 0) {
        if (this.spId_local_id !== this.provider_bussiness_id) {
          showFooter = false;
        } else {
          showFooter = true;
        }
      }
    }
    return showFooter;
  }
  cardClicked(actionObj) {
    console.log('entering into business page', actionObj);
    if (actionObj['type'] === 'item') {
      if (actionObj['action'] === 'view') {
        this.itemDetails(actionObj['service']);
      } else if (actionObj['action'] === 'add') {
        this.incrementItem(actionObj['service']);
      } else if (actionObj['action'] === 'remove') {
        this.decrementItem(actionObj['service']);
      }
    }
  }
}
