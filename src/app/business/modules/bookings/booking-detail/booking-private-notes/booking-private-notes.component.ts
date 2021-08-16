import { Component, HostListener, Input, OnInit } from '@angular/core';
import { PlainGalleryConfig, PlainGalleryStrategy, AdvancedLayout, ButtonsConfig, ButtonsStrategy, ButtonType, Image } from '@ks89/angular-modal-gallery';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-booking-private-notes',
  templateUrl: './booking-private-notes.component.html',
  styleUrls: ['./booking-private-notes.component.css', '../../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css', '../../../../../../assets/css/style.bundle.css']
})
export class BookingPrivateNotesComponent implements OnInit {
  providerNotes: any = [];
  @Input() uuid;
  @Input() waitlistStatus;
  @Input() bookingType;
  @Input() view;
  selectedNote;
  newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
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
  subscription: Subscription;
  small_device_display = false;
  constructor(private provider_services: ProviderServices,
    private sharedFunctions: SharedFunctions,
    private router: Router, private location: Location,
    private activateRoute: ActivatedRoute) {
    this.subscription = this.sharedFunctions.getMessage().subscribe((message) => {
      switch (message.type) {
        case 'addnote':
          this.getWaitlistNotes();
          break;
      }
    });
    this.activateRoute.queryParams.subscribe(params => {
      console.log('params', params);
      if (params.uuid) {
        this.uuid = params.uuid;
      }
      if (params.waitlistStatus) {
        this.waitlistStatus = params.waitlistStatus;
      }
      if (params.bookingType) {
        this.bookingType = params.bookingType;
      }
    });
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  ngOnInit(): void {
    this.onResize();
    if (this.waitlistStatus !== 'blocked') {
      this.getWaitlistNotes();
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 767) {
      this.small_device_display = true;
    } else {
      this.small_device_display = false;
    }
  }
  getWaitlistNotes() {
    if (this.bookingType === 'checkin') {
      this.provider_services.getProviderWaitlistNotesnew(this.uuid)
        .subscribe(
          data => {
            this.providerNotes = data;
          });
    } else {
      this.provider_services.getProviderAppointmentNotes(this.uuid)
        .subscribe(
          data => {
            this.providerNotes = data;
          });
    }
  }
  selectNote(note) {
    this.selectedNote = note;
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
  openImage(index) {
    this.image_list_popup = [];
    let count = 0;
    if (this.checkImgType(this.selectedNote.attachment[index].s3path) !== 'img') {
      window.open(this.selectedNote.attachment[index].s3path, '_blank');
    } else {
      for (let comIndex = 0; comIndex < this.selectedNote.attachment.length; comIndex++) {
        if (this.checkImgType(this.selectedNote.attachment[comIndex].s3path) === 'img') {
          let imagePath;
          imagePath = this.selectedNote.attachment[comIndex].s3path;
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
      if (count > 0) {
        setTimeout(() => {
          this.openImageModalRow(this.image_list_popup[index]);
        }, 200);
      }
    }
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
  gotoView() {
    this.router.navigate(['provider', 'bookings', 'details', 'notes'], { queryParams: { uuid: this.uuid, bookingType: this.bookingType, waitlistStatus: this.waitlistStatus } });
  }
  gotoPrev() {
    this.location.back();
  }
}
