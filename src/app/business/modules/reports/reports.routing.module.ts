import { NgModule } from '@angular/core';
import { RouterModule, Routes, } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { NewReportComponent } from './new-report/new-report.component';
import { ServiceSelectionComponent } from './service-selection/service-selection.component';
import { ScheduleSelectionComponent } from './schedule-selection/schedule-selection.component';
import { QueueSelectionComponent } from './queue-selection/queue-selection.component';
import { GeneratedReportComponent } from './generated-report/generated-report.component';
import { CustomerSelectionComponent } from './customer-selection/customer-selection.component';
import { UserSelectionComponent } from './new-report/user-selection/user-selection.component';
import { UserReportComponent } from './user-report/user-report.component';
import { UserDetailReportComponent } from './user-report/user-detail-report/user-detail-report.component';



const routes: Routes = [
  {
    path: '', component: ReportsComponent
  },
  {
    path: '',
    children: [
      {
        path: 'new-report', component: NewReportComponent
      },
      { path: 'user-report', component: UserReportComponent},
      { path: 'user-details', component: UserDetailReportComponent},   
    
      { path: 'service', component: ServiceSelectionComponent },
      { path: 'schedule', component: ScheduleSelectionComponent },
      { path: 'queue', component: QueueSelectionComponent },
      { path: 'generated-report', component: GeneratedReportComponent },
      { path: 'customer', component: CustomerSelectionComponent },
      { path: 'user', component: UserSelectionComponent },
    ]
  }



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ReportsRoutingModule {

}
