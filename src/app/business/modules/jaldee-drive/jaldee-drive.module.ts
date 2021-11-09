import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JaldeeDriveComponent } from './jaldee-drive/jaldee-drive.component';
import { TableModule } from 'primeng/table';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { MaterialModule } from '../../../shared/modules/common/material.module';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { FolderFilesComponent } from './folder-files/folder-files.component';
import { PreviewuploadedfilesComponent } from './previewuploadedfiles/previewuploadedfiles.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter'; // import ng2search pipe module
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '', component: JaldeeDriveComponent },
  { path: 'folderfiles', component: FolderFilesComponent }

];



@NgModule({
  declarations: [
    JaldeeDriveComponent,
    FolderFilesComponent,
    PreviewuploadedfilesComponent,

  ],
  imports: [
    MaterialModule,
    NgxIntlTelInputModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    NgCircleProgressModule.forRoot({
      "radius": 60,
      "space": -10,
      "outerStrokeGradient": true,
      "outerStrokeWidth": 10,
      "outerStrokeColor": "#4882c2",
      "outerStrokeGradientStopColor": "#53a9ff",
      "innerStrokeColor": "#e7e8ea",
      "innerStrokeWidth": 10,
      "title": "70",
      "animateTitle": false,
      "animationDuration": 1000,
      "showUnits": false,
      "showBackground": false,
      "clockwise": true,
      "startFromZero": false,
      "showSubtitle":false,
      // "responsive":false,
      "lazy": false}),
    CommonModule,
    TableModule,  
    NgCircleProgressModule,
    MatRadioModule,
    FormsModule,
    [RouterModule.forChild(routes)],
  ],
  exports: [JaldeeDriveComponent]
})
export class JaldeeDriveModule { }
