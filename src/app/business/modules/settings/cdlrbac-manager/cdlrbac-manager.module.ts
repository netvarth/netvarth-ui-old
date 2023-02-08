import { FormsModule } from '@angular/forms';
import { ShowMessagesModule } from '../../show-messages/show-messages.module';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CdlrbacManagerComponent } from './cdlrbac-manager.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  { path: '', component: CdlrbacManagerComponent },
];

@NgModule({
  declarations: [
    CdlrbacManagerComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatSlideToggleModule,
    ShowMessagesModule,
    FormsModule,
    [RouterModule.forChild(routes)]
  ]
})
export class CdlrbacManagerModule { }
