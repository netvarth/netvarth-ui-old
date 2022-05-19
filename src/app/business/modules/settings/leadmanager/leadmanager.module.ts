import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShowMessagesModule } from '../../show-messages/show-messages.module';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
// import { TaskmanagerComponent } from './taskmanager.component';
import {LeadmanagerComponent} from './leadmanager.component'


const routes: Routes = [
  { path: '', component: LeadmanagerComponent },
];



@NgModule({
  // declarations: [],
  imports: [
    CommonModule,
    MatDialogModule,
    MatSlideToggleModule,
    ShowMessagesModule,
    FormsModule,
    [RouterModule.forChild(routes)]
  ],
  declarations: [
    LeadmanagerComponent
  ],
  exports: [LeadmanagerComponent]
})
export class LeadmanagerModule { }
