import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookingDetailComponent } from '../bookings/booking-detail/booking-detail.component';
import { AppointmentsComponent } from './appointments.component';
// import { ProviderAppointmentDetailComponent } from './provider-appointment-detail/provider-appointment-detail.component';
import { AdjustscheduleDelayComponent } from './schedule-delay/adjust-schedule-delay.component';
const routes: Routes = [
    { path: '', component: AppointmentsComponent },
    {
        path: '',
        children: [
            { path: 'adjustdelay', component: AdjustscheduleDelayComponent },
            { path: 'questionnaire', loadChildren: () => import('../../../shared/components/questionnaire/questionnaire.module').then(m => m.QuestionnaireModule) },
            { path: ':id', component: BookingDetailComponent }
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AppointmentsRoutingModule { }
