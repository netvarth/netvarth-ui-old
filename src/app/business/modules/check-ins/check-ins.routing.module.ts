import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { ProviderWaitlistCheckInDetailComponent } from './provider-waitlist-checkin-detail/provider-waitlist-checkin-detail.component';
import { ApplyLabelComponent } from './apply-label/apply-label.component';

import { CheckInsComponent } from './check-ins.component';
import { ProviderCheckinComponent } from './check-in/provider-checkin.component';
import { ProviderWaitlistCheckInDetailComponent } from './provider-waitlist-checkin-detail/provider-waitlist-checkin-detail.component';
import { CustomViewComponent } from './custom-view/custom-view.component';
import { ProviderCreateCheckinComponent } from './check-in/provider-create-checkin/provider-create-checkin.component';
import { from } from 'rxjs';
import { CustomViewListComponent } from './custom-view-list/custom-view-list.component';
// { path: ':id', component: ProviderWaitlistCheckInDetailComponent },
const routes: Routes = [
    { path: '', component: CheckInsComponent },
    {
        path: '',
        children: [
            {path : 'create' ,component :ProviderCreateCheckinComponent },
            {path : 'add', component : ProviderCheckinComponent},
            {path: 'custom-view', component: CustomViewComponent},
            {path: 'custom-view-list' , component: CustomViewListComponent},
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
