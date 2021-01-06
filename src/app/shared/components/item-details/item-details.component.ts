import { Component, OnInit } from '@angular/core';
import { Image, ImageEvent, AccessibilityConfig } from '@ks89/angular-modal-gallery';
import { SharedFunctions } from '../../functions/shared-functions';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ConfirmBoxComponent } from '../confirm-box/confirm-box.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsSharedComponent implements OnInit {

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
  showitemprice;
  // imagesRect: Image[] = [
  //   new Image(
  //     0,
  //     {
  //       img: 'https://raw.githubusercontent.com/Ks89/angular-modal-gallery/master/examples/systemjs/assets/images/gallery/milan-pegasus-gallery-statue.jpg',
  //       description: 'Description 1'
  //     },
  //     { img: 'https://raw.githubusercontent.com/Ks89/angular-modal-gallery/master/examples/systemjs/assets/images/gallery/thumbs/t-milan-pegasus-gallery-statue.jpg',
  //     title: 'First image title',
  //     alt: 'First image alt',
  //     ariaLabel: 'First image aria-label' }
  //   ),
  //   new Image(1, { img: 'https://raw.githubusercontent.com/Ks89/angular-modal-gallery/master/examples/systemjs/assets/images/gallery/pexels-photo-47223.jpeg' }, { img: 'https://raw.githubusercontent.com/Ks89/angular-modal-gallery/master/examples/systemjs/assets/images/gallery/thumbs/t-pexels-photo-47223.jpg' }),
  //   new Image(
  //     2,
  //     {
  //       img: 'https://raw.githubusercontent.com/Ks89/angular-modal-gallery/master/examples/systemjs/assets/images/gallery/pexels-photo-52062.jpeg',
  //       description: 'Description 3',
  //       title: 'Third image title',
  //       alt: 'Third image alt',
  //       ariaLabel: 'Third image aria-label'
  //     },
  //     {
  //       img: 'https://raw.githubusercontent.com/Ks89/angular-modal-gallery/master/examples/systemjs/assets/images/gallery/thumbs/t-pexels-photo-52062.jpg',
  //       description: 'Description 3'
  //     }
  //   ),
  //   new Image(
  //     3,
  //     {
  //       img: 'https://raw.githubusercontent.com/Ks89/angular-modal-gallery/master/examples/systemjs/assets/images/gallery/pexels-photo-66943.jpeg',
  //       description: 'Description 4',
  //       title: 'Fourth image title (modal obj)',
  //       alt: 'Fourth image alt (modal obj)',
  //       ariaLabel: 'Fourth image aria-label (modal obj)'
  //     },
  //     { img: 'https://raw.githubusercontent.com/Ks89/angular-modal-gallery/master/examples/systemjs/assets/images/gallery/thumbs/t-pexels-photo-66943.jpg',
  //     title: 'Fourth image title (plain obj)',
  //     alt: 'Fourth image alt (plain obj)',
  //     ariaLabel: 'Fourth image aria-label (plain obj)' }
  //   ),
  //   new Image(4, { img: 'https://raw.githubusercontent.com/Ks89/angular-modal-gallery/master/examples/systemjs/assets/images/gallery/pexels-photo-93750.jpeg' }, { img: 'https://raw.githubusercontent.com/Ks89/angular-modal-gallery/master/examples/systemjs/assets/images/gallery/thumbs/t-pexels-photo-93750.jpg' }),
  //   new Image(
  //     5,
  //     {
  //       img: 'https://raw.githubusercontent.com/Ks89/angular-modal-gallery/master/examples/systemjs/assets/images/gallery/pexels-photo-94420.jpeg',
  //       description: 'Description 6'
  //     },
  //     { img: 'https://raw.githubusercontent.com/Ks89/angular-modal-gallery/master/examples/systemjs/assets/images/gallery/thumbs/t-pexels-photo-94420.jpg' }
  //   ),
  //   new Image(6, { img: 'https://raw.githubusercontent.com/Ks89/angular-modal-gallery/master/examples/systemjs/assets/images/gallery/pexels-photo-96947.jpeg' }, { img: 'https://raw.githubusercontent.com/Ks89/angular-modal-gallery/master/examples/systemjs/assets/images/gallery/thumbs/t-pexels-photo-96947.jpg' })
  // ];
  constructor(public sharedFunctionobj: SharedFunctions,
    private location: Location,
    public route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router) {
    this.route.queryParams.subscribe(
      params => {
        this.item = params.item;
        this.provider_bussiness_id = parseInt(params.providerId, 0);
        this.showitemprice = params.showpric;
        console.log(this.showitemprice);
      });
  }
  updateCartCount() {
    const orderCount = this.orderList.length;
    return orderCount;
  }
  ngOnInit() {
    const orderList = JSON.parse(localStorage.getItem('order'));
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

  // this.customOptions = {
  //   dots: true,
  //   loop: true,
  //   autoplay: true,
  //   responsiveClass: true,
  //   responsive: {
  //     0: {
  //       items: 1
  //     },
  //     992: {
  //       items: 1,
  //       center: true,
  //     }
  //   }
  // };

  checkout() {
    this.sharedFunctionobj.setitemonLocalStorage('order', this.orderList);
    this.router.navigate(['consumer', 'order', 'cart']);
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
    this.sharedFunctionobj.setitemonLocalStorage('order', this.orderList);
    this.location.back();
  }

  decrement() {
    this.removeFromCart();
  }
  addToCart() {
    const spId = this.sharedFunctionobj.getitemfromLocalStorage('order_spId');
    if (spId === null) {
      this.sharedFunctionobj.setitemonLocalStorage('order_spId', this.provider_bussiness_id);
    } else {
      if (this.orderList !== null && this.orderList.length !== 0) {
        if (spId !== this.provider_bussiness_id) {
          if (this.getConfirmation()) {
            this.sharedFunctionobj.removeitemfromLocalStorage('order');
          }
        }
      }
    }
    this.orderList.push(this.currentItemObject);
    console.log(this.orderList);
    this.sharedFunctionobj.setitemonLocalStorage('order', this.orderList);
    this.getItemQty();
    this.updateCartCount();

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
        this.sharedFunctionobj.removeitemfromLocalStorage('order_sp');
        this.sharedFunctionobj.removeitemfromLocalStorage('chosenDateTime');
        this.sharedFunctionobj.removeitemfromLocalStorage('order_spId');
        this.sharedFunctionobj.removeitemfromLocalStorage('order');
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
        this.sharedFunctionobj.setitemonLocalStorage('order', this.orderList);
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
