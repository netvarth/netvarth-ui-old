import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallsComponent } from './calls.component';
import { RouterModule, Routes } from '@angular/router';
import { SkeletonLoadingModule } from '../../../../shared/modules/skeleton-loading/skeleton-loading.module';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: CallsComponent }
]


@NgModule({
  declarations: [
    CallsComponent
  ],
  imports: [
    CommonModule,
    SkeletonLoadingModule,
    TableModule,
    CalendarModule,
    MultiSelectModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    [RouterModule.forChild(routes)]
  ]
})
export class CallsModule { }