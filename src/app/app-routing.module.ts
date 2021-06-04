import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './shared/components/home/home.component';
import { LogoutComponent } from './shared/components/logout/logout.component';
import { AuthGuardConsumer, AuthGuardHome } from './shared/guard/auth.guard';
import { ReturnPaymentComponent } from './shared/components/return-payment/return-payment.component';
import { BusinessPageComponent } from './shared/components/business-page/business-page.component';
import { MaintenanceComponent } from './shared/modules/maintenance/maintenance.component';
import { ConsumerJoinComponent } from './ynw_consumer/components/consumer-join/join.component';
import { DepartmentServicePageComponent } from './shared/components/department-service-page/department-service-page.component';
const routes: Routes = [
    {
        path: 'consumer', loadChildren: () => import('./ynw_consumer/consumer.module').then(m => m.ConsumerModule),
        canActivate: [AuthGuardConsumer]
    },
    { path: '', component: HomeComponent},
    { path: 'home', redirectTo: '', pathMatch: 'full', canActivate: [AuthGuardHome] },
    { path: 'logout', component: LogoutComponent },
    { path: 'not-found', loadChildren: () => import('./shared/modules/not-found/not-found.module').then(m => m.NotFoundModule) },
    { path: 'payment-return/:id', component: ReturnPaymentComponent },
    { path: 'meeting/:phonenumber', loadChildren: () => import('./shared/modules/tele-home/tele-home.module').then(m => m.TeleHomeModule)},
    { path: 'maintenance', component: MaintenanceComponent },
    { path: 'consumer-join', component: ConsumerJoinComponent },
    { path: ':id', component: BusinessPageComponent },
    { path: ':id/department/:deptId', component: DepartmentServicePageComponent },
    { path: ':id/:userEncId', component: BusinessPageComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        // preloadingStrategy: PreloadAllModules
    })],
    exports: [RouterModule]
})
export class AppRoutingModule { }

