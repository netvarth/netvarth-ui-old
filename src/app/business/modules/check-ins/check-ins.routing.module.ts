import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplyLabelComponent } from './apply-label/apply-label.component';
import { CheckInsComponent } from './check-ins.component';
import { ProviderCheckinComponent } from './check-in/provider-checkin.component';
import { AdjustqueueDelayComponent } from './adjustqueue-delay/adjustqueue-delay.component';
import { ProviderWaitlistCheckInDetailComponent } from './provider-waitlist-checkin-detail/provider-waitlist-checkin-detail.component';
const routes: Routes = [
    { path: '', component: CheckInsComponent },
    {path: 'teleservice', loadChildren: () => import('./calling-modes/calling-modes.module').then(m => m.CallingModesModule)},
    {
        path: '',
        children: [
            { path: 'add', component: ProviderCheckinComponent },
            { path: 'adjustdelay', component: AdjustqueueDelayComponent },
            { path: ':id', component: ProviderWaitlistCheckInDetailComponent },
            { path: ':id/add-label', component: ApplyLabelComponent }
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CheckinsRoutingModule { }
