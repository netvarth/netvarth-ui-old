import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WaitlistServicesComponent } from './list/waitlist-services.component';
import { WaitlistServiceDetailComponent } from './details/waitlistservice-detail.component';

const routes: Routes = [
    { path: '', component: WaitlistServicesComponent },
    { path: ':sid', component: WaitlistServiceDetailComponent }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WaitlistServicesRoutingModule {}
