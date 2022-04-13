import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatListModule } from "@angular/material/list";
import { LoadingSpinnerModule } from "../../../shared/modules/loading-spinner/loading-spinner.module";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { RouterModule, Routes } from "@angular/router";
import { CapitalizeFirstPipeModule } from "../../../shared/pipes/capitalize.module";
import { MatRadioModule } from "@angular/material/radio";
import {  ReactiveFormsModule } from '@angular/forms';
import { CrmProgressbarComponent } from './crm-progressbar.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
const routes: Routes = [
  { path: '', component: CrmProgressbarComponent }
]

@NgModule({
  declarations: [
    CrmProgressbarComponent
  ],
  exports: [CrmProgressbarComponent],
  imports: [
    CommonModule, LoadingSpinnerModule,
    MatListModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatCheckboxModule,
    RouterModule,
    CapitalizeFirstPipeModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatSliderModule,
    MatProgressBarModule,
   MatIconModule,
    [RouterModule.forChild(routes)]
  ]
})
export class CrmProgressbarModule { }
