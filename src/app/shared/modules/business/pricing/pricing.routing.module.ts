import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PricingComponent } from './pricing.component';

const routes: Routes = [
    { path: '', component: PricingComponent }
    
    
    // { path: 'doctors', loadChildren: './doctors/doctors.module#DoctorsModule' },
    // { path: 'corporate', loadChildren: './corporate/corporate.module#CorporateModule' },
    // { path: 'notifications', loadChildren: './notifications/notifications.module#NotificationsModule'}
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class PricingRoutingModule {}
