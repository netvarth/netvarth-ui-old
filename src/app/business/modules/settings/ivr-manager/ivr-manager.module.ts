import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IvrManagerComponent } from './ivr-manager.component';
import { FormsModule } from '@angular/forms';
import { ShowMessagesModule } from '../../show-messages/show-messages.module';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';


const routes: Routes = [
  { path: '', component: IvrManagerComponent },
  { path: 'schedules', loadChildren: () => import('./schedules-list/schedules-list.module').then(m => m.SchedulesListModule) }
];

@NgModule({
  declarations: [
    IvrManagerComponent
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
export class IvrManagerModule { }
