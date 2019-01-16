import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { ConfirmBoxComponent } from '../../../shared/components/confirm-box/confirm-box.component';
import { Observable ,  Subscription } from 'rxjs';


import {
  AccessibilityConfig, Action, AdvancedLayout, ButtonEvent, ButtonsConfig, ButtonsStrategy, ButtonType, Description, DescriptionStrategy,
  DotsConfig, GridLayout, Image, ImageModalEvent, LineLayout, PlainGalleryConfig, PlainGalleryStrategy, PreviewConfig
} from 'angular-modal-gallery';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html'
})

export class ServiceDetailComponent implements OnInit {

  service_cap = Messages.SERVICE_CAP;
  duration_cap = Messages.DURATION_CAP;
  price_cap = Messages.PRICE_CAP;
  prepayment_amount = Messages.PREPAYMENT_AMOUNT_CAP;
  description_cap = Messages.DESCRIPTION_CAP;
  close_btn_cap = Messages.CLOSE_BTN;

  api_error = null;
  api_success = null;

  service;
  customPlainGalleryRowConfig: PlainGalleryConfig = {
    strategy: PlainGalleryStrategy.CUSTOM,
    layout: new AdvancedLayout(-1, true)
  };
  customButtonsFontAwesomeConfig: ButtonsConfig = {
    visible: true,
    strategy:  ButtonsStrategy.CUSTOM,
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
  image_list_popup: any = [];

  constructor(
    public dialogRef: MatDialogRef<ServiceDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public shared_services: SharedServices,
    public sharedfunctionObj: SharedFunctions,
    private dialog: MatDialog
    ) {

     }

  ngOnInit() {
      // console.log('received', this.data);
    this.service = this.data.serdet;
    this.image_list_popup = [];
    if (this.service.hasOwnProperty('servicegallery')) {
      // console.log('reached here');
      for (let i = 0; i < this.service.servicegallery.length; i++) {
          const imgobj = new Image(
            i,
            { // modal
              img: this.service.servicegallery[i].url,
              description: this.service.servicegallery[i].caption || ''
            });
          this.image_list_popup.push(imgobj);
        }
    }
  }
  openImageModalRow(image: Image) {
    // console.log('Opening modal gallery from custom plain gallery row, with image: ', image);
    const index: number = this.getCurrentIndexCustomLayout(image, this.image_list_popup);
    this.customPlainGalleryRowConfig = Object.assign({}, this.customPlainGalleryRowConfig, { layout: new AdvancedLayout(index, true) });
  }
  private getCurrentIndexCustomLayout(image: Image, images: Image[]): number {
    return image ? images.indexOf(image) : -1;
  }
  onButtonBeforeHook(event: ButtonEvent) {
  }

  onButtonAfterHook(event: ButtonEvent) {}

  resetApiErrors () {
    this.api_error = null;
    this.api_success = null;
  }
}
