import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { CheckInsDashboardComponent } from './check-ins/check-ins.component';
import { Routes, RouterModule } from '@angular/router';
import { ProviderWaitlistCheckInDetailComponent } from '../../../ynw_provider/components/provider-waitlist-checkin-detail/provider-waitlist-checkin-detail.component';

const routes: Routes = [
    { path: '', component: DashboardComponent },
    {
        path: '',
        children: [
            { path: 'check-ins', component: CheckInsDashboardComponent },
            { path: 'check-ins/:id', component: ProviderWaitlistCheckInDetailComponent }
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule {}
