import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DonationCauseListComponent } from './list/donation-list.component';
import { DonationDetailComponent } from './detail/donation-detail.component';
import { DonationMgrComponent } from './donation-mgr.component';
import { from } from 'rxjs';
const routes: Routes = [
    { path: '', component: DonationMgrComponent },
    { path: 'causes', component: DonationCauseListComponent },
    { path: ':id', component: DonationDetailComponent }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DonationRoutingModule {}
