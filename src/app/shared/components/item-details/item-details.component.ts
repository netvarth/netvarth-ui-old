import { Component, OnInit } from '@angular/core';
import { Image, ImageEvent, AccessibilityConfig } from '@ks89/angular-modal-gallery';
import { SharedFunctions } from '../../functions/shared-functions';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';
import { ConfirmBoxComponent } from '../confirm-box/confirm-box.component';
import { MatDialog } from '@angular/material/dialog';
import { LocalStorageService } from '../../services/local-storage.service';
import { ConsumerJoinComponent } from '../../../ynw_consumer/components/consumer-join/join.component';
import { SignUpComponent } from '../signup/signup.component';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsSharedComponent implements OnInit {

  businessDetails: any;
  accountId: any;
  provider_bussiness_id: any;
  currentItemObject: any;
  price: number;
  order_count: number;
  accessibilityConfig: AccessibilityConfig = {
    backgroundAriaLabel: 'CUSTOM Modal gallery full screen background',
    backgroundTitle: 'CUSTOM background title',

    plainGalleryContentAriaLabel: 'CUSTOM Plain gallery content',
    plainGalleryContentTitle: 'CUSTOM plain gallery content title',

    modalGalleryContentAriaLabel: 'CUSTOM Modal gallery content',
    modalGalleryContentTitle: 'CUSTOM modal gallery content title',

    loadingSpinnerAriaLabel: 'CUSTOM The current image is loading. Please be patient.',
    loadingSpinnerTitle: 'CUSTOM The current image is loading. Please be patient.',

    mainContainerAriaLabel: 'CUSTOM Current image and navigation',
    mainContainerTitle: 'CUSTOM main container title',
    mainPrevImageAriaLabel: 'CUSTOM Previous image',
    mainPrevImageTitle: 'CUSTOM Previous image',
    mainNextImageAriaLabel: 'CUSTOM Next image',
    mainNextImageTitle: 'CUSTOM Next image',

    dotsContainerAriaLabel: 'CUSTOM Image navigation dots',
    dotsContainerTitle: 'CUSTOM dots container title',
    dotAriaLabel: 'CUSTOM Navigate to image number',

    previewsContainerAriaLabel: 'CUSTOM Image previews',
    previewsContainerTitle: 'CUSTOM previews title',
    previewScrollPrevAriaLabel: 'CUSTOM Scroll previous previews',
    previewScrollPrevTitle: 'CUSTOM Scroll previous previews',
    previewScrollNextAriaLabel: 'CUSTOM Scroll next previews',
    previewScrollNextTitle: 'CUSTOM Scroll next previews',

    carouselContainerAriaLabel: 'Current image and navigation',
    carouselContainerTitle: '',
    carouselPrevImageAriaLabel: 'Previous image',
    carouselPrevImageTitle: 'Previous image',
    carouselNextImageAriaLabel: 'Next image',
    carouselNextImageTitle: 'Next image',
    carouselPreviewsContainerAriaLabel: 'Image previews',
    carouselPreviewsContainerTitle: '',
    carouselPreviewScrollPrevAriaLabel: 'Scroll previous previews',
    carouselPreviewScrollPrevTitle: 'Scroll previous previews',
    carouselPreviewScrollNextAriaLabel: 'Scroll next previews',
    carouselPreviewScrollNextTitle: 'Scroll next previews'
  };

  itemImages: any;
  customOptions: any;
  itemId: any;
  currentItem: any;
  orderList: any = [];
  imageIndex = 1;
  galleryId = 1;
  autoPlay = true;
  showArrows = true;
  showDots = true;
  imagesRect: Image[] = new Array<Image>();
  item: any;
  isPromotionalpriceFixed;
  isPromotionalpricePertage;
  isPrice;
  loading = true;
  showitemprice = true;
  logo: any;
  userType = '';

  constructor(public sharedFunctionobj: SharedFunctions,
    private location: Location,
    public route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private lStorageService: LocalStorageService) {
    this.route.queryParams.subscribe(
      params => {
        this.item = params.item;
        this.provider_bussiness_id = parseInt(params.providerId, 0);

        if (params.showpric === 'false') {
          this.showitemprice = false;
        } else {
          this.showitemprice = true;
        }
        if (params.businessDetails) {
          this.businessDetails = params.businessDetails;
          console.log(this.businessDetails);
        }
        if (params.logo) {
          this.logo = params.logo;
          console.log(this.logo);
        }
      });
  }
  updateCartCount() {
    const orderCount = this.orderList.length;
    return orderCount;
  }
  ngOnInit() {
    this.userType = this.sharedFunctionobj.isBusinessOwner('returntyp');
    const orderList = this.lStorageService.getitemfromLocalStorage('order');
    if (orderList) {
      this.orderList = orderList;
    }
    this.currentItemObject = JSON.parse(this.item);
    this.currentItem = this.currentItemObject.item;
    if (this.currentItem.showPromotionalPrice) {
      if (this.currentItem.promotionalPriceType === 'FIXED') {
        this.isPromotionalpriceFixed = true;
      } else {
        this.isPromotionalpricePertage = true;
      }
    } else {
      this.isPrice = true;
    }
    if (this.currentItem.itemImages) {
      this.itemImages = this.currentItem.itemImages;
      for (let imgIndex = 0; imgIndex < this.itemImages.length; imgIndex++) {
        const imgobj = new Image(this.itemImages[imgIndex].id,
          {
            img: this.itemImages[imgIndex].url,
            description: this.itemImages[imgIndex].title
          },
          {
            img: this.itemImages[imgIndex].url,
            title: this.itemImages[imgIndex].title
          },
        );
        this.imagesRect = [... this.imagesRect, imgobj];
        console.log(this.imagesRect);
      }
    }

    this.loading = false;
  }



  checkout() {
    // this.lStorageService.setitemonLocalStorage('order', this.orderList);
    // const navigationExtras: NavigationExtras = {
    //   queryParams: {
    //     account_id: this.provider_bussiness_id,
    //     'logo': this.logo

    //   }

    // };
    // this.router.navigate(['order/shoppingcart'], navigationExtras);
    this.userType = this.sharedFunctionobj.isBusinessOwner('returntyp');
    if (this.userType === 'consumer') {
      this.lStorageService.setitemonLocalStorage('order', this.orderList);
      const navigationExtras: NavigationExtras = {
        queryParams: {
          account_id: this.provider_bussiness_id,
          'logo': this.logo
        }
      };
      this.router.navigate(['order/shoppingcart'], navigationExtras);
    }
    else if (this.userType === '') {
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
        this.sharedFunctionobj.sendMessage(pdata);
        this.sharedFunctionobj.sendMessage({ ttype: 'main_loading', action: false });
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
        this.sharedFunctionobj.sendMessage(pdata);
        this.sharedFunctionobj.sendMessage({ ttype: 'main_loading', action: false });
        if (passParam['callback'] === 'order') {
          this.checkout();
        }
      }
    });
  }


  getItemQty() {
    const orderList = this.orderList;
    let qty = 0;
    if (orderList !== null && orderList.filter(i => i.item.itemId === this.currentItem.itemId)) {
      qty = orderList.filter(i => i.item.itemId === this.currentItem.itemId).length;
    }
    return qty;
  }
  // getItemQty() {
  //   const qty = this.orderList.filter(i => i.itemId === this.currentItem.itemId).length;
  //   return qty;
  // }
  increment() {
    this.addToCart();
  }
  goBack() {
    this.lStorageService.setitemonLocalStorage('order', this.orderList);
    this.location.back();
  }

  decrement() {
    this.removeFromCart();
  }
  // addToCart() {
  //   const spId = this.lStorageService.getitemfromLocalStorage('order_spId');
  //   if (spId === null) {
  //     this.lStorageService.setitemonLocalStorage('order_spId', this.provider_bussiness_id);
  //   } else {
  //     if (this.orderList !== null && this.orderList.length !== 0) {
  //       if (spId !== this.provider_bussiness_id) {
  //         if (this.getConfirmation()) {
  //           this.lStorageService.removeitemfromLocalStorage('order');
  //         }
  //       }
  //     }
  //   }
  //   this.orderList.push(this.currentItemObject);
  //   console.log(this.orderList);
  //   this.lStorageService.setitemonLocalStorage('order', this.orderList);
  //   this.getItemQty();
  //   this.updateCartCount();

  // }

  // OrderItem add to cart
  addToCart() {
    const spId = this.lStorageService.getitemfromLocalStorage('order_spId');
    if (spId === null) {
      this.orderList = [];
      this.lStorageService.setitemonLocalStorage('order_spId', this.provider_bussiness_id);
      this.orderList.push(this.currentItemObject);
      this.lStorageService.setitemonLocalStorage('order', this.orderList);
      this.lStorageService.setitemonLocalStorage('order_sp', this.businessDetails);
      this.getItemQty();
    } else {
      if (this.orderList !== null && this.orderList.length !== 0) {
        if (spId !== this.provider_bussiness_id) {
          if (this.getConfirmation()) {
            this.lStorageService.removeitemfromLocalStorage('order');
          }
        } else {
          this.orderList.push(this.currentItemObject);
          this.lStorageService.setitemonLocalStorage('order', this.orderList);
          this.getItemQty();
        }
      } else {
        this.orderList.push(this.currentItemObject);
        this.lStorageService.setitemonLocalStorage('order', this.orderList);
        this.getItemQty();
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

  removeFromCart() {
    console.log(this.orderList);
    for (const i in this.orderList) {
      if (this.orderList[i].item.itemId === this.currentItem.itemId) {
        this.orderList.splice(i, 1);
        this.lStorageService.setitemonLocalStorage('order', this.orderList);
        break;
      }
    }

    this.getItemQty();
    this.updateCartCount();
  }


  // addRandomImage() {
  //   const imageToCopy: Image = this.imagesRect[Math.floor(Math.random() * this.imagesRect.length)];
  //   const newImage: Image = new Image(this.imagesRect.length - 1 + 1, imageToCopy.modal, imageToCopy.plain);
  //   this.imagesRect = [...this.imagesRect, newImage];
  // }

  // onChangeAutoPlay() {
  //   this.autoPlay = !this.autoPlay;
  // }

  // onChangeShowArrows() {
  //   this.showArrows = !this.showArrows;
  // }

  // onChangeShowDots() {
  //   this.showDots = !this.showDots;
  // }

  // output evets
  onShow(event: ImageEvent) {
    console.log('show', event);
  }

  onFirstImage(event: ImageEvent) {
    console.log('firstImage', event);
  }

  onLastImage(event: ImageEvent) {
    console.log('lastImage', event);
  }

}
