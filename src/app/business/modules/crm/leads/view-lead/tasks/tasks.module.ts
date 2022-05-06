import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksComponent } from './Tasks.component';
import { PagerComponent } from '../../../../../../../../src/app/shared/modules/pager/pager.component';
import { RouterModule, Routes } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { FileService } from '../../../../../../../../src/app/shared/services/file-service';
import { CrmService } from '../../../crm.service';


const routes: Routes = [
  { path: '', component: TasksComponent },
  // {path:'create-task/:id',loadChildren:()=>import('../../../tasks/create-task/create-task.module').then((m)=>m.CreateTaskModule)},

];

@NgModule({
  declarations: [
    // TasksComponent,
    PagerComponent,
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    [RouterModule.forChild(routes)]
  ],
  providers: [
    CrmService,
    FileService
  ],
  schemas: [
      CUSTOM_ELEMENTS_SCHEMA,
      NO_ERRORS_SCHEMA
  ]
})
export class TasksModule { }
