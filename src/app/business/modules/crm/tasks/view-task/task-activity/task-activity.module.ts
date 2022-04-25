import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { TaskActivityComponent } from './task-activity.component';
import { CapitalizeFirstPipeModule } from '../../../../../../shared/pipes/capitalize.module';



@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    CapitalizeFirstPipeModule
  ],
})
export class TaskActivityModule { }
