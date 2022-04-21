import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileService } from '../../../../../../shared/services/file-service';

@NgModule({
  declarations: [
    // SelectAttachmentComponent, 
  ],
  imports: [
    CommonModule
  ],
  providers: [
    FileService
  ]
})
export class SelectAttachmentModule { }
