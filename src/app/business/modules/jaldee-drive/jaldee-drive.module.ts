import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JaldeeDriveComponent } from './jaldee-drive.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { PreviewuploadedfilesModule } from './previewuploadedfiles/previewuploadedfiles.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
 import { CapitalizeFirstPipeModule } from "../../../shared/pipes/capitalize.module";



const routes: Routes = [
  { path: '', component: JaldeeDriveComponent },
  { path: 'folderfiles', loadChildren: ()=> import('./folder-files/folder-files.module').then(m=>m.FolderFileModule) },
  { path: 'sharedfiles',loadChildren: ()=> import('./sharedfiles/sharedfiles.module').then(m=>m.SharedfilesModule) },
];
@NgModule({
  declarations: [
    JaldeeDriveComponent
  ],
  imports: [
    NgxIntlTelInputModule,
    CommonModule,
    MatRadioModule,
    MatCheckboxModule,
    MatTooltipModule,
    FormsModule,
    PreviewuploadedfilesModule,
    CapitalizeFirstPipeModule,
    [RouterModule.forChild(routes)],
  ],
  exports: [JaldeeDriveComponent],
  providers: [
  ]
})
export class JaldeeDriveModule { }
