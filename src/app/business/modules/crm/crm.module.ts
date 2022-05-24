
import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import {  MatTableModule } from "@angular/material/table";
import { CapitalizeFirstPipeModule } from "../../../shared/pipes/capitalize.module";
import { LoadingSpinnerModule } from "../../../shared/modules/loading-spinner/loading-spinner.module";
import { CrmService } from "./crm.service";
// import { TasksComponent } from "./tasks.component";
import {crmComponent} from "./crm.component"
import { RouterModule, Routes } from "@angular/router";
import { MatTabsModule } from "@angular/material/tabs";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormMessageDisplayModule } from "../../../shared/modules/form-message-display/form-message-display.module";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { PagerModule } from "../../../../../src/app/shared/modules/pager/pager.module";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { NgCircleProgressModule } from "ng-circle-progress";
import { FormsModule } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";
import { MatOptionModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import {MatExpansionModule} from '@angular/material/expansion';
const routes: Routes = [
    { path: '', component: crmComponent },
    { path: 'leads', loadChildren: ()=> import('./leads/leads.module').then(m=>m.LeadsModule) },
    { path: 'tasks',loadChildren: ()=> import('./tasks/tasks.module').then(m=>m.TasksModule) },
    { path: 'enquiry',loadChildren: ()=> import('./enquiry/enquiry.module').then(m=>m.EnquiryModule) },
  
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
        MatExpansionModule
    ],
    exports: [crmComponent],
    declarations: [crmComponent],
    providers: [
      CrmService
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ]
})
export class crmModule {}