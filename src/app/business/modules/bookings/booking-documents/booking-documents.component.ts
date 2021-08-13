import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../shared/constants/project-messages';
import { GalleryService } from '../../../../shared/modules/gallery/galery-service';
import { GalleryImportComponent } from '../../../../shared/modules/gallery/import/gallery-import.component';
import { SharedServices } from '../../../../shared/services/shared-services';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { PlainGalleryConfig, PlainGalleryStrategy, AdvancedLayout, ButtonsConfig, ButtonsStrategy, ButtonType, Image } from '@ks89/angular-modal-gallery';

@Component({
  selector: 'app-booking-documents',
  templateUrl: './booking-documents.component.html',
  styleUrls: ['./booking-documents.component.css', '../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css', '../../../../../assets/css/style.bundle.css']
})
export class BookingDocumentsComponent implements OnInit {
  @Input() bookingType;
  @Input() waitlist_data;
  @Input() widget;
  subscription: Subscription;
  uuid;
  documents: any = [];
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
  image_list_popup: Image[];
  loading = false;
  imagesOnlyList: any = [];
  constructor(private galleryService: GalleryService,
    private shared_services: SharedServices,
    private snackbarService: SnackbarService,
    private dialog: MatDialog, private location: Location,
    private provider_services: ProviderServices,
    private router: Router,
    private activateRoute: ActivatedRoute) {
    this.subscription = this.galleryService.getMessage().subscribe(input => {
      if (input && input.uuid) {
        if (this.bookingType === 'checkin') {
          this.shared_services.addProviderWaitlistAttachment(input.uuid, input.value)
            .subscribe(
              () => {
                this.snackbarService.openSnackBar(Messages.ATTACHMENT_SEND, { 'panelClass': 'snackbarnormal' });
                this.galleryService.sendMessage({ ttype: 'upload', status: 'success' });
                this.getAttachments();
              },
              error => {
                this.snackbarService.openSnackBar(error.error, { 'panelClass': 'snackbarerror' });
                this.galleryService.sendMessage({ ttype: 'upload', status: 'failure' });
              }
            );
        } else {
          this.shared_services.addProviderAppointmentAttachment(input.uuid, input.value)
            .subscribe(
              () => {
                this.snackbarService.openSnackBar(Messages.ATTACHMENT_SEND, { 'panelClass': 'snackbarnormal' });
                this.galleryService.sendMessage({ ttype: 'upload', status: 'success' });
                this.getAttachments();
              },
              error => {
                this.snackbarService.openSnackBar(error.error, { 'panelClass': 'snackbarerror' });
                this.galleryService.sendMessage({ ttype: 'upload', status: 'failure' });
              }
            );
        }
      }
    });
    this.activateRoute.queryParams.subscribe(qparams => {
      console.log(qparams);
      if (qparams.uid) {
        this.uuid = qparams.uid;
      }
    })
  }
  ngOnInit(): void {
    if (this.bookingType) {
      this.widget = true;
    } else {
      this.widget = false;
    }
    if (this.uuid) {
      this.loading = true;
      this.getAttachments();
    }
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  sendimages() {
    this.dialog.open(GalleryImportComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        source_id: 'attachment',
        uid: (this.bookingType === 'checkin') ? this.waitlist_data.ynwUuid : this.waitlist_data.uid
      }
    });
  }
  gotoDocuments() {
    this.router.navigate(['provider/bookings/documents'], { queryParams: { uid: this.uuid } });
  }
  goBack() {
    this.location.back();
  }
  getAttachments() {
    this.provider_services.getProviderWaitlistAttachmentsByUuid(this.uuid).subscribe(
      data => {
        console.log('data', data);
        this.documents = data;
        this.imagesOnlyList = this.documents.filter(doc => this.checkImgType(doc.s3path) === 'img');
        console.log('this.imagesOnlyList', this.imagesOnlyList)
        this.loading = false;
      });
  }
  showImg(index) {
    this.image_list_popup = [];
    let count = 0;
    if (this.checkImgType(this.documents[index].s3path) !== 'img') {
      window.open(this.documents[index].s3path, '_blank');
    } else {
      for (let comIndex = 0; comIndex < this.imagesOnlyList.length; comIndex++) {
        if (this.checkImgType(this.imagesOnlyList[comIndex].s3path) === 'img') {
          let imagePath;
          imagePath = this.imagesOnlyList[comIndex].s3path;
          const imgobj = new Image(
            count,
            {
              img: imagePath,
            },
          );
          this.image_list_popup.push(imgobj);
          count++;
        }
      }
      index = this.imagesOnlyList.indexOf(this.documents[index]);
      if (count > 0) {
        setTimeout(() => {
          this.openImageModalRow(this.image_list_popup[index]);
        }, 200);
      }
    }
  }
  onButtonBeforeHook() { }
  onButtonAfterHook() { }
  openImageModalRow(image: Image) {
    const index: number = this.getCurrentIndexCustomLayout(image, this.image_list_popup);
    this.customPlainGalleryRowConfig = Object.assign({}, this.customPlainGalleryRowConfig, { layout: new AdvancedLayout(index, true) });
  }
  private getCurrentIndexCustomLayout(image: Image, images: Image[]): number {
    return image ? images.indexOf(image) : -1;
  }
  checkImgType(img) {
    img = img.split('?');
    if (img[0] && img[0].indexOf('.pdf') === -1) {
      return 'img';
    } else {
      return 'pdf';
    }
  }
  getImage(img) {
    const type = img.s3path.split('?');
    if (type[0] && type[0].indexOf('.pdf') === -1) {
      return img.s3path;
    } else {
      return img.thumbPath;
    }
  }
}
