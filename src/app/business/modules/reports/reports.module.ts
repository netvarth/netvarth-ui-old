
import { NgModule, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/modules/common/shared.module';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerModule } from '../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { ReportsComponent } from './reports.component';
import { ReportsRoutingModule } from './reports.routing.module';
import { NewReportComponent } from './new-report/new-report.component';
import { ReportDataService } from './reports-data.service';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { MatTableModule, MatFormFieldModule, MatInputModule, MatPaginatorModule, MatDatepickerModule } from '@angular/material';
import { ServiceSelectionComponent } from './service-selection/service-selection.component';
import { ScheduleSelectionComponent } from './schedule-selection/schedule-selection.component';
import { QueueSelectionComponent } from './queue-selection/queue-selection.component';
import { GeneratedReportComponent } from './generated-report/generated-report.component';
import { CustomerSelectionComponent } from './customer-selection/customer-selection.component';



@NgModule({
  imports: [
      SharedModule,
      CommonModule,
      LoadingSpinnerModule,
      ReportsRoutingModule,
      CapitalizeFirstPipeModule,
      MatTableModule,
      MatFormFieldModule,
      MatInputModule,
      MatPaginatorModule,
      MatDatepickerModule


  ],
  declarations: [
    ReportsComponent,
    NewReportComponent,
    ServiceSelectionComponent,
    ScheduleSelectionComponent,
    QueueSelectionComponent,
    GeneratedReportComponent,
    CustomerSelectionComponent,
  ],
  entryComponents: [

  ],
  exports: [
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule
  ],
  providers: [
    ReportDataService
  ]
})

export class ReportsModule implements OnInit {
  ngOnInit() {

  }
}
