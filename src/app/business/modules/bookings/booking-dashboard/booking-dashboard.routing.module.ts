import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookingDashboardComponent } from './booking-dashboard.component';

const routes: Routes = [
    { path: '', component: BookingDashboardComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class BookingsDashboardRoutingModule {}
