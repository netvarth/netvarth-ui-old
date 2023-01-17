import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { LoanDetailsComponent } from './loan-details.component'
import { CapitalizeFirstPipeModule } from "../../../../../shared/pipes/capitalize.module";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { ConfirmBoxModule } from '../confirm-box/confirm-box.module';
import { TimelineModule } from 'primeng/timeline';
import { ViewReportModule } from './view-report/view-report.module';


const routes: Routes = [
  { path: '', component: LoanDetailsComponent }
]


@NgModule({
  exports: [LoanDetailsComponent],
  declarations: [LoanDetailsComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    ConfirmBoxModule,
    CapitalizeFirstPipeModule,
    TimelineModule,
    ViewReportModule,
    [RouterModule.forChild(routes)]
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class LoanDetailsModule { }