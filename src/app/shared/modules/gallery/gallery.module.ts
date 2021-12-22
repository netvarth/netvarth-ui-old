import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GalleryModule as ModalGalleryModule } from '@ks89/angular-modal-gallery';
import { GalleryComponent } from './gallery.component';
import { GalleryService } from './galery-service';
import { FormMessageDisplayModule } from '../form-message-display/form-message-display.module';
import { GalleryImportModule } from './import/gallery-import.module';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        ModalGalleryModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        FormMessageDisplayModule,
        GalleryImportModule
    ],
    declarations: [GalleryComponent],
    exports: [GalleryComponent],
    providers: [GalleryService]
})

export class GalleryModule {}
