import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { FileService } from '../../../../../../shared/services/file-service';
import { SelectAttachmentComponent } from './select-attachment.component';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { ViewAttachmentComponent } from './view-attachment/view-attachment.component';

@NgModule({
  declarations: [
    SelectAttachmentComponent,
    ViewAttachmentComponent, 
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatChipsModule,
    MatDialogModule
  ],
  // providers: [
  //   FileService
  // ],
  exports:[
    SelectAttachmentComponent
  ]
})
export class SelectAttachmentModule { }
