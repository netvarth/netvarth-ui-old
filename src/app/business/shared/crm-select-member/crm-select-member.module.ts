import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrmSelectMemberComponent } from './crm-select-member.component';
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
import { MatIconModule } from "@angular/material/icon";
import {MatChipsModule} from '@angular/material/chips';
import {MatFormFieldModule} from '@angular/material/form-field';
import { NgCircleProgressModule } from "ng-circle-progress";
import { FilterPipe } from './filter.pipe';

const routes: Routes = [
  { path: '', component: CrmSelectMemberComponent }
]

@NgModule({
  declarations: [
    CrmSelectMemberComponent,
    FilterPipe
  ],
  exports: [CrmSelectMemberComponent],
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
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      backgroundColor: "#e9ecef",
      backgroundPadding: 2,
      radius: 19,
      space: -20,
      maxPercent: 100,
      unitsColor: "teal",
      outerStrokeWidth: 1,
      outerStrokeColor: "#46BD84",
      innerStrokeColor: "#D1D2D2",
      innerStrokeWidth: 1,
      titleColor: "teal",
      subtitleColor: "teal",
    }),
    [RouterModule.forChild(routes)]


  ]
})
export class CrmSelectMemberModule { }
