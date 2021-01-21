
import { NgModule, OnInit,  NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '../../../shared/modules/common/shared.module';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerModule } from '../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { ReportsComponent } from './reports.component';
import { ReportsRoutingModule } from './reports.routing.module';
import { NewReportComponent } from './new-report/new-report.component';
import { ReportDataService } from './reports-data.service';
import { ExportReportService } from './export-report.service';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ServiceSelectionComponent } from './service-selection/service-selection.component';
import { ScheduleSelectionComponent } from './schedule-selection/schedule-selection.component';
import { QueueSelectionComponent } from './queue-selection/queue-selection.component';
import { GeneratedReportComponent } from './generated-report/generated-report.component';
import { CustomerSelectionComponent } from './customer-selection/customer-selection.component';
import { CriteriaDialogComponent } from './generated-report/criteria-dialog/criteria-dialog.component';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

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
      MatDatepickerModule,
      MatListModule,
      MatSelectModule,
      MatOptionModule


  ],
  declarations: [
    ReportsComponent,
    NewReportComponent,
    ServiceSelectionComponent,
    ScheduleSelectionComponent,
    QueueSelectionComponent,
    GeneratedReportComponent,
    CustomerSelectionComponent,
    CriteriaDialogComponent,

  ],
  entryComponents: [
    CriteriaDialogComponent
  ],
  exports: [
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule
  ],
  providers: [
    ReportDataService,
    ExportReportService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})

export class ReportsModule implements OnInit {
  ngOnInit() {

  }
}
