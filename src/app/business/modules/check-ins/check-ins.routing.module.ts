import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { ProviderWaitlistCheckInDetailComponent } from './provider-waitlist-checkin-detail/provider-waitlist-checkin-detail.component';
import { ApplyLabelComponent } from './apply-label/apply-label.component';

import { CheckInsComponent } from './check-ins.component';
import { ProviderCheckinComponent } from './check-in/provider-checkin.component';
import { ProviderWaitlistCheckInDetailComponent } from './provider-waitlist-checkin-detail/provider-waitlist-checkin-detail.component';
import { CustomViewComponent } from './custom-view/custom-view.component';
// { path: ':id', component: ProviderWaitlistCheckInDetailComponent },
const routes: Routes = [
    { path: '', component: CheckInsComponent },
    {
        path: '',
        children: [
            {path : 'add', component : ProviderCheckinComponent},
            {path: 'custom-view', component: CustomViewComponent},
            { path: ':id', component: ProviderWaitlistCheckInDetailComponent },
            { path: ':id/add-label', component: ApplyLabelComponent},
           ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CheckinsRoutingModule {}
