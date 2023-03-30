import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileService } from '../../../../../../shared/services/file-service';
import { SelectAttachmentComponent } from './select-attachment.component';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { ViewAttachmentComponent } from './view-attachment/view-attachment.component';
import { LoadingSpinnerModule } from '../../../../../../../../src/app/shared/modules/loading-spinner/loading-spinner.module';
import {NgxImageCompressService} from 'ngx-image-compress';
// import { FileService } from 'src/app/shared/services/file-service';
@NgModule({
  declarations: [
    SelectAttachmentComponent,
    ViewAttachmentComponent, 
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatChipsModule,
    MatDialogModule,
    LoadingSpinnerModule,
  ],
  providers: [
    FileService,
    NgxImageCompressService
  ],
  exports:[
    SelectAttachmentComponent
  ]
})
export class SelectAttachmentModule { }
