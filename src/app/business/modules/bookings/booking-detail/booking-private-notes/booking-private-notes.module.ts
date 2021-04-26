import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingPrivateNotesComponent } from './booking-private-notes.component';
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';

@NgModule({
  declarations: [BookingPrivateNotesComponent],
  imports: [
    CommonModule,
    ModalGalleryModule.forRoot({ shortcuts: ['ctrl+s', 'meta+s'], disableSsrWorkaround: true })
  ],
  exports: [BookingPrivateNotesComponent]
})

export class BookingPrivateNotesModule {
}
