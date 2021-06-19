import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookingDetailComponent } from './booking-detail/booking-detail.component';
import { BookingsComponent } from './bookings.component';

const routes: Routes = [
    { path: '', component: BookingsComponent },
    { path: ':id', component: BookingDetailComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class BookingsRoutingModule { }
