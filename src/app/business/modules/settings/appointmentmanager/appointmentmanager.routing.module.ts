import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentmanagerComponent } from './appointmentmanager.component';
import { AppointmentComponent } from './appointment/appointment.component';


const routes: Routes = [
    { path: '', component: AppointmentmanagerComponent },
    { path: 'appointments', component: AppointmentComponent },
    { path: 'schedules', loadChildren: () => import('./schedules/waitlist-schedules.module').then(m => m.WaitlistSchedulesModule) },
    {path: 'services', loadChildren: () => import('./services/waitlist-services.module').then(m => m.WaitlistServicesModule)},
    {path: 'displayboards', loadChildren: () => import('./displayboards/displayboards.module').then(m => m.DisplayboardsModule)}
    

];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AppointmentmanagerRoutingModule { }
