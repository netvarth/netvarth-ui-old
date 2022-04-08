import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubtasksComponent } from './subtasks.component';
import { PagerComponent } from 'src/app/shared/modules/pager/pager.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: SubtasksComponent },
  {path:'create-task',loadChildren:()=>import('../../create-task/create-task.module').then((m)=>m.CreateTaskModule)}
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
