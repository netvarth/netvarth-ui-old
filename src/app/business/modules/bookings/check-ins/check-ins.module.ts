import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckinsComponent } from './check-ins.component';
import { RecordsDatagridModule } from '../records-datagrid/records-datagrid.module';
import { CheckinsRoutingModule } from './check-ins.routing.module';

@NgModule({
  declarations: [CheckinsComponent],
  imports: [
    CommonModule,
    RecordsDatagridModule,
    CheckinsRoutingModule
  ],
  exports: [CheckinsComponent]
})
export class CheckinsModule {
}
