import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterModule, Routes } from '@angular/router';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CapitalizeFirstPipeModule } from '../../../../../shared/pipes/capitalize.module';
import { FormMessageDisplayModule } from '../../../../../shared/modules/form-message-display/form-message-display.module';
import { Nl2BrPipeModule } from 'nl2br-pipe';
import { FileService } from '../../../../../shared/services/file-service';
import { ItemgroupComponent } from './itemgroup.component';

const routes: Routes = [
  { path: '', component: ItemgroupComponent }
]

@NgModule({
  declarations: [
    ItemgroupComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    ImageCropperModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    Nl2BrPipeModule,
    FormMessageDisplayModule,
    CapitalizeFirstPipeModule,
    [RouterModule.forChild(routes)]
  ],
  exports: [ItemgroupComponent],
  providers: [
    FileService
]
 
})
export class ItemgroupModule { }
