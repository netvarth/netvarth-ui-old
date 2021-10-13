import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentmanagerComponent } from './appointmentmanager.component';
import { ShowMessagesModule } from '../../show-messages/show-messages.module';
import { RouterModule, Routes } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
const routes: Routes = [
    { path: '', component: AppointmentmanagerComponent },
    { path: 'schedules', loadChildren: () => import('./schedules/list/waitlist-schedules.module').then(m => m.WaitlistSchedulesModule) },
    {path: 'services', loadChildren: () => import('./services/list/waitlist-services.module').then(m => m.WaitlistServicesModule)},
    {path: 'displayboards', loadChildren: () => import('./displayboards/displayboards.module').then(m => m.DisplayboardsModule)}
];
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MatSlideToggleModule,
        MatCheckboxModule,
        ShowMessagesModule,
        [RouterModule.forChild(routes)]
    ],
    declarations: [
        AppointmentmanagerComponent
    ],
    exports: [AppointmentmanagerComponent]
})
export class AppointmentmanagerModule { }
