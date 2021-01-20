import { Location } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { projectConstants } from '../../../../app.component';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { ProviderWaitlistCheckInConsumerNoteComponent } from '../../check-ins/provider-waitlist-checkin-consumer-note/provider-waitlist-checkin-consumer-note.component';
import { OrderActionsComponent } from '../order-actions/order-actions.component';
import { AdvancedLayout, PlainGalleryConfig, PlainGalleryStrategy, ButtonsConfig, ButtonsStrategy, Image, ButtonType } from '@ks89/angular-modal-gallery';
import { WordProcessor } from '../../../../shared/services/word-processor.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
  uid;
  loading = false;
  orderDetails: any = [];
  orderItems: any = [];
  selectedType = 'list';
  customerLabel = '';
  display_dateFormat = projectConstantsLocal.DATE_FORMAT_WITH_MONTH;
  screenWidth;
  small_device_display = false;
  tooltipcls = projectConstants.TOOLTIP_CLS;
  image_list_popup: Image[];
  imagelist: any = [];
customPlainGalleryRowConfig: PlainGalleryConfig = {
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
  constructor(public activaterouter: ActivatedRoute,
    public providerservice: ProviderServices, private dialog: MatDialog,
    public location: Location, public sharedFunctions: SharedFunctions,
    private wordProcessor: WordProcessor) {
    this.activaterouter.params.subscribe(param => {
      this.uid = param.id;
      this.customerLabel = this.wordProcessor.getTerminologyTerm('customer');
      this.getOrderDetails(this.uid);
    });
  }

  ngOnInit() {
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 767) {
      this.small_device_display = true;
    } else {
      this.small_device_display = false;
    }
  }
  getOrderDetails(uid) {
    this.loading = true;
    this.orderItems = [];
    this.image_list_popup = [];
    this.providerservice.getProviderOrderById(uid).subscribe(data => {
      this.orderDetails = data;
      if (this.orderDetails && this.orderDetails.orderItem) {
        for (const item of this.orderDetails.orderItem) {
          this.orderItems.push({ 'type': 'order-details-item', 'item': item });
        }
      }
      if (this.orderDetails && this.orderDetails.shoppingList) {
        this.imagelist = this.orderDetails.shoppingList;
        for (let i = 0; i < this.imagelist.length; i++) {
          const imgobj = new Image(
            i,
            { // modal
                img: this.imagelist[i].s3path,
                description: ''
            });
        this.image_list_popup.push(imgobj);
        }
      }
      this.loading = false;
    });
  }
  goBack() {
    this.location.back();
  }
  selectViewType(type) {
    this.selectedType = type;
  }
  showOrderActions() {
    const actiondialogRef = this.dialog.open(OrderActionsComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'checkinactionclass'],
      disableClose: true,
      data: {
        selectedOrder: this.orderDetails,
        source: 'details'
      }
    });
    actiondialogRef.afterClosed().subscribe(data => {
      this.getOrderDetails(this.uid);
    });
  }
  getItemImg(item) {
    if (item.itemImages) {
      const image = item.itemImages.filter(img => img.displayImage);
      if (image[0]) {
        return image[0].url;
      } else {
        return '../../../../assets/images/order/Items.svg';
      }
    } else {
      return '../../../../assets/images/order/Items.svg';
    }
  }
  showConsumerNote(item) {
    const notedialogRef = this.dialog.open(ProviderWaitlistCheckInConsumerNoteComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        checkin: item,
        type: 'order-details'
      }
    });
    notedialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
      }
    });
  }
  openImageModalRow(image: Image) {
    console.log(image);
    console.log(this.image_list_popup);
    const index: number = this.getCurrentIndexCustomLayout(image, this.image_list_popup);
    this.customPlainGalleryRowConfig = Object.assign({}, this.customPlainGalleryRowConfig, { layout: new AdvancedLayout(index, true) });
  }
  private getCurrentIndexCustomLayout(image: Image, images: Image[]): number {
    return image ? images.indexOf(image) : -1;
  }
  
  onButtonBeforeHook() {
  }
  onButtonAfterHook() { }
}
