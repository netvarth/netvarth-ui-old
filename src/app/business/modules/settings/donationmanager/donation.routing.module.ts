import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DonationCauseListComponent } from './list/donation-list.component';
import { DonationDetailComponent } from './detail/donation-detail.component';

const routes: Routes = [
    { path: '', component: DonationCauseListComponent },
    { path: ':sid', component: DonationDetailComponent }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DonationRoutingModule {}
