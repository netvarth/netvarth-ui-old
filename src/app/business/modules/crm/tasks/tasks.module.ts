
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
import { MatSelectModule } from "@angular/material/select";
import { MatOptionModule } from "@angular/material/core";
import { NgxPaginationModule } from "ngx-pagination";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltipModule } from "@angular/material/tooltip";
import { TableModule } from 'primeng/table';
import { ButtonModule } from "primeng/button";
import { FilterModule } from "../../../../shared/modules/filter/filter.module";
import { DropdownModule } from "primeng/dropdown";

const routes: Routes = [
  { path: '', component: TasksComponent },
  { path: 'viewtask/:id', loadChildren: () => import('./view-task/view-task.module').then((m) => m.ViewTaskModule) },
  { path: 'create-task', loadChildren: () => import('./create-task/create-task.module').then((m) => m.CreateTaskModule) },
  { path: 'tasktemplate', loadChildren: () => import('./tasktemplate/tasktemplate.module').then((m) => m.TasktemplateModule) },
];
@NgModule({
  imports: [
    CommonModule,
    MatSelectModule,
    MatOptionModule,
    PagerModule,
    MatDialogModule,
    CapitalizeFirstPipeModule,
    MatIconModule,
    MatMenuModule,
    MatCheckboxModule,
    LoadingSpinnerModule,
    NgxPaginationModule,
    MatDatepickerModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    MatButtonModule,
    MatFormFieldModule,
    MatChipsModule,
    FormsModule,
    TableModule,
    FilterModule,
    ButtonModule,
    DropdownModule,
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
export class TasksModule { }

