
import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { CapitalizeFirstPipeModule } from "../../../../shared/pipes/capitalize.module";
import { LoadingSpinnerModule } from "../../../../shared/modules/loading-spinner/loading-spinner.module";
import { CrmService } from "../crm.service";
import { TasksComponent } from "./tasks.component";
import { RouterModule, Routes } from "@angular/router";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { PagerModule } from "../../../../../../src/app/shared/modules/pager/pager.module";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { NgCircleProgressModule } from "ng-circle-progress";
import { MatSelectModule } from "@angular/material/select";
import { MatOptionModule } from "@angular/material/core";
const routes: Routes = [
  { path: '', component: TasksComponent },
  {path:'viewtask/:id',loadChildren:()=>import('./view-task/view-task.module').then((m)=>m.ViewTaskModule)},
  {path:'create-task',loadChildren:()=>import('./create-task/create-task.module').then((m)=>m.CreateTaskModule)},
  {path:'tasktemplate',loadChildren:()=>import('./tasktemplate/tasktemplate.module').then((m)=>m.TasktemplateModule)},
];
@NgModule({
    imports: [
        CommonModule,
        PagerModule,
        MatDialogModule,
        CapitalizeFirstPipeModule,
        MatIconModule,
        MatMenuModule,
        MatCheckboxModule,
        LoadingSpinnerModule,
        MatSelectModule,
        MatOptionModule,
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

