import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckinsComponent } from './check-ins.component';
import { RecordsDatagridModule } from '../booking-dashboard-admin/records-datagrid/records-datagrid.module';

@NgModule({
  declarations: [CheckinsComponent],
  imports: [
    CommonModule,
    RecordsDatagridModule
  ],
  exports: [CheckinsComponent]
})
export class CheckinsModule {
}
