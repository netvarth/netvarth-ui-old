
import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import {  MatTableModule } from "@angular/material/table";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { LoadingSpinnerModule } from "../../../../shared/modules/loading-spinner/loading-spinner.module";
import { CrmService } from "../crm.service";
import { TasksComponent } from "./tasks.component";
import { RouterModule, Routes } from "@angular/router";
import { MatTabsModule } from "@angular/material/tabs";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormMessageDisplayModule } from "../../../../shared/modules/form-message-display/form-message-display.module";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { PagerModule } from "../../../../../../src/app/shared/modules/pager/pager.module";
import { MatCheckboxModule } from "@angular/material/checkbox";

const routes: Routes = [
  { path: '', component: TasksComponent },
  {path:'viewtask/:id',loadChildren:()=>import('./view-task/view-task.module').then((m)=>m.ViewTaskModule)},
  // {path:'create-subtask/:taskid',loadChildren:()=>import('./create-task/create-task.module').then((m)=>m.CreateTaskModule),pathMatch: 'full'},
  {path:'create-task',loadChildren:()=>import('./create-task/create-task.module').then((m)=>m.CreateTaskModule)},


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
        [RouterModule.forChild(routes)]
    ],
    exports: [TasksComponent],
    declarations: [TasksComponent],
    providers: [
      CrmService
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ]
})
export class TasksModule {}
