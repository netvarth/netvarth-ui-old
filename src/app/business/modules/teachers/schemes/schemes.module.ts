import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SchemesComponent } from './schemes.component';
import { SkeletonLoadingModule } from '../../../../shared/modules/skeleton-loading/skeleton-loading.module';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';

const routes: Routes = [
  { path: '', component: SchemesComponent },
]

@NgModule({
  declarations: [
    SchemesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CapitalizeFirstPipeModule,
    SkeletonLoadingModule,
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    CalendarModule,
    MultiSelectModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    [RouterModule.forChild(routes)]
  ]
})
export class SchemesModule { }
