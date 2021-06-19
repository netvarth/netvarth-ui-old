import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordsDatagridComponent } from './records-datagrid.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CapitalizeFirstPipeModule } from '../../../../../shared/pipes/capitalize.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoadingSpinnerModule } from '../../../../../shared/modules/loading-spinner/loading-spinner.module';

@NgModule({
  declarations: [RecordsDatagridComponent],
  imports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    CapitalizeFirstPipeModule,
    MatTooltipModule,
    LoadingSpinnerModule
  ],
  exports: [RecordsDatagridComponent]
})
export class RecordsDatagridModule {
}
