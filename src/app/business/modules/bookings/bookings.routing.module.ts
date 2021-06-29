import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookingsComponent } from './bookings.component';

const routes: Routes = [
    { path: '', component: BookingsComponent },
    { path: 'appointments', loadChildren: () => import('./appointments/appointments.module').then(m => m.AppointmentsModule) },
    { path: 'checkins', loadChildren: () => import('./check-ins/check-ins.module').then(m => m.CheckinsModule) },
    { path: ':id', loadChildren: () => import('./booking-detail/booking-detail.module').then(m => m.BookingDetailModule) }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class BookingsRoutingModule { }
