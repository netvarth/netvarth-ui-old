import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DonationsComponent } from './donations.component';
import { DonationDetailsComponent } from './details/donation-details.component';

const routes: Routes = [
    { path: '', component: DonationsComponent },
    {
        path: '',
        children: [
            { path: ':id', component: DonationDetailsComponent }
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DonationsRoutingModule {

}
