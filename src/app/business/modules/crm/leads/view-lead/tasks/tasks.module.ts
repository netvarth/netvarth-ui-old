import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksComponent } from './Tasks.component';
import { PagerComponent } from 'src/app/shared/modules/pager/pager.component';
import { RouterModule, Routes } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';


const routes: Routes = [
  { path: '', component: TasksComponent },
];

@NgModule({
  declarations: [
    // TasksComponent,
    PagerComponent,
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    [RouterModule.forChild(routes)]
  ]
})
export class TasksModule { }
