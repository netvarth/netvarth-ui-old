import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookingsComponent } from './bookings.component';

const routes: Routes = [
    { path: '', component: BookingsComponent },
    { path: 'appointments', loadChildren: () => import('./appointments/appointments.module').then(m => m.AppointmentsModule) },
    { path: 'checkins', loadChildren: () => import('./check-ins/check-ins.module').then(m => m.CheckinsModule) },
    { path: 'details', loadChildren: () => import('./booking-detail/booking-detail.module').then(m => m.BookingDetailModule) },
    { path: 'documents', loadChildren: () => import('./booking-documents/booking-documents.module').then(m => m.BookingDocumentsModule) },
    { path: 'bills', loadChildren: () => import('./records-datagrid/records-datagrid.module').then(m => m.RecordsDatagridModule) },
    { path: ':userid', loadChildren: () => import('./booking-dashboard/booking-dashboard.module').then(m => m.BookingDashboardModule) }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class BookingsRoutingModule { }
