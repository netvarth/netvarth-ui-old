import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateLeadComponent } from './create-lead.component';
import { LoadingSpinnerModule } from "../../../../../shared/modules/loading-spinner/loading-spinner.module";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { CapitalizeFirstPipeModule } from "../../../../../shared/pipes/capitalize.module";
import { MatDialogModule } from "@angular/material/dialog";
import { MatRadioModule } from "@angular/material/radio";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {  ReactiveFormsModule } from '@angular/forms';
import { FormMessageDisplayModule } from "../../../../../shared/modules/form-message-display/form-message-display.module";
import { MatSelectModule } from "@angular/material/select";
import { MatOptionModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatIconModule } from "@angular/material/icon";
// import { MatSelectSearchModule } from '../../../../../shared/components/mat-select-search/mat-select-search/mat-select-search.module';
// import { MatSelectSearchModule } from 'mat-select-search';
import { MatCardModule } from '@angular/material/card';
const routes: Routes = [
  { path: '', component: CreateLeadComponent }
]

@NgModule({
  declarations: [
    CreateLeadComponent
  ],
  imports: [
    CommonModule,
    CommonModule,
        LoadingSpinnerModule,
        MatTooltipModule,
        MatCheckboxModule,
        FormsModule,
        CapitalizeFirstPipeModule,
        MatDialogModule,
        MatRadioModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        FormMessageDisplayModule,
        MatSelectModule,
        MatOptionModule,
        MatDatepickerModule,
        MatIconModule,
        // MatSelectSearchModule,
        MatCardModule,
        [RouterModule.forChild(routes)]
  ],
  exports: [
    CreateLeadComponent
],
})
export class CreateLeadModule { }
