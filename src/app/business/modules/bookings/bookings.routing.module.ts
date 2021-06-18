import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookingsComponent } from './bookings.component';

const routes: Routes = [
    { path: '', component: BookingsComponent },
    { path: ':id', loadChildren: () => import('./booking-detail/booking-detail.module').then(m => m.BookingDetailModule) }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class BookingsRoutingModule { }
