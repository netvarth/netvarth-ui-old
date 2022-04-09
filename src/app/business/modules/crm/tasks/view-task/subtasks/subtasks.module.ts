import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubtasksComponent } from './subtasks.component';
import { PagerComponent } from 'src/app/shared/modules/pager/pager.component';
import { RouterModule, Routes } from '@angular/router';

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
    [RouterModule.forChild(routes)]
  ]
})
export class SubtasksModule { }
