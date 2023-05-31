import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchedulesListComponent } from './schedules-list.component';
import { RouterModule, Routes } from '@angular/router';
import { SkeletonLoadingModule } from '../../../../../shared/modules/skeleton-loading/skeleton-loading.module';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

const routes: Routes = [
  { path: '', component: SchedulesListComponent }
];

@NgModule({
  declarations: [
    SchedulesListComponent
  ],
  imports: [
    CommonModule,
    SkeletonLoadingModule,
    TableModule,
    ButtonModule,
    MatSlideToggleModule,
    [RouterModule.forChild(routes)]
  ]
})
export class SchedulesListModule { }
