import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShowMessagesModule } from '../../show-messages/show-messages.module';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CdlManagerComponent } from './cdl-manager.component';


const routes: Routes = [
  { path: '', component: CdlManagerComponent },
];


@NgModule({
  declarations: [
    CdlManagerComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatSlideToggleModule,
    ShowMessagesModule,
    FormsModule,
    [RouterModule.forChild(routes)]
  ],
  exports: [
    CdlManagerComponent
  ]
})
export class CdlManagerModule { }
