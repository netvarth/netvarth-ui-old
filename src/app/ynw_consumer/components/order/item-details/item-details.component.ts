import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { Location } from '@angular/common';
import { AccessibilityConfig, Image, ImageEvent } from '@ks89/angular-modal-gallery';
import { SharedServices } from '../../../../shared/services/shared-services';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit,OnDestroy {
 

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
  imagesRect: Image[] = new Array <Image> ();
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
private subs=new SubSink();
  constructor(   public sharedFunctionobj: SharedFunctions,
    private sharedServices: SharedServices,
    private location: Location,
    private lStorageService: LocalStorageService,
    private router: Router ) { }

  ngOnInit() {
    const orderList = JSON.parse(this.lStorageService.getitemfromLocalStorage('order'));
    if (orderList) {
      this.orderList = orderList;
    }
    console.log(this.orderList);
    this.subs.sink=this.sharedServices.getItemDetails(1).subscribe(
      (item: any) => {
        console.log(item);
        this.currentItem = item;
        this.itemImages = this.currentItem.itemImages;
        for (let imgIndex = 0; imgIndex < this.itemImages.length; imgIndex++) {
          const imgobj = new Image(this.itemImages[imgIndex].id,
              {img: this.itemImages[imgIndex].url,
              description: this.itemImages[imgIndex].title},
              {img: this.itemImages[imgIndex].url,
                title: this.itemImages[imgIndex].title},
          );
          this.imagesRect = [... this.imagesRect, imgobj]
        }
      }
    );

  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  checkout() {
    this.lStorageService.setitemonLocalStorage('order', this.orderList);
    this.router.navigate(['order/shoppingcart']);
  }
  getItemQty() {
    const orderList = this.orderList;
    let qty = 0;
    if (orderList !== null && orderList.filter(i => i.itemId === this.currentItem.itemId)) {
      qty = orderList.filter(i => i.itemId === this.currentItem.itemId).length;
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
  addToCart() {
    this.orderList.push(this.currentItem);
    this.lStorageService.setitemonLocalStorage('order', this.orderList);
    this.getItemQty();

  }
  removeFromCart() {
    console.log(this.orderList);
    for (const i in this.orderList) {
      if (this.orderList[i].itemId === this.currentItem.itemId) {
        this.orderList.splice(i, 1);
        this.lStorageService.setitemonLocalStorage('order', this.orderList);
        break;
      }
    }

    this.getItemQty();
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
