
import { NgModule, OnInit,  NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerModule } from '../../../shared/modules/loading-spinner/loading-spinner.module';
import { ReportsComponent } from './reports.component';
import { ReportDataService } from './reports-data.service';
import { ExportReportService } from './export-report.service';
import { CapitalizeFirstPipeModule } from '../../../shared/pipes/capitalize.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  { path: '', component: ReportsComponent },
  { path: '', children: [
      { path: 'new-report', loadChildren: ()=> import('./new-report/new-report.module').then(m=>m.NewReportModule)},
      { path: 'report-list', loadChildren: ()=> import('./report-list/report-list.module').then(m=>m.ReportListModule)},
      { path: 'user-report', loadChildren: ()=> import('./user-report/user-report.module').then(m=>m.UserReportModule)},
      { path: 'user-details', loadChildren: ()=> import('./user-report/user-detail-report/user-detail-report.module').then(m=>m.UserDetailReportModule)},   
      { path: 'service', loadChildren: ()=> import('./service-selection/service-selection.module').then(m=>m.ServiceSelectionModule)},
      { path: 'schedule', loadChildren: ()=> import('./schedule-selection/schedule-selection.module').then(m=>m.ScheduleSelectionModule)},
      { path: 'queue', loadChildren: ()=> import('./queue-selection/queue-selection.module').then(m=>m.QueueSelectionModule)},
      { path: 'generated-report', loadChildren: ()=> import('./generated-report/generated-report.module').then(m=>m.GeneratedReportModule)},
      { path: 'customer', loadChildren: ()=> import('./customer-selection/customer-selection.module').then(m=>m.CustomerSelectionModule)},
      { path: 'user', loadChildren: ()=> import('./new-report/user-selection/user-selection.module').then(m=>m.UserSelectionModule)}
    ]
  }
];
@NgModule({
  imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      LoadingSpinnerModule,
      CapitalizeFirstPipeModule,
      MatTableModule,
      MatFormFieldModule,
      MatInputModule,
      MatPaginatorModule,
      MatDatepickerModule,
      MatListModule,
      MatSelectModule,
      MatOptionModule,
      MatExpansionModule,
      MatCheckboxModule,
      MatProgressSpinnerModule,
      [RouterModule.forChild(routes)]
  ],
  declarations: [
    ReportsComponent
  ],
  exports: [ReportsComponent],
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
