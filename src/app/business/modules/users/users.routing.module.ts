import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProviderNonworkingdaysComponent } from '../../../ynw_provider/components/provider-nonworkingdays/provider-nonworkingdays.component';
import { UsersComponent } from './users.component';

const routes: Routes = [
    { path: '', component: UsersComponent },
    
    
    { path: 'doctors', loadChildren: './doctors/doctors.module#DoctorsModule' },
    { path: 'corporate', loadChildren: './corporate/corporate.module#CorporateModule' },
    { path: 'notifications', loadChildren: './notifications/notifications.module#NotificationsModule'}
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class UsersRoutingModule {}
