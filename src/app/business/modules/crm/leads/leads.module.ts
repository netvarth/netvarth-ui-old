
import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { LoadingSpinnerModule } from "../../../../shared/modules/loading-spinner/loading-spinner.module";
import { CrmService } from "../crm.service";
import { LeadsComponent } from "./leads.component";
import { RouterModule, Routes } from "@angular/router";
import { PagerModule } from "../../../../../../src/app/shared/modules/pager/pager.module";
import { NgxPaginationModule } from "ngx-pagination";
import { MatButtonModule } from "@angular/material/button";
import { MatChipsModule } from "@angular/material/chips";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { FormsModule } from "@angular/forms";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";

const routes: Routes = [
  { path: '', component: LeadsComponent },
  {path:'viewleadqnr/:id',loadChildren:()=>import('./view-lead-qnr/view-lead-qnr.module').then((m)=>m.ViewLeadQnrModule)},
  {path:'create-lead',loadChildren:()=>import('./create-lead/create-lead.module').then((m)=>m.CreateLeadModule)},
  {path:'create-task/:id',loadChildren:()=>import('../tasks/create-task/create-task.module').then((m)=>m.CreateTaskModule)},
  {path:'leadtemplate',loadChildren:()=>import('./leadtemplate/leadtemplate.module').then((m)=>m.LeadtemplateModule)},
];

@NgModule({
    imports: [
      CommonModule,
      MatSelectModule,
      MatOptionModule,
      FormsModule,
      CommonModule,
      MatIconModule,
      MatMenuModule,
      MatCheckboxModule,
      PagerModule,
      MatDialogModule,
      MatDatepickerModule,
      MatTableModule,
      MatTabsModule,
      MatTooltipModule,
      MatButtonModule,
      MatFormFieldModule,
      MatChipsModule,
      CapitalizeFirstPipeModule,
      LoadingSpinnerModule,
      NgxPaginationModule,
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

