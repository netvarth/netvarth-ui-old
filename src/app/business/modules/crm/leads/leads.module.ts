
import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { LoadingSpinnerModule } from "../../../../shared/modules/loading-spinner/loading-spinner.module";
import { CrmService } from "../crm.service";
import { LeadsComponent } from "./leads.component";
import { RouterModule, Routes } from "@angular/router";
import { PagerModule } from "../../../../../../src/app/shared/modules/pager/pager.module";

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
        PagerModule,
        MatDialogModule,
        CapitalizeFirstPipeModule,
        LoadingSpinnerModule,
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

