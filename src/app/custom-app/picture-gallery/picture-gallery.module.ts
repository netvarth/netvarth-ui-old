import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PictureGalleryComponent } from './picture-gallery.component';
import { GalleryModule } from "@ks89/angular-modal-gallery";


@NgModule({
  declarations: [
    PictureGalleryComponent
  ],
  imports: [
    CommonModule,
    GalleryModule
  ],
  exports: [
    PictureGalleryComponent
  ]
})
export class PictureGalleryModule { }
