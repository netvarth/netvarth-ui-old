import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckinsComponent } from './check-ins.component';
import { RecordsDatagridModule } from '../records-datagrid/records-datagrid.module';
import { CheckinsRoutingModule } from './check-ins.routing.module';
import { FormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { LoadingSpinnerModule } from '../../../../shared/modules/loading-spinner/loading-spinner.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CapitalizeFirstPipeModule } from '../../../../shared/pipes/capitalize.module';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [CheckinsComponent],
  imports: [
    CommonModule,
    CheckinsRoutingModule,
    RecordsDatagridModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    LoadingSpinnerModule,
    MatDatepickerModule,
    MatCheckboxModule,
    CapitalizeFirstPipeModule,
    MatTooltipModule
  ],
  exports: [CheckinsComponent]
})
export class CheckinsModule {
}
