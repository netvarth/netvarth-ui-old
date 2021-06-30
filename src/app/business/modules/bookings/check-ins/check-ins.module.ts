import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckinsComponent } from './check-ins.component';
import { RecordsDatagridModule } from '../records-datagrid/records-datagrid.module';
import { CheckinsRoutingModule } from './check-ins.routing.module';
import { FormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { LoadingSpinnerModule } from '../../../../shared/modules/loading-spinner/loading-spinner.module';

@NgModule({
  declarations: [CheckinsComponent],
  imports: [
    CommonModule,
    RecordsDatagridModule,
    CheckinsRoutingModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    LoadingSpinnerModule
  ],
  exports: [CheckinsComponent]
})
export class CheckinsModule {
}
