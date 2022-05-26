
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CapitalizeFirstPipeModule } from "../../../shared/pipes/capitalize.module";
import { LoadingSpinnerModule } from "../../../shared/modules/loading-spinner/loading-spinner.module";
import { CrmService } from "./crm.service";
import { CRMComponent } from "./crm.component"
import { RouterModule, Routes } from "@angular/router";
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from "@angular/material/icon";
const routes: Routes = [
  { path: '', component: CRMComponent },
  { path: 'leads', loadChildren: () => import('./leads/leads.module').then(m => m.LeadsModule) },
  { path: 'tasks', loadChildren: () => import('./tasks/tasks.module').then(m => m.TasksModule) },
  { path: 'enquiry', loadChildren: () => import('./enquiry/enquiry.module').then(m => m.EnquiryModule) },

];

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatExpansionModule,
    CapitalizeFirstPipeModule,
    LoadingSpinnerModule,
    [RouterModule.forChild(routes)],
  ],
  exports: [CRMComponent],
  declarations: [CRMComponent],
  providers: [CrmService]
})
export class crmModule { }
