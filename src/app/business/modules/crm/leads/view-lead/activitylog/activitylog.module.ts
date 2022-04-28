import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagerComponent } from 'src/app/shared/modules/pager/pager.component';
import { RouterModule, Routes } from '@angular/router';
import { ActivitylogComponent } from './activitylog.component';

const routes: Routes = [
  { path: '', component: ActivitylogComponent },
];

@NgModule({
  declarations: [
    // SubtasksComponent,
    PagerComponent,
  ],
  imports: [
    CommonModule,
    [RouterModule.forChild(routes)]
  ]
})
export class ActivitylogModule { }
