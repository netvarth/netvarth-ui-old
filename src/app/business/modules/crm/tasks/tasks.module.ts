import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksComponent } from './tasks.component';
import { CrmService } from '../crm.service';



@NgModule({
  declarations: [
    TasksComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [
    CrmService
  ]
})
export class TasksModule { }
