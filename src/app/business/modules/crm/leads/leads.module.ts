
import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import {  MatTableModule } from "@angular/material/table";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { LoadingSpinnerModule } from "../../../../shared/modules/loading-spinner/loading-spinner.module";
import { CrmService } from "../crm.service";
import { LeadsComponent } from "./leads.component";
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
const routes: Routes = [
  { path: '', component: LeadsComponent },
  {path:'viewlead/:id',loadChildren:()=>import('./view-lead/view-lead.module').then((m)=>m.ViewLeadModule)},
  {path:'create-lead',loadChildren:()=>import('./create-lead/create-lead.module').then((m)=>m.CreateLeadModule)},
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
        NgCircleProgressModule.forRoot({
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
        [RouterModule.forChild(routes)]
    ],
    exports: [LeadsComponent],
    declarations: [LeadsComponent],
    providers: [
      CrmService
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ]
})
export class LeadsModule {}

