import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { CheckInsDashboardComponent } from './check-ins/check-ins.component';
import { Routes, RouterModule } from '@angular/router';
import { ProviderWaitlistCheckInDetailComponent } from '../../../ynw_provider/components/provider-waitlist-checkin-detail/provider-waitlist-checkin-detail.component';
import { ApplyLabelComponent } from './apply-label/apply-label.component';

const routes: Routes = [
    { path: '', component: DashboardComponent },
    {
        path: '',
        children: [
            { path: 'check-ins', component: CheckInsDashboardComponent },
            { path: 'check-ins/:id', component: ProviderWaitlistCheckInDetailComponent },
            { path: 'check-ins/:id/add-label', component: ApplyLabelComponent}
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule {}
