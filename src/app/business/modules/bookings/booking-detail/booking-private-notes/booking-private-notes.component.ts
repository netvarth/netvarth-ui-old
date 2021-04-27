import { Component, Input, OnInit } from '@angular/core';
import { PlainGalleryConfig, PlainGalleryStrategy, AdvancedLayout, ButtonsConfig, ButtonsStrategy, ButtonType, Image } from '@ks89/angular-modal-gallery';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';

@Component({
  selector: 'app-booking-private-notes',
  templateUrl: './booking-private-notes.component.html',
  styleUrls: ['./booking-private-notes.component.css']
})
export class BookingPrivateNotesComponent implements OnInit {
  providerNotes;
  @Input() uuid;
  selectedNote;
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
    this.getWaitlistNotes();
  }
  getWaitlistNotes() {
    this.provider_services.getProviderWaitlistNotesnew(this.uuid)
      .subscribe(
        data => {
          this.providerNotes = data;
        });
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
      const thumbPath = this.selectedNote.attachment[comIndex].thumbPath;
      const imagePath = thumbPath;
      const imgobj = new Image(
        count,
        {
          img: imagePath,
        },
      );
      this.image_list_popup.push(imgobj);
      count++;
    }
    if (count > 0) {
      setTimeout(() => {
        this.openImageModalRow(this.image_list_popup[index]);
      }, 200);
    }
  }
}
