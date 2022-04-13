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
import { SelectAttachmentComponent } from "./select-attachment/select-attachment.component";
import { MatSliderModule } from "@angular/material/slider";
import { ActivitylogComponent } from "./activitylog/activitylog.component";

const routes: Routes = [
  { path: '', component: ViewTaskComponent },
  {path:'create-task',loadChildren:()=>import('../create-task/create-task.module').then((m)=>m.CreateTaskModule)},
  {path:'viewtask/:id',loadChildren:()=>import('../view-task/view-task.module').then((m)=>m.ViewTaskModule)},
];

@NgModule({
  declarations: [
    ViewTaskComponent,
    AppointmentsComponent,
    TaskActivityComponent,
    ConnectionsComponent,
    SubtasksComponent,
    ActivitylogComponent,
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
    MatSliderModule,
    LoadingSpinnerModule,
    [RouterModule.forChild(routes)],
    
  ],
  providers: [
    CrmService
  ],
  schemas: [
      CUSTOM_ELEMENTS_SCHEMA,
      NO_ERRORS_SCHEMA
  ]
})
export class ViewTaskModule { }
