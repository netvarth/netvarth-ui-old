import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import {  MatTableModule } from "@angular/material/table";
import { CapitalizeFirstPipeModule } from "../../../../../shared/pipes/capitalize.module";
import { LoadingSpinnerModule } from "../../../../../shared/modules/loading-spinner/loading-spinner.module";
import { CrmService } from "../../crm.service";
import { RouterModule, Routes } from "@angular/router";
import { MatTabsModule } from "@angular/material/tabs";
import { ViewTaskComponent } from "./view-task.component";
import { MenuModule } from "../../../../../business/home/menu/menu.module";
import { AppointmentsComponent } from "./appointments/appointments.component";
import { TaskActivityComponent } from "./task-activity/task-activity.component";
import { ConnectionsComponent } from "./connections/connections.component";
import { SubtasksComponent } from "./subtasks/subtasks.component";
import { ProviderServices } from "../../../../../business/services/provider-services.service";
import { SelectAttachmentComponent } from "./select-attachment/select-attachment.component";

const routes: Routes = [
  { path: '', component: ViewTaskComponent },
  
];

@NgModule({
  declarations: [
    ViewTaskComponent,
    AppointmentsComponent,
    TaskActivityComponent,
    ConnectionsComponent,
    SubtasksComponent,
    SelectAttachmentComponent
  ],
  imports: [
    CommonModule,
    LoadingSpinnerModule,
    MatTableModule,
    MatDialogModule,
    MatTabsModule,
    CapitalizeFirstPipeModule,
    MenuModule,
    LoadingSpinnerModule,
    [RouterModule.forChild(routes)],
    
  ],
  providers: [
    CrmService,
    ProviderServices
  ],
  schemas: [
      CUSTOM_ELEMENTS_SCHEMA,
      NO_ERRORS_SCHEMA
  ]
})
export class ViewTaskModule { }
