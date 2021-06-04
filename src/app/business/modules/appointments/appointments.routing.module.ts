import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppointmentComponent } from './appointment/appointment.component';
import { BookingDetailComponent } from '../bookings/booking-detail/booking-detail.component';
import { AppointmentsComponent } from './appointments.component';
// import { ProviderAppointmentDetailComponent } from './provider-appointment-detail/provider-appointment-detail.component';
import { AdjustscheduleDelayComponent } from './schedule-delay/adjust-schedule-delay.component';
// import { UserServiceChnageComponent } from '../../../shared/components/user-service-change/user-service-change.component';
const routes: Routes = [
    { path: '', component: AppointmentsComponent },
    {
        path: '',
        children: [
            { path: 'adjustdelay', component: AdjustscheduleDelayComponent },
            { path: 'appointment', component: AppointmentComponent },
            { path: 'questionnaire', loadChildren: () => import('../../../shared/components/questionnaire/questionnaire.module').then(m => m.QuestionnaireModule) },
            { path: ':id', component: BookingDetailComponent },
            // { path: ':id/user', component: UserServiceChnageComponent }
            { path: ':id/user', loadChildren: () => import('../../../shared/modules/user-service-change/user-service-change.module').then(m => m.UserServiceChangeModule) },
            
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AppointmentsRoutingModule { }
