import { NgModule } from '@angular/core';
import { ProPicPopupComponent } from './pro-pic-popup.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormMessageDisplayModule } from '../../../../../shared/modules/form-message-display/form-message-display.module';
import { FileService } from '../../../../../shared/services/file-service';

@NgModule({
    imports: [
        CommonModule,
        ImageCropperModule,
        MatDialogModule,
        MatButtonModule,
        FormMessageDisplayModule
    ],
    declarations: [
        ProPicPopupComponent
    ],
    providers: [
        FileService
    ],
    exports: [ProPicPopupComponent]
})
export class ProPicPopupModule { }
