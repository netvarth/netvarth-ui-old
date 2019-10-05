import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalGalleryModule } from 'angular-modal-gallery';
import { GalleryComponent } from './gallery.component';
import { GalleryImportComponent } from './import/gallery-import.component';
import { GalleryService } from './galery-service';
import { FormMessageDisplayModule } from '../form-message-display/form-message-display.module';
import { MaterialModule } from '../common/material.module';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        MaterialModule,
        ModalGalleryModule,
        FormMessageDisplayModule
    ],
    entryComponents: [GalleryImportComponent],
    declarations: [GalleryComponent, GalleryImportComponent],
    exports: [GalleryComponent, GalleryImportComponent],
    providers: [GalleryService]
})

export class GalleryModule {}
