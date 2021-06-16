import { Component, Input, OnInit } from '@angular/core';
import { PlainGalleryConfig, PlainGalleryStrategy, AdvancedLayout, ButtonsConfig, ButtonsStrategy, ButtonType, Image } from '@ks89/angular-modal-gallery';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';

@Component({
  selector: 'app-booking-private-notes',
  templateUrl: './booking-private-notes.component.html',
  styleUrls: ['./booking-private-notes.component.css', '../../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css', '../../../../../../assets/css/style.bundle.css']
})
export class BookingPrivateNotesComponent implements OnInit {
  providerNotes;
  @Input() uuid;
  @Input() waitlist_data;
  @Input() bookingType;
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
  constructor(private provider_services: ProviderServices,
    private sharedFunctions: SharedFunctions) {
    this.sharedFunctions.getMessage().subscribe((message) => {
      switch (message.type) {
        case 'addnote':
          this.getWaitlistNotes();
          break;
      }
    });
  }
  ngOnInit(): void {
    if ((this.waitlist_data.waitlistStatus && this.waitlist_data.waitlistStatus !== 'blocked') || (this.waitlist_data.apptStatus && this.waitlist_data.apptStatus !== 'blocked')) {
      this.getWaitlistNotes();
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
    for (let comIndex = 0; comIndex < this.selectedNote.attachment.length; comIndex++) {
      let imagePath;
      if (this.checkImgType(this.selectedNote.attachment[comIndex].s3path) === 'img') {
        imagePath = this.selectedNote.attachment[comIndex].s3path;
        const imgobj = new Image(
          count,
          {
            img: imagePath,
          },
        );
        this.image_list_popup.push(imgobj);
        count++;
      } else {
        window.open(this.selectedNote.attachment[index].s3path, '_blank');
      }
    }
    if (count > 0) {
      setTimeout(() => {
        this.openImageModalRow(this.image_list_popup[index]);
      }, 200);
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
}
