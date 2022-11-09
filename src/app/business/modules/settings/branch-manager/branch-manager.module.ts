import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BranchManagerComponent } from './branch-manager.component';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Routes, RouterModule } from '@angular/router';
import { ShowMessagesModule } from '../../show-messages/show-messages.module';



const routes: Routes = [
  { path: '', component: BranchManagerComponent },
];

@NgModule({
  declarations: [
    BranchManagerComponent
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
export class BranchManagerModule { }
