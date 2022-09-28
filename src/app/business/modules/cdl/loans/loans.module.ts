import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoansComponent } from './loans.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";


const routes: Routes = [
  { path: '', component: LoansComponent },
  { path: 'create', loadChildren: () => import('./create/create.module').then(m => m.CreateModule) },
  { path: 'approved', loadChildren: () => import('./approved/approved.module').then(m => m.ApprovedModule) },
  { path: 'loanDetails', loadChildren: () => import('./loanDetails/loanDetails.module').then(m => m.loanDetailsModule) },
  { path: 'additionalqa', loadChildren: () => import('./additional-questions/additional-questions.module').then(m => m.AdditionalQuestionsModule) }
]

@NgModule({
  exports: [LoansComponent],
  declarations: [LoansComponent],
  imports: [
    CommonModule,
    CapitalizeFirstPipeModule,
    [RouterModule.forChild(routes)]
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class LoansModule { }
