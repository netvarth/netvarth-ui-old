import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../shared/modules/common/shared.module';
import { ProPicPopupComponent } from './pro-pic-popup.component';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
    imports: [
        SharedModule,
        ImageCropperModule
    ],
    declarations: [
        ProPicPopupComponent
    ],
    entryComponents: [
        ProPicPopupComponent
    ],
    exports: [ProPicPopupComponent]
})
export class ProPicPopupModule { }
