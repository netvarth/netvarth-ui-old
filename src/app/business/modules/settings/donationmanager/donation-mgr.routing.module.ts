import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DonationCauseListComponent } from './causes/causes.component';
import { DonationMgrComponent } from './donation-mgr.component';
import { CauseDetailComponent } from './causes/detail/cause-details.component';
const routes: Routes = [
    { path: '', component: DonationMgrComponent },
    { path: 'causes', component: DonationCauseListComponent },
    { path: 'causes/:id', component: CauseDetailComponent },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DonationMgrRoutingModule { }
