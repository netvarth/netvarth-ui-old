import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadsComponent } from './leads.component';
import { RouterModule, Routes } from '@angular/router';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';

const routes: Routes = [
  { path: '', component: LeadsComponent }
]

@NgModule({
  declarations: [
    LeadsComponent
  ],
  imports: [
    CommonModule,
    CapitalizeFirstPipeModule,
    [RouterModule.forChild(routes)]
  ],
  exports: [
    LeadsComponent
  ]
})
export class LeadsModule { }
