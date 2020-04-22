import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProviderWaitlistCheckInDetailComponent } from './provider-waitlist-checkin-detail.component';
const routes: Routes = [
    { path: '', component: ProviderWaitlistCheckInDetailComponent }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProviderWaitlistCheckInDetailRoutingModule { }
