import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { CreateTaskComponent } from './create-task.component';
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
import {LeadtemplateComponent} from './leadtemplate.component'

const routes: Routes = [
  { path: '', component: LeadtemplateComponent }
]

@NgModule({
  declarations: [LeadtemplateComponent],
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
        [RouterModule.forChild(routes)]
  ],
  exports: [
    LeadtemplateComponent
],
})
export class LeadtemplateModule { }
