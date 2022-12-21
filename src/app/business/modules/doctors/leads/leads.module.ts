import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadsComponent } from './leads.component';
import { RouterModule, Routes } from '@angular/router';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';

const routes: Routes = [
  { path: '', component: LeadsComponent },
  { path: 'create', loadChildren: () => import('./create/create.module').then(m => m.CreateModule) },

]

@NgModule({
  declarations: [
    LeadsComponent
  ],
  imports: [
    CommonModule,
    CapitalizeFirstPipeModule,
    TableModule,
    CalendarModule,
    MultiSelectModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    [RouterModule.forChild(routes)]
  ],
  exports: [
    LeadsComponent
  ]
})
export class LeadsModule { }
