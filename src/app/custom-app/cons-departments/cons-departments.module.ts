import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsDepartmentsComponent } from './cons-departments.component';
import { CardModule } from '../../shared/components/card/card.module';

@NgModule({
  declarations: [
    ConsDepartmentsComponent
  ],
  imports: [
    CommonModule,
    CardModule
  ],
  exports: [
    ConsDepartmentsComponent
  ]
})
export class ConsDepartmentsModule { }
