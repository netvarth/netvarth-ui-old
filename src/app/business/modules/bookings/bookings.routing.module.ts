import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: '', loadChildren: () => import('./booking-dashboard/booking-dashboard.module').then(m => m.BookingDashboardModule) },
    { path: ':id', loadChildren: () => import('./booking-detail/booking-detail.module').then(m => m.BookingDetailModule) }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class BookingsRoutingModule { }
