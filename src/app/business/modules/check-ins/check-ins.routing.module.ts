import { NgModule } from '@angular/core';
import { CheckInsComponent } from './check-ins.component';
import { Routes, RouterModule } from '@angular/router';
import { ProviderWaitlistCheckInDetailComponent } from './provider-waitlist-checkin-detail/provider-waitlist-checkin-detail.component';
import { ApplyLabelComponent } from './apply-label/apply-label.component';

const routes: Routes = [
    { path: '', component: CheckInsComponent },
    {
        path: '',
        children: [
            { path: ':id', component: ProviderWaitlistCheckInDetailComponent },
            { path: ':id/add-label', component: ApplyLabelComponent}
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CheckinsRoutingModule {}
