import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubtasksComponent } from './subtasks.component';
import { PagerComponent } from 'src/app/shared/modules/pager/pager.component';
import { RouterModule, Routes } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';

const routes: Routes = [
  { path: '', component: SubtasksComponent },
];

@NgModule({
  declarations: [
    // SubtasksComponent,
    PagerComponent,
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    [RouterModule.forChild(routes)]
  ]
})
export class SubtasksModule { }
