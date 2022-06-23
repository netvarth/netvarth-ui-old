
import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import {  MatTableModule } from "@angular/material/table";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { LoadingSpinnerModule } from "../../../../shared/modules/loading-spinner/loading-spinner.module";
import { CrmService } from "../crm.service";
import {enquiryComponent} from "./enquiry.component" 
import { RouterModule, Routes } from "@angular/router";
import { MatTabsModule } from "@angular/material/tabs";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormMessageDisplayModule } from "../../../../shared/modules/form-message-display/form-message-display.module";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { PagerModule } from "../../../../../../src/app/shared/modules/pager/pager.module";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { NgCircleProgressModule } from "ng-circle-progress";
import { FormsModule } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";
import { MatOptionModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatRadioModule } from "@angular/material/radio";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {  ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

const routes: Routes = [
  { path: '', component: enquiryComponent },


];

@NgModule({
  imports: [
      CommonModule,
      PagerModule,
      MatTableModule,
      MatDialogModule,
      MatTabsModule,
      CapitalizeFirstPipeModule,
      MatFormFieldModule,
      MatInputModule,
      MatIconModule,
      MatMenuModule,
      MatCheckboxModule,
      LoadingSpinnerModule,
      FormMessageDisplayModule,
      FormsModule,
      MatSelectModule,
      MatOptionModule,
      MatDatepickerModule,
      NgCircleProgressModule.forRoot({
        // set defaults here
        backgroundColor: "#e9ecef",
        backgroundPadding: 2,
        radius: 19,
        space: -15,
        maxPercent: 100,
        unitsColor: "teal",
        outerStrokeWidth: 1,
        outerStrokeColor: "teal",
        innerStrokeColor: "teal",
        innerStrokeWidth: 1,
        titleColor: "teal",
        subtitleColor: "teal",
      }),
      [RouterModule.forChild(routes)],
      MatRadioModule,
      MatSlideToggleModule,
      ReactiveFormsModule,
      MatCardModule,
      MatTooltipModule



  ],
  exports: [enquiryComponent],
  declarations: [enquiryComponent],
  providers: [
    CrmService
  ],
  schemas: [
      CUSTOM_ELEMENTS_SCHEMA,
      NO_ERRORS_SCHEMA
  ]
})
export class EnquiryModule { }
